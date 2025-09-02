import { BlogPost } from '../types/blog';
import { blogPosts } from '../data/blogData';
import { ParsedContent } from './textToHtmlParser';

export class BlogManager {
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static calculateReadTime(content: string): number {
    // 假设平均阅读速度为每分钟 200 个中文字符或 250 个英文单词
    const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length;
    const englishWords = content.replace(/[\u4e00-\u9fff]/g, '').split(/\s+/).filter(word => word.length > 0).length;
    
    const chineseReadTime = chineseChars / 200;
    const englishReadTime = englishWords / 250;
    
    return Math.max(1, Math.ceil(chineseReadTime + englishReadTime));
  }

  private static extractTags(content: string): string[] {
    const tags: string[] = [];
    
    // 基于内容关键词自动生成标签
    const keywordMap: { [key: string]: string[] } = {
      'React': ['react', 'jsx', 'component', 'hook', 'state'],
      'Vue': ['vue', 'composition', 'directive', 'reactive'],
      'TypeScript': ['typescript', 'type', 'interface', 'generic'],
      'JavaScript': ['javascript', 'js', 'function', 'async', 'promise'],
      'CSS': ['css', 'style', 'flexbox', 'grid', 'animation'],
      'HTML': ['html', 'element', 'attribute', 'semantic'],
      'Node.js': ['node', 'npm', 'express', 'server'],
      'Tailwind CSS': ['tailwind', 'utility', 'responsive'],
      'Vite': ['vite', 'build', 'bundler'],
      '前端开发': ['前端', '开发', '网页', '界面'],
      '后端开发': ['后端', '服务器', '数据库', 'API'],
      '移动开发': ['移动', '手机', 'APP', '响应式'],
      '性能优化': ['性能', '优化', '速度', '加载'],
      '用户体验': ['用户', '体验', 'UX', 'UI'],
      '设计': ['设计', '界面', '交互', '视觉']
    };

    const lowerContent = content.toLowerCase();
    
    for (const [tag, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(keyword => lowerContent.includes(keyword.toLowerCase()))) {
        tags.push(tag);
      }
    }

    // 如果没有匹配到标签，添加默认标签
    if (tags.length === 0) {
      tags.push('技术文章');
    }

    // 限制标签数量
    return tags.slice(0, 4);
  }

  private static generateImageUrl(title: string, tags: string[]): string {
    // 基于标题和标签生成合适的图片提示词
    const techKeywords = tags.join(' ');
    const prompt = `modern technology blog post about ${techKeywords} programming development`;
    const encodedPrompt = encodeURIComponent(prompt);
    return `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=landscape_16_9`;
  }

  private static generateAuthor(): { name: string; avatar: string } {
    const authors = [
      { name: '技术编辑', prompt: 'professional tech writer avatar' },
      { name: '开发者', prompt: 'software developer professional headshot' },
      { name: '前端工程师', prompt: 'frontend engineer professional portrait' },
      { name: '全栈开发者', prompt: 'fullstack developer professional photo' }
    ];
    
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    const encodedPrompt = encodeURIComponent(randomAuthor.prompt);
    
    return {
      name: randomAuthor.name,
      avatar: `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=square`
    };
  }

  public static createBlogPost(parsedContent: ParsedContent): BlogPost {
    const tags = this.extractTags(parsedContent.content);
    const readTime = this.calculateReadTime(parsedContent.content);
    const author = this.generateAuthor();
    const imageUrl = this.generateImageUrl(parsedContent.title, tags);
    
    const newPost: BlogPost = {
      id: this.generateId(),
      title: parsedContent.title,
      content: parsedContent.content,
      excerpt: parsedContent.summary,
      author,
      publishedAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD 格式
      tags,
      readTime,
      imageUrl
    };

    return newPost;
  }

  public static addToBlogList(newPost: BlogPost): void {
    // 将新文章添加到博客列表的开头
    blogPosts.unshift(newPost);
  }

  public static saveBlogPost(parsedContent: ParsedContent): BlogPost {
    const newPost = this.createBlogPost(parsedContent);
    this.addToBlogList(newPost);
    return newPost;
  }

  public static getBlogPosts(): BlogPost[] {
    return [...blogPosts]; // 返回副本以避免直接修改
  }

  public static getBlogPostById(id: string): BlogPost | undefined {
    return blogPosts.find(post => post.id === id);
  }

  public static deleteBlogPost(id: string): boolean {
    const index = blogPosts.findIndex(post => post.id === id);
    if (index !== -1) {
      blogPosts.splice(index, 1);
      return true;
    }
    return false;
  }

  public static updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | null {
    const index = blogPosts.findIndex(post => post.id === id);
    if (index !== -1) {
      blogPosts[index] = { ...blogPosts[index], ...updates };
      return blogPosts[index];
    }
    return null;
  }

  public static searchBlogPosts(query: string): BlogPost[] {
    const lowerQuery = query.toLowerCase();
    return blogPosts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  public static getPostsByTag(tag: string): BlogPost[] {
    return blogPosts.filter(post => 
      post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
    );
  }

  public static getRecentPosts(limit: number = 5): BlogPost[] {
    return blogPosts
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  public static getRelatedPosts(currentPostId: string, limit: number = 3): BlogPost[] {
    const currentPost = this.getBlogPostById(currentPostId);
    if (!currentPost) return [];

    // 基于标签相似度找到相关文章
    const relatedPosts = blogPosts
      .filter(post => post.id !== currentPostId)
      .map(post => {
        const commonTags = post.tags.filter(tag => 
          currentPost.tags.some(currentTag => currentTag.toLowerCase() === tag.toLowerCase())
        );
        return { post, similarity: commonTags.length };
      })
      .filter(item => item.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.post);

    // 如果相关文章不足，用最新文章补充
    if (relatedPosts.length < limit) {
      const recentPosts = this.getRecentPosts(limit * 2)
        .filter(post => post.id !== currentPostId && !relatedPosts.some(rp => rp.id === post.id))
        .slice(0, limit - relatedPosts.length);
      relatedPosts.push(...recentPosts);
    }

    return relatedPosts;
  }
}