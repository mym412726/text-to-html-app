export interface ParsedContent {
  title: string;
  content: string;
  htmlContent: string;
  summary: string;
  wordCount: number;
  estimatedReadTime: number;
}

export class TextToHtmlParser {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private static detectLanguage(text: string): string {
    // 简单的语言检测逻辑
    const chineseRegex = /[\u4e00-\u9fa5]/;
    return chineseRegex.test(text) ? 'zh' : 'en';
  }

  private static getIconForType(type: string): string {
    const icons = {
      h1: '🎯',
      h2: '📌',
      h3: '🔸',
      h4: '▪️',
      h5: '•',
      h6: '◦',
      code: '💻',
      quote: '💬',
      list: '📝',
      link: '🔗',
      text: '📄'
    };
    return icons[type as keyof typeof icons] || '📄';
  }

  private static parseMarkdownLikeText(text: string): string {
    let html = '';
    const lines = text.split('\n');
    let inList = false;
    let listType = '';
    let listItems: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // 空行处理
      if (trimmedLine === '') {
        if (inList) {
          html += this.renderList(listItems, listType);
          inList = false;
          listItems = [];
        }
        html += '<br/>\n';
        continue;
      }

      // 标题检测 (# ## ### 等) - 现代化设计
      const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        if (inList) {
          html += this.renderList(listItems, listType);
          inList = false;
          listItems = [];
        }
        const level = headerMatch[1].length;
        const headerText = this.escapeHtml(headerMatch[2]);
        
        if (level === 1) {
          html += `<div class="flex items-center gap-4 mb-10 p-8 bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 dark:from-purple-900/40 dark:via-pink-900/40 dark:to-red-900/40 rounded-3xl border-l-6 border-purple-500 shadow-xl"><span class="text-4xl">🎯</span><h1 class="text-3xl font-bold bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 bg-clip-text text-transparent">${headerText}</h1></div>\n`;
        } else if (level === 2) {
          html += `<div class="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl border-l-4 border-indigo-500 shadow-lg"><span class="text-3xl">📌</span><h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">${headerText}</h2></div>\n`;
        } else if (level === 3) {
          html += `<div class="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-l-4 border-blue-500"><span class="text-2xl">🔸</span><h3 class="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">${headerText}</h3></div>\n`;
        } else if (level === 4) {
          html += `<div class="flex items-center gap-3 mb-5"><span class="text-xl">▪️</span><h4 class="text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">${headerText}</h4></div>\n`;
        } else if (level === 5) {
          html += `<div class="flex items-center gap-3 mb-4"><span class="text-lg">•</span><h5 class="text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${headerText}</h5></div>\n`;
        } else {
          html += `<div class="flex items-center gap-3 mb-4"><span class="text-lg">◦</span><h6 class="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">${headerText}</h6></div>\n`;
        }
        continue;
      }

      // 无序列表检测 (- 或 * 开头)
      const unorderedListMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
      if (unorderedListMatch) {
        if (!inList || listType !== 'ul') {
          if (inList) {
            html += this.renderList(listItems, listType);
          }
          inList = true;
          listType = 'ul';
          listItems = [];
        }
        listItems.push(this.escapeHtml(unorderedListMatch[1]));
        continue;
      }

      // 有序列表检测 (1. 2. 等开头)
      const orderedListMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
      if (orderedListMatch) {
        if (!inList || listType !== 'ol') {
          if (inList) {
            html += this.renderList(listItems, listType);
          }
          inList = true;
          listType = 'ol';
          listItems = [];
        }
        listItems.push(this.escapeHtml(orderedListMatch[1]));
        continue;
      }

      // 引用检测 (> 开头) - 现代化引用块设计
      const quoteMatch = trimmedLine.match(/^>\s+(.+)$/);
      if (quoteMatch) {
        if (inList) {
          html += this.renderList(listItems, listType);
          inList = false;
          listItems = [];
        }
        const quoteText = this.escapeHtml(quoteMatch[1]);
        html += `<div class="relative my-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border-l-4 border-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift animate-fade-in-up group"><div class="flex items-start gap-3"><span class="text-2xl text-amber-600 group-hover:scale-110 transition-transform duration-300">💬</span><div class="flex-1"><blockquote class="italic text-gray-700 dark:text-gray-300 font-medium leading-relaxed">${quoteText}</blockquote><div class="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"><span class="w-1 h-1 bg-amber-400 rounded-full"></span><span>引用内容</span></div></div></div><div class="absolute top-4 right-4 w-8 h-8 bg-amber-100 dark:bg-amber-800/30 rounded-full flex items-center justify-center"><span class="text-amber-600 text-xs">"</span></div></div>\n`;
        continue;
      }

      // 代码块检测 (``` 包围) - 现代化代码展示
      if (trimmedLine.startsWith('```')) {
        if (inList) {
          html += this.renderList(listItems, listType);
          inList = false;
          listItems = [];
        }
        const language = trimmedLine.substring(3).trim() || 'text';
        let codeContent = '';
        i++; // 跳过开始的 ```
        
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeContent += lines[i] + '\n';
          i++;
        }
        
        html += `<div class="my-6 group code-block hover-lift animate-fade-in-up"><div class="flex items-center gap-3 mb-3 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-xl"><span class="text-xl">💻</span><span class="text-sm font-medium text-gray-300 flex items-center gap-1"><span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>代码块 - ${language}</span><div class="ml-auto flex gap-1"><div class="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors cursor-pointer"></div><div class="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors cursor-pointer"></div><div class="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors cursor-pointer"></div></div></div><pre class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-b-xl overflow-x-auto border border-gray-700 shadow-2xl group-hover:shadow-3xl transition-all duration-300"><code class="text-sm font-mono text-green-400 leading-relaxed">${this.escapeHtml(codeContent.trim())}</code></pre></div>\n`;
        continue;
      }

      // 普通段落处理 - 先声明 processedLine 变量
      if (inList) {
        html += this.renderList(listItems, listType);
        inList = false;
        listItems = [];
      }
      
      // 初始化 processedLine 为当前行内容
      let processedLine = this.escapeHtml(trimmedLine);
      
      // 行内代码检测 (`code`) - 现代化行内代码样式
      processedLine = processedLine.replace(/`([^`]+)`/g, '<code class="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-200 rounded-md font-mono text-sm border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 inline-flex items-center gap-1"><span class="w-1 h-1 bg-green-500 rounded-full"></span>$1</code>');

      // 粗体检测 (**text** 或 __text__) - 现代化强调样式
      processedLine = processedLine.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent px-1 py-0.5 rounded">$1</strong>');
      processedLine = processedLine.replace(/__([^_]+)__/g, '<strong class="font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent px-1 py-0.5 rounded">$1</strong>');

      // 斜体检测 (*text* 或 _text_) - 现代化斜体样式
      processedLine = processedLine.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded-md">$1</em>');
      processedLine = processedLine.replace(/_([^_]+)_/g, '<em class="italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded-md">$1</em>');

      // 链接检测 [text](url) - 现代化链接样式
      processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-white bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-500 dark:hover:bg-blue-600 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:scale-105 group" target="_blank" rel="noopener noreferrer"><span class="text-sm group-hover:rotate-12 transition-transform duration-300">🔗</span><span class="underline decoration-2 underline-offset-2 decoration-blue-300 group-hover:decoration-white">$1</span><span class="text-xs opacity-60 group-hover:opacity-100 transition-opacity">↗</span></a>');

      // 生成普通段落 - 现代化段落设计
      html += `<div class="mb-6 p-4 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200"><p class="text-gray-700 dark:text-gray-300 leading-relaxed text-base">${processedLine}</p></div>\n`;
    }

    // 处理最后的列表
    if (inList) {
      html += this.renderList(listItems, listType);
    }

    return html;
  }

  private static renderList(items: string[], type: string): string {
    if (items.length === 0) return '';
    
    const listItems = items.map(item => {
      if (type === 'ul') {
        return `<div class="flex items-start gap-3 mb-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-l-2 border-green-400 hover:shadow-md transition-all duration-200"><span class="text-green-600 text-lg mt-0.5">📝</span><div class="text-gray-700 dark:text-gray-300 leading-relaxed">${item}</div></div>`;
      } else {
        return `<div class="flex items-start gap-3 mb-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border-l-2 border-blue-400 hover:shadow-md transition-all duration-200"><span class="text-blue-600 text-lg mt-0.5">🔢</span><div class="text-gray-700 dark:text-gray-300 leading-relaxed">${item}</div></div>`;
      }
    }).join('\n');
    
    return `<div class="mb-4">\n${listItems}\n</div>\n`;
  }

  private static extractTitle(text: string): string {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) return '未命名文档';
    
    // 检查第一行是否是 Markdown 标题
    const firstLine = lines[0].trim();
    const headerMatch = firstLine.match(/^#+\s+(.+)$/);
    if (headerMatch) {
      return headerMatch[1];
    }
    
    // 如果第一行较短且不包含句号，可能是标题
    if (firstLine.length < 100 && !firstLine.includes('。') && !firstLine.includes('.')) {
      return firstLine;
    }
    
    // 否则生成默认标题
    const timestamp = new Date().toLocaleString('zh-CN');
    return `生成的文档 - ${timestamp}`;
  }

  private static generateSummary(text: string): string {
    const cleanText = text.replace(/[#*`>\-\d+\.]/g, '').trim();
    const sentences = cleanText.split(/[。！？.!?]/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) return '暂无摘要';
    
    // 取前两句作为摘要，限制长度
    const summary = sentences.slice(0, 2).join('。');
    return summary.length > 150 ? summary.substring(0, 150) + '...' : summary + '。';
  }

  public static parseText(text: string): ParsedContent {
    if (!text || text.trim() === '') {
      throw new Error('文本内容不能为空');
    }

    const title = this.extractTitle(text);
    const summary = this.generateSummary(text);
    const parsedHtml = this.parseMarkdownLikeText(text);
    
    const htmlContent = `
      <div class="relative max-w-none">
        <!-- 装饰性背景 -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 rounded-3xl"></div>
        
        <!-- 主要内容容器 -->
        <div class="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 md:p-12">
          <!-- 内容头部装饰 -->
          <div class="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-white text-xl">📄</span>
            </div>
            <div>
              <h2 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">文档内容</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">解析后的格式化内容</p>
            </div>
          </div>
          
          <!-- 文档内容 -->
          <div class="space-y-6 text-gray-800 dark:text-gray-200 leading-relaxed">
            ${parsedHtml}
          </div>
          
          <!-- 底部装饰 -->
          <div class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-500">
              <span>✨</span>
              <span>由 AI 智能解析生成</span>
              <span>✨</span>
            </div>
          </div>
        </div>
      </div>
    `;

    return {
      title,
      content: text,
      htmlContent,
      summary,
      wordCount: text.length,
      estimatedReadTime: Math.ceil(text.length / 200)
    };
  }

  public static generateFullHTML(content: string, title?: string): string {
    const parsedContent = this.parseText(content);
    const pageTitle = title || this.extractTitle(content) || '智能文档';
    const summary = this.generateSummary(content);
    
    return `
      <!DOCTYPE html>
      <html lang="zh-CN" class="scroll-smooth">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${this.escapeHtml(pageTitle)}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              
              /* 全局样式和字体系统 */
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap');
              
              * {
                  box-sizing: border-box;
              }
              
              body {
                  margin: 0;
                  padding: 0;
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  line-height: 1.7;
                  color: #1f2937;
                  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fb923c 100%);
                  font-size: 16px;
                  font-weight: 400;
                  letter-spacing: -0.01em;
              }
              
              /* 现代字体层级系统 */
              .text-display {
                  font-family: 'Playfair Display', serif;
                  font-size: 3.5rem;
                  font-weight: 700;
                  line-height: 1.1;
                  letter-spacing: -0.02em;
              }
              
              .text-headline {
                  font-family: 'Inter', sans-serif;
                  font-size: 2.5rem;
                  font-weight: 700;
                  line-height: 1.2;
                  letter-spacing: -0.015em;
              }
              
              .text-title {
                  font-family: 'Inter', sans-serif;
                  font-size: 2rem;
                  font-weight: 600;
                  line-height: 1.3;
                  letter-spacing: -0.01em;
              }
              
              .text-subtitle {
                  font-family: 'Inter', sans-serif;
                  font-size: 1.5rem;
                  font-weight: 500;
                  line-height: 1.4;
                  letter-spacing: -0.005em;
              }
              
              .text-body-large {
                  font-family: 'Inter', sans-serif;
                  font-size: 1.125rem;
                  font-weight: 400;
                  line-height: 1.7;
                  letter-spacing: 0;
              }
              
              .text-body {
                  font-family: 'Inter', sans-serif;
                  font-size: 1rem;
                  font-weight: 400;
                  line-height: 1.7;
                  letter-spacing: 0;
              }
              
              .text-caption {
                  font-family: 'Inter', sans-serif;
                  font-size: 0.875rem;
                  font-weight: 500;
                  line-height: 1.5;
                  letter-spacing: 0.01em;
              }
              
              /* 标题样式 - 现代字体层级 */
              h1, h2, h3, h4, h5, h6 {
                  margin: 3rem 0 1.5rem 0;
                  font-weight: 700;
                  line-height: 1.3;
                  background: linear-gradient(135deg, #ea580c, #f97316, #fb923c);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  position: relative;
              }
              
              h1 { 
                  font-family: 'Playfair Display', serif;
                  font-size: 3.5rem; 
                  font-weight: 700;
                  line-height: 1.1;
                  letter-spacing: -0.02em;
                  margin: 0 0 2.5rem 0;
                  text-shadow: 0 8px 16px rgba(251, 146, 60, 0.2);
              }
              h2 { 
                  font-family: 'Inter', sans-serif;
                  font-size: 2.5rem; 
                  font-weight: 700;
                  line-height: 1.2;
                  letter-spacing: -0.015em;
                  margin: 3rem 0 2rem 0;
                  text-shadow: 0 6px 12px rgba(251, 146, 60, 0.15);
              }
              h3 { 
                  font-family: 'Inter', sans-serif;
                  font-size: 2rem; 
                  font-weight: 600;
                  line-height: 1.3;
                  letter-spacing: -0.01em;
                  margin: 2.5rem 0 1.5rem 0;
              }
              h4 { 
                  font-family: 'Inter', sans-serif;
                  font-size: 1.5rem; 
                  font-weight: 600;
                  line-height: 1.4;
                  letter-spacing: -0.005em;
                  margin: 2rem 0 1.25rem 0;
              }
              h5 { 
                  font-family: 'Inter', sans-serif;
                  font-size: 1.25rem; 
                  font-weight: 600;
                  line-height: 1.5;
                  letter-spacing: 0;
                  margin: 1.75rem 0 1rem 0;
              }
              h6 { 
                  font-family: 'Inter', sans-serif;
                  font-size: 1.125rem; 
                  font-weight: 600;
                  line-height: 1.5;
                  letter-spacing: 0;
                  margin: 1.5rem 0 0.75rem 0;
              }
              
              /* 段落样式 - 现代排版 */
              p {
                  font-family: 'Inter', sans-serif;
                  font-size: 1.125rem;
                  font-weight: 400;
                  line-height: 1.8;
                  letter-spacing: 0;
                  margin: 2rem 0;
                  color: #374151;
                  text-align: justify;
                  text-indent: 0;
                  background: linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.9) 0%, 
                    rgba(255, 247, 237, 0.7) 100%);
                  padding: 2rem;
                  border-radius: 16px;
                  border-left: 5px solid #fb923c;
                  box-shadow: 
                    0 8px 16px rgba(251, 146, 60, 0.08),
                    0 4px 8px rgba(0, 0, 0, 0.04),
                    inset 0 1px 0 rgba(255, 255, 255, 0.8);
                  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                  backdrop-filter: blur(8px);
                  position: relative;
                  overflow: hidden;
              }
              
              p::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 2px;
                  background: linear-gradient(90deg, #ea580c, #f97316, #fb923c);
                  opacity: 0;
                  transition: opacity 0.3s ease;
              }
              
              p:hover {
                  transform: translateY(-3px) scale(1.01);
                  box-shadow: 
                    0 16px 32px rgba(251, 146, 60, 0.12),
                    0 8px 16px rgba(0, 0, 0, 0.06),
                    inset 0 2px 4px rgba(255, 255, 255, 0.9);
                  border-left-color: #ea580c;
                  background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 247, 237, 0.95));
              }
              
              p:hover::before {
                  opacity: 1;
              }
              
              /* 首段特殊样式 */
              p:first-of-type:first-letter {
                  font-family: 'Playfair Display', serif;
                  font-size: 4rem;
                  font-weight: 700;
                  line-height: 1;
                  float: left;
                  margin: 0.1rem 0.5rem 0 0;
                  background: linear-gradient(135deg, #ea580c, #fb923c);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
              }
              
              /* 列表样式 */
              ul, ol {
                  margin: 0 0 1.5rem 0;
                  padding-left: 0;
                  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 247, 237, 0.9));
                  border-radius: 16px;
                  box-shadow: 0 8px 25px -5px rgba(251, 146, 60, 0.15), 0 4px 10px -2px rgba(234, 88, 12, 0.1);
                  backdrop-filter: blur(10px);
                  border: 1px solid rgba(251, 146, 60, 0.2);
                  overflow: hidden;
                  position: relative;
              }
              
              ul::before, ol::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 3px;
                  background: linear-gradient(90deg, #ea580c, #f97316, #fb923c, #fdba74);
              }
              
              li {
                  padding: 1.25rem 1.75rem;
                  border-bottom: 1px solid rgba(251, 146, 60, 0.1);
                  color: #374151;
                  font-size: 1.05rem;
                  line-height: 1.7;
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  position: relative;
                  background: transparent;
              }
              
              li:last-child {
                  border-bottom: none;
              }
              
              li:hover {
                  background: linear-gradient(135deg, rgba(251, 146, 60, 0.08), rgba(234, 88, 12, 0.05));
                  transform: translateX(12px);
                  box-shadow: 0 4px 15px -3px rgba(251, 146, 60, 0.2);
              }
              
              li::before {
                  content: '🔸';
                  margin-right: 0.75rem;
                  transition: all 0.3s ease;
                  filter: hue-rotate(20deg);
              }
              
              li:hover::before {
                  transform: scale(1.3) rotate(10deg);
                  filter: hue-rotate(0deg);
              }
              
              /* 引用块样式 */
              blockquote {
                  margin: 0 0 1.5rem 0;
                  padding: 2rem 2.5rem;
                  background: linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(234, 88, 12, 0.08));
                  border-left: 5px solid #f97316;
                  border-radius: 0 20px 20px 0;
                  font-style: italic;
                  color: #1e293b;
                  font-size: 1.15rem;
                  line-height: 1.8;
                  position: relative;
                  box-shadow: 0 12px 30px -8px rgba(251, 146, 60, 0.2), 0 6px 15px -3px rgba(234, 88, 12, 0.1);
                  backdrop-filter: blur(15px);
                  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                  overflow: hidden;
              }
              
              blockquote::before {
                  content: '"';
                  font-size: 5rem;
                  color: #f97316;
                  position: absolute;
                  top: -1rem;
                  left: 1.5rem;
                  opacity: 0.2;
                  font-family: Georgia, serif;
                  font-weight: bold;
              }
              
              blockquote::after {
                  content: '';
                  position: absolute;
                  top: 0;
                  right: 0;
                  width: 100px;
                  height: 100%;
                  background: linear-gradient(90deg, transparent, rgba(251, 146, 60, 0.05));
                  pointer-events: none;
              }
              
              blockquote:hover {
                  transform: translateX(12px) translateY(-2px);
                  border-left-color: #ea580c;
                  background: linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(234, 88, 12, 0.12));
                  box-shadow: 0 20px 40px -10px rgba(251, 146, 60, 0.3), 0 10px 20px -5px rgba(234, 88, 12, 0.15);
              }
              
              /* 代码块样式 */
              pre {
                  margin: 0 0 1.5rem 0;
                  padding: 2rem;
                  background: linear-gradient(135deg, #1c1917, #292524, #44403c);
                  color: #fbbf24;
                  border-radius: 16px;
                  overflow-x: auto;
                  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
                  font-size: 0.95rem;
                  line-height: 1.7;
                  box-shadow: 0 15px 35px -8px rgba(234, 88, 12, 0.2), 0 8px 20px -5px rgba(0, 0, 0, 0.3);
                  border: 2px solid rgba(251, 146, 60, 0.3);
                  position: relative;
                  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                  overflow: hidden;
              }
              
              pre::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 3px;
                  background: linear-gradient(90deg, #ea580c, #f97316, #fb923c, #fbbf24);
              }
              
              pre::after {
                  content: '{ }';
                  position: absolute;
                  top: 1rem;
                  right: 1.5rem;
                  color: #f97316;
                  font-size: 1.2rem;
                  opacity: 0.4;
                  font-weight: bold;
              }
              
              code {
                  background: linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(234, 88, 12, 0.1));
                  color: #ea580c;
                  padding: 0.3rem 0.6rem;
                  border-radius: 8px;
                  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
                  font-size: 0.9em;
                  border: 1px solid rgba(251, 146, 60, 0.3);
                  font-weight: 600;
                  box-shadow: 0 2px 8px -2px rgba(251, 146, 60, 0.2);
              }
              
              pre:hover {
                  transform: translateY(-3px);
                  box-shadow: 0 25px 50px -12px rgba(234, 88, 12, 0.3), 0 15px 30px -8px rgba(0, 0, 0, 0.4);
                  border-color: rgba(251, 146, 60, 0.5);
              }
              
              /* 自定义动画和高级视觉效果 */
              @keyframes fadeInUp {
                  from {
                      opacity: 0;
                      transform: translateY(30px);
                  }
                  to {
                      opacity: 1;
                      transform: translateY(0);
                  }
              }
              
              @keyframes slideInLeft {
                  from {
                      opacity: 0;
                      transform: translateX(-30px);
                  }
                  to {
                      opacity: 1;
                      transform: translateX(0);
                  }
              }
              
              @keyframes pulse {
                  0%, 100% {
                      opacity: 1;
                  }
                  50% {
                      opacity: 0.8;
                  }
              }
              
              @keyframes shimmer {
                  0% {
                      background-position: -200px 0;
                  }
                  100% {
                      background-position: calc(200px + 100%) 0;
                  }
              }
              
              .animate-fade-in-up {
                  animation: fadeInUp 0.6s ease-out;
              }
              
              .animate-slide-in-left {
                  animation: slideInLeft 0.5s ease-out;
              }
              
              .animate-pulse-slow {
                  animation: pulse 2s infinite;
              }
              
              /* 悬停效果 */
              .hover-lift {
                  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              }
              
              .hover-lift:hover {
                  transform: translateY(-4px) scale(1.02);
                  box-shadow: 0 25px 50px -12px rgba(251, 146, 60, 0.25), 0 20px 25px -5px rgba(251, 146, 60, 0.1);
              }
              
              /* 代码块语法高亮 */
              .code-block {
                  position: relative;
                  overflow: hidden;
                  background: linear-gradient(135deg, 
                      #1f2937 0%, 
                      #111827 50%, 
                      #0f172a 100%);
                  border: 1px solid rgba(251, 146, 60, 0.3);
                  border-radius: 16px;
                  box-shadow: 
                      0 20px 25px -5px rgba(0, 0, 0, 0.1),
                      0 10px 10px -5px rgba(0, 0, 0, 0.04),
                      inset 0 1px 0 rgba(251, 146, 60, 0.1);
              }
              
              .code-block::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  height: 4px;
                  background: linear-gradient(90deg, 
                      #fb923c 0%, 
                      #f97316 25%, 
                      #ea580c 50%, 
                      #dc2626 75%, 
                      #fb923c 100%);
                  background-size: 200px 100%;
                  animation: shimmer 3s ease-in-out infinite;
              }
          </style>
      </head>
      <body>
       <!-- 页面主容器 -->
       <div class="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-orange-900/20 dark:via-amber-900/10 dark:to-orange-800/20">
         <!-- 顶部导航栏 -->
         <nav class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-orange-200/50 dark:border-orange-700/30 shadow-xl animate-slide-in-left">
           <div class="max-w-7xl mx-auto px-6 py-4">
             <div class="flex items-center justify-between">
               <div class="flex items-center gap-4">
                 <div class="w-12 h-12 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl hover-lift animate-pulse-slow">
                   <span class="text-white text-xl">📚</span>
                 </div>
                 <div>
                   <h1 class="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">${this.escapeHtml(pageTitle)}</h1>
                   <p class="text-sm text-orange-600/70 dark:text-orange-400/70 font-medium">AI 智能文档解析</p>
                 </div>
               </div>
               <div class="flex items-center gap-3 text-sm">
                 <span class="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300 rounded-full hover-lift shadow-md border border-green-200/50 dark:border-green-700/50">✓ 已解析</span>
                 <span class="text-orange-600/80 dark:text-orange-400/80 font-medium">${new Date().toLocaleString('zh-CN')}</span>
               </div>
             </div>
           </div>
         </nav>

         <!-- 主要内容区域 -->
         <div class="max-w-7xl mx-auto px-6 py-8">
           <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
             <!-- 侧边栏 -->
             <aside class="lg:col-span-1">
               <div class="sticky top-24 space-y-6">
                 <!-- 文档信息卡片 -->
                 <div class="bg-gradient-to-br from-white/95 to-orange-50/90 dark:from-gray-800/90 dark:to-orange-900/20 backdrop-blur-xl rounded-3xl border border-orange-200/50 dark:border-orange-700/30 shadow-2xl p-6 animate-fade-in-up hover-lift">
                   <h3 class="flex items-center gap-3 text-lg font-bold mb-5 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                     <div class="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                       <span class="text-white text-sm">📊</span>
                     </div>
                     文档信息
                   </h3>
                   <div class="space-y-4 text-sm">
                     <div class="group relative overflow-hidden">
                       <div class="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-amber-400/10 rounded-xl transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                       <div class="relative flex justify-between items-center p-4 bg-gradient-to-br from-orange-50/80 to-amber-50/60 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200/30 dark:border-orange-700/30 backdrop-blur-sm">
                         <span class="text-orange-700 dark:text-orange-300 font-medium flex items-center">
                           <div class="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                           字符数
                         </span>
                         <span class="font-bold text-orange-800 dark:text-orange-200 bg-orange-100 dark:bg-orange-800/50 px-2 py-1 rounded-lg text-lg">${content.length}</span>
                       </div>
                     </div>
                     <div class="group relative overflow-hidden">
                       <div class="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-amber-400/10 rounded-xl transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                       <div class="relative flex justify-between items-center p-4 bg-gradient-to-br from-orange-50/80 to-amber-50/60 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200/30 dark:border-orange-700/30 backdrop-blur-sm">
                         <span class="text-orange-700 dark:text-orange-300 font-medium flex items-center">
                           <div class="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                           段落数
                         </span>
                         <span class="font-bold text-orange-800 dark:text-orange-200 bg-orange-100 dark:bg-orange-800/50 px-2 py-1 rounded-lg text-lg">${content.split('\n\n').length}</span>
                       </div>
                     </div>
                     <div class="group relative overflow-hidden">
                       <div class="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-amber-400/10 rounded-xl transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                       <div class="relative flex justify-between items-center p-4 bg-gradient-to-br from-orange-50/80 to-amber-50/60 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200/30 dark:border-orange-700/30 backdrop-blur-sm">
                         <span class="text-orange-700 dark:text-orange-300 font-medium flex items-center">
                           <div class="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                           预计阅读
                         </span>
                         <span class="font-bold text-orange-800 dark:text-orange-200 bg-orange-100 dark:bg-orange-800/50 px-2 py-1 rounded-lg text-lg">${Math.ceil(content.length / 500)} 分钟</span>
                       </div>
                     </div>
                   </div>
                 </div>

                 <!-- 文档摘要 -->
                 <div class="bg-gradient-to-br from-white/95 to-orange-50/90 dark:from-gray-800/90 dark:to-orange-900/20 backdrop-blur-xl rounded-3xl border border-orange-200/50 dark:border-orange-700/30 shadow-2xl p-6">
                   <h3 class="flex items-center gap-3 text-lg font-bold mb-5 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                     <span class="text-2xl">💡</span>
                     内容摘要
                   </h3>
                   <p class="text-sm text-orange-700 dark:text-orange-300 leading-relaxed font-medium bg-gradient-to-r from-orange-50/70 to-amber-50/70 dark:from-orange-900/30 dark:to-amber-900/30 p-4 rounded-xl border border-orange-200/30 dark:border-orange-700/30">${summary}</p>
                 </div>
               </div>
             </aside>

             <!-- 主要内容 -->
             <main class="lg:col-span-3">
               <div class="relative">
                 <!-- 装饰性背景 -->
                 <div class="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-amber-50/30 to-orange-100/40 dark:from-orange-900/15 dark:via-amber-900/10 dark:to-orange-800/15 rounded-3xl"></div>
                 
                 <!-- 内容容器 -->
                 <div class="relative bg-gradient-to-br from-white/95 to-orange-50/90 dark:from-gray-900/95 dark:to-orange-900/20 backdrop-blur-xl rounded-3xl border border-orange-200/50 dark:border-orange-700/30 shadow-2xl p-8 md:p-12">
                   <!-- 内容头部 -->
                   <div class="flex items-center gap-5 mb-10 pb-8 border-b border-orange-200/50 dark:border-orange-700/30">
                     <div class="w-18 h-18 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl hover-lift">
                       <span class="text-white text-3xl">📄</span>
                     </div>
                     <div class="flex-1">
                       <h2 class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent mb-3">文档正文</h2>
                       <p class="text-orange-600/80 dark:text-orange-400/80 font-medium text-lg">经过 AI 智能解析和格式化的内容</p>
                     </div>
                     <div class="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 px-4 py-2 rounded-full border border-green-200/50 dark:border-green-700/50">
                       <div class="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                       <span class="text-sm text-green-700 dark:text-green-300 font-semibold">实时渲染</span>
                     </div>
                   </div>
                   
                   <!-- 文档内容 -->
                   <div class="content-card p-10 hover-lift relative overflow-hidden">
                     <!-- 装饰性背景元素 -->
                     <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-amber-200/10 rounded-full blur-3xl"></div>
                     <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-300/15 to-amber-300/10 rounded-full blur-2xl"></div>
                     
                     <div class="relative space-y-8 text-gray-800 dark:text-gray-200 animate-fade-in-up">
                       ${content}
                     </div>
                   </div>
                   
                   <style>
                     .content-card {
                       background: linear-gradient(145deg, 
                         rgba(255, 255, 255, 0.95) 0%, 
                         rgba(255, 247, 237, 0.9) 50%,
                         rgba(254, 243, 199, 0.85) 100%);
                       backdrop-filter: blur(12px);
                       border: 1px solid rgba(251, 146, 60, 0.2);
                       border-radius: 24px;
                       box-shadow: 
                         0 25px 50px -12px rgba(251, 146, 60, 0.15),
                         0 15px 35px -5px rgba(251, 146, 60, 0.08),
                         0 8px 16px -4px rgba(0, 0, 0, 0.04),
                         inset 0 2px 4px rgba(255, 255, 255, 0.9),
                         inset 0 -1px 2px rgba(251, 146, 60, 0.05);
                     }
                     
                     .enhanced-shadow {
                       box-shadow: 
                         0 20px 40px -8px rgba(251, 146, 60, 0.12),
                         0 10px 20px -4px rgba(251, 146, 60, 0.06),
                         0 4px 8px -2px rgba(0, 0, 0, 0.04),
                         inset 0 1px 2px rgba(255, 255, 255, 0.8);
                     }
                     
                     .depth-layer-1 {
                       box-shadow: 
                         0 4px 8px rgba(251, 146, 60, 0.08),
                         0 2px 4px rgba(0, 0, 0, 0.04),
                         inset 0 1px 0 rgba(255, 255, 255, 0.6);
                     }
                     
                     .depth-layer-2 {
                       box-shadow: 
                         0 8px 16px rgba(251, 146, 60, 0.1),
                         0 4px 8px rgba(0, 0, 0, 0.06),
                         inset 0 1px 0 rgba(255, 255, 255, 0.7);
                     }
                     
                     .depth-layer-3 {
                       box-shadow: 
                         0 16px 32px rgba(251, 146, 60, 0.12),
                         0 8px 16px rgba(0, 0, 0, 0.08),
                         inset 0 2px 4px rgba(255, 255, 255, 0.8);
                     }
                   </style>
                   
                   <!-- 底部信息 -->
                   <div class="mt-20 pt-10 border-t border-orange-200/50 dark:border-orange-700/30">
                     <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                       <div class="flex items-center gap-4 text-lg text-orange-600 dark:text-orange-400">
                         <span class="text-2xl">🤖</span>
                         <span class="font-semibold">由 AI 智能解析引擎生成</span>
                       </div>
                       <div class="flex items-center gap-3">
                         <span class="px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold border border-orange-200/50 dark:border-orange-700/50 shadow-md hover-lift">高质量解析</span>
                         <span class="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold border border-green-200/50 dark:border-green-700/50 shadow-md hover-lift">格式优化</span>
                         <span class="px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 text-amber-700 dark:text-amber-300 rounded-full text-sm font-semibold border border-amber-200/50 dark:border-amber-700/50 shadow-md hover-lift">响应式设计</span>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </main>
           </div>
         </div>
       </div>
      </body>
      </html>
     `;
  }

  public static validateText(text: string): { isValid: boolean; error?: string } {
    if (!text || text.trim() === '') {
      return { isValid: false, error: '文本内容不能为空' };
    }
    
    if (text.length > 50000) {
      return { isValid: false, error: '文本内容过长，请控制在50000字符以内' };
    }
    
    return { isValid: true };
  }
}