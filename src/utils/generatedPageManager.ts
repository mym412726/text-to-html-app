import { GeneratedPage, GeneratedPageFilter, GeneratedPageStats } from '@/types/generatedPage';
import { ParsedContent } from './textToHtmlParser';

const STORAGE_KEY = 'generated_pages';

export class GeneratedPageManager {
  // 获取所有生成的页面
  static getAllPages(): GeneratedPage[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const pages = JSON.parse(stored);
      return pages.map((page: any) => ({
        ...page,
        createdAt: new Date(page.createdAt),
        updatedAt: new Date(page.updatedAt)
      }));
    } catch (error) {
      console.error('获取生成页面失败:', error);
      return [];
    }
  }

  // 保存新的生成页面
  static savePage(
    parsedContent: ParsedContent, 
    originalText: string, 
    generationMode: 'local' | 'deepseek',
    customTitle?: string
  ): GeneratedPage {
    const pages = this.getAllPages();
    const now = new Date();
    
    // 生成预览文本（去除HTML标签）
    const preview = originalText.replace(/<[^>]*>/g, '').substring(0, 100);
    
    // 自动生成标签
    const tags = this.generateTags(originalText, parsedContent.htmlContent);
    
    const newPage: GeneratedPage = {
      id: `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: customTitle || parsedContent.title || this.generateTitle(originalText),
      content: originalText,
      htmlContent: parsedContent.htmlContent,
      createdAt: now,
      updatedAt: now,
      wordCount: parsedContent.wordCount,
      estimatedReadTime: parsedContent.estimatedReadTime,
      tags,
      generationMode,
      preview
    };

    pages.unshift(newPage); // 添加到开头
    this.saveToStorage(pages);
    return newPage;
  }

  // 更新页面
  static updatePage(id: string, updates: Partial<GeneratedPage>): boolean {
    try {
      const pages = this.getAllPages();
      const index = pages.findIndex(page => page.id === id);
      
      if (index === -1) return false;
      
      pages[index] = {
        ...pages[index],
        ...updates,
        updatedAt: new Date()
      };
      
      this.saveToStorage(pages);
      return true;
    } catch (error) {
      console.error('更新页面失败:', error);
      return false;
    }
  }

  // 删除页面
  static deletePage(id: string): boolean {
    try {
      const pages = this.getAllPages();
      const filteredPages = pages.filter(page => page.id !== id);
      
      if (filteredPages.length === pages.length) return false;
      
      this.saveToStorage(filteredPages);
      return true;
    } catch (error) {
      console.error('删除页面失败:', error);
      return false;
    }
  }

  // 批量删除页面
  static deletePages(ids: string[]): number {
    try {
      const pages = this.getAllPages();
      const filteredPages = pages.filter(page => !ids.includes(page.id));
      const deletedCount = pages.length - filteredPages.length;
      
      this.saveToStorage(filteredPages);
      return deletedCount;
    } catch (error) {
      console.error('批量删除页面失败:', error);
      return 0;
    }
  }

  // 根据ID获取页面
  static getPageById(id: string): GeneratedPage | null {
    const pages = this.getAllPages();
    return pages.find(page => page.id === id) || null;
  }

  // 过滤和排序页面
  static filterPages(filter: GeneratedPageFilter): GeneratedPage[] {
    let pages = this.getAllPages();

    // 搜索过滤
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      pages = pages.filter(page => 
        page.title.toLowerCase().includes(searchLower) ||
        page.content.toLowerCase().includes(searchLower) ||
        page.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // 生成模式过滤
    if (filter.generationMode !== 'all') {
      pages = pages.filter(page => page.generationMode === filter.generationMode);
    }

    // 排序
    pages.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filter.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'wordCount':
          aValue = a.wordCount;
          bValue = b.wordCount;
          break;
        case 'updatedAt':
          aValue = a.updatedAt.getTime();
          bValue = b.updatedAt.getTime();
          break;
        case 'createdAt':
        default:
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
      }
      
      if (filter.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return pages;
  }

  // 获取统计信息
  static getStats(): GeneratedPageStats {
    const pages = this.getAllPages();
    
    return {
      totalPages: pages.length,
      totalWords: pages.reduce((sum, page) => sum + page.wordCount, 0),
      localGenerated: pages.filter(page => page.generationMode === 'local').length,
      aiGenerated: pages.filter(page => page.generationMode === 'deepseek').length
    };
  }

  // 导出页面为JSON
  static exportPage(id: string): string | null {
    const page = this.getPageById(id);
    if (!page) return null;
    
    return JSON.stringify(page, null, 2);
  }

  // 导出所有页面
  static exportAllPages(): string {
    const pages = this.getAllPages();
    return JSON.stringify(pages, null, 2);
  }

  // 清空所有页面
  static clearAllPages(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  // 私有方法：保存到本地存储
  private static saveToStorage(pages: GeneratedPage[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    } catch (error) {
      console.error('保存到本地存储失败:', error);
      throw new Error('存储空间不足或数据过大');
    }
  }

  // 私有方法：生成标题
  private static generateTitle(content: string): string {
    // 尝试从内容中提取第一行作为标题
    const lines = content.trim().split('\n');
    const firstLine = lines[0]?.trim();
    
    if (firstLine && firstLine.length > 0 && firstLine.length <= 100) {
      // 移除Markdown标记
      return firstLine.replace(/^#+\s*/, '').replace(/\*\*|\*|`/g, '');
    }
    
    // 如果第一行不适合作为标题，生成默认标题
    const timestamp = new Date().toLocaleString('zh-CN');
    return `生成页面 - ${timestamp}`;
  }

  // 私有方法：生成标签
  private static generateTags(content: string, htmlContent: string): string[] {
    const tags: string[] = [];
    
    // 根据内容长度添加标签
    if (content.length > 5000) {
      tags.push('长文章');
    } else if (content.length > 1000) {
      tags.push('中等长度');
    } else {
      tags.push('短文章');
    }
    
    // 检查是否包含代码
    if (content.includes('```') || content.includes('`')) {
      tags.push('包含代码');
    }
    
    // 检查是否包含列表
    if (content.includes('- ') || content.includes('* ') || /\d+\. /.test(content)) {
      tags.push('包含列表');
    }
    
    // 检查是否包含链接
    if (content.includes('http') || content.includes('[') && content.includes('](')) {
      tags.push('包含链接');
    }
    
    // 检查是否包含标题
    if (content.includes('#')) {
      tags.push('包含标题');
    }
    
    return tags;
  }
}