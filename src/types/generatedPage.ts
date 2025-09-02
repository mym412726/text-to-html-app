export interface GeneratedPage {
  id: string;
  title: string;
  content: string;
  htmlContent: string;
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  estimatedReadTime: number;
  tags: string[];
  generationMode: 'local' | 'deepseek';
  preview: string; // 内容预览，前100个字符
}

export interface GeneratedPageFilter {
  searchTerm: string;
  generationMode: 'all' | 'local' | 'deepseek';
  sortBy: 'createdAt' | 'updatedAt' | 'title' | 'wordCount';
  sortOrder: 'asc' | 'desc';
}

export interface GeneratedPageStats {
  totalPages: number;
  totalWords: number;
  localGenerated: number;
  aiGenerated: number;
}