import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Calendar, 
  Clock, 
  FileText, 
  Zap, 
  BarChart3,
  Plus,
  X,
  Check,
  AlertCircle,
  Copy,
  ExternalLink,
  FileDown
} from 'lucide-react';
import { GeneratedPage, GeneratedPageFilter, GeneratedPageStats } from '@/types/generatedPage';
import { GeneratedPageManager } from '@/utils/generatedPageManager';
import { useNavigate } from 'react-router-dom';

const GeneratedPages: React.FC = () => {
  const [pages, setPages] = useState<GeneratedPage[]>([]);
  const [filteredPages, setFilteredPages] = useState<GeneratedPage[]>([]);
  const [stats, setStats] = useState<GeneratedPageStats>({ totalPages: 0, totalWords: 0, localGenerated: 0, aiGenerated: 0 });
  const [filter, setFilter] = useState<GeneratedPageFilter>({
    searchTerm: '',
    generationMode: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [previewPage, setPreviewPage] = useState<GeneratedPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingPage, setEditingPage] = useState<GeneratedPage | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [isEditPreviewMode, setIsEditPreviewMode] = useState(false);
  
  const navigate = useNavigate();

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  // 应用过滤器
  useEffect(() => {
    const filtered = GeneratedPageManager.filterPages(filter);
    setFilteredPages(filtered);
  }, [pages, filter]);

  const loadData = () => {
    setIsLoading(true);
    try {
      const allPages = GeneratedPageManager.getAllPages();
      const pageStats = GeneratedPageManager.getStats();
      setPages(allPages);
      setStats(pageStats);
    } catch (error) {
      showNotification('error', '加载数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // 删除单个页面
  const handleDeletePage = (id: string) => {
    if (GeneratedPageManager.deletePage(id)) {
      loadData();
      setSelectedPages(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      showNotification('success', '页面删除成功');
    } else {
      showNotification('error', '删除失败');
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    const deletedCount = GeneratedPageManager.deletePages(Array.from(selectedPages));
    if (deletedCount > 0) {
      loadData();
      setSelectedPages(new Set());
      setShowDeleteConfirm(false);
      showNotification('success', `成功删除 ${deletedCount} 个页面`);
    } else {
      showNotification('error', '删除失败');
    }
  };

  // 导出页面（JSON格式）
  const handleExportPage = (page: GeneratedPage) => {
    const exportData = GeneratedPageManager.exportPage(page.id);
    if (exportData) {
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${page.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('success', '导出成功');
    }
  };

  // 导出为HTML文件
  const handleExportAsHtml = (page: GeneratedPage) => {
    try {
      // 创建完整的HTML文档结构
      const htmlDocument = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <style>
    /* 基础样式重置 */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #fff5f0 0%, #ffffff 50%, #fff5f0 100%);
      min-height: 100vh;
      padding: 2rem;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    
    .header h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .header .meta {
      opacity: 0.9;
      font-size: 0.9rem;
    }
    
    .content {
      padding: 2rem;
    }
    
    .content h1, .content h2, .content h3, .content h4, .content h5, .content h6 {
      color: #f97316;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
    }
    
    .content h1 { font-size: 1.875rem; }
    .content h2 { font-size: 1.5rem; }
    .content h3 { font-size: 1.25rem; }
    
    .content p {
      margin-bottom: 1rem;
      text-align: justify;
    }
    
    .content ul, .content ol {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
    }
    
    .content li {
      margin-bottom: 0.25rem;
    }
    
    .content blockquote {
      border-left: 4px solid #f97316;
      background: #fff5f0;
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 0 8px 8px 0;
    }
    
    .content code {
      background: #f3f4f6;
      padding: 0.125rem 0.25rem;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.875rem;
    }
    
    .content pre {
      background: #1f2937;
      color: #f9fafb;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1rem 0;
    }
    
    .content pre code {
      background: none;
      padding: 0;
      color: inherit;
    }
    
    .content table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .content th, .content td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .content th {
      background: #f97316;
      color: white;
      font-weight: 600;
    }
    
    .content tr:hover {
      background: #fff5f0;
    }
    
    .content a {
      color: #f97316;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s;
    }
    
    .content a:hover {
      border-bottom-color: #f97316;
    }
    
    .footer {
      background: #f9fafb;
      padding: 1rem 2rem;
      text-align: center;
      color: #6b7280;
      font-size: 0.875rem;
      border-top: 1px solid #e5e7eb;
    }
    
    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }
      
      .header, .content {
        padding: 1.5rem;
      }
      
      .header h1 {
        font-size: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${page.title}</h1>
      <div class="meta">
        生成时间：${formatDate(page.createdAt)} | 
        生成方式：${page.generationMode === 'deepseek' ? 'AI生成' : '本地生成'} | 
        字数：${page.wordCount}
      </div>
    </div>
    
    <div class="content">
      ${page.htmlContent}
    </div>
    
    <div class="footer">
      <p>此文档由文本转HTML工具生成 | 生成时间：${new Date().toLocaleString('zh-CN')}</p>
    </div>
  </div>
</body>
</html>`;

      // 创建并下载文件
      const blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // 生成文件名：标题 + 时间戳
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
      const fileName = `${page.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}_${timestamp}.html`;
      a.download = fileName;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showNotification('success', `HTML文件导出成功：${fileName}`);
    } catch (error) {
      console.error('导出HTML失败:', error);
      showNotification('error', '导出HTML文件失败，请重试');
    }
  };

  // 复制HTML内容
  const handleCopyHtml = async (htmlContent: string) => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      showNotification('success', 'HTML内容已复制到剪贴板');
    } catch (error) {
      showNotification('error', '复制失败');
    }
  };

  // 开始编辑页面
  const handleEditPage = (page: GeneratedPage) => {
    setEditingPage(page);
    setEditedContent(page.htmlContent);
    setEditedTitle(page.title);
    setIsEditPreviewMode(false);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (!editingPage) return;
    
    try {
      const updatedPage: GeneratedPage = {
        ...editingPage,
        title: editedTitle.trim() || editingPage.title,
        htmlContent: editedContent,
        preview: editedContent.replace(/<[^>]*>/g, '').substring(0, 150),
        wordCount: editedContent.replace(/<[^>]*>/g, '').length,
        updatedAt: new Date()
      };
      
      if (GeneratedPageManager.updatePage(editingPage.id, {
        title: editedTitle.trim() || editingPage.title,
        htmlContent: editedContent,
        preview: editedContent.replace(/<[^>]*>/g, '').substring(0, 150),
        wordCount: editedContent.replace(/<[^>]*>/g, '').length,
        updatedAt: new Date()
      })) {
        loadData();
        setEditingPage(null);
        showNotification('success', '页面编辑成功');
      } else {
        showNotification('error', '保存失败');
      }
    } catch (error) {
      showNotification('error', '保存失败，请重试');
    }
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingPage(null);
    setEditedContent('');
    setEditedTitle('');
    setIsEditPreviewMode(false);
  };

  // 重置编辑内容
  const handleResetEdit = () => {
    if (editingPage) {
      setEditedContent(editingPage.htmlContent);
      setEditedTitle(editingPage.title);
      setIsEditPreviewMode(false);
    }
  };

  // 选择/取消选择页面
  const togglePageSelection = (id: string) => {
    setSelectedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedPages.size === filteredPages.length) {
      setSelectedPages(new Set());
    } else {
      setSelectedPages(new Set(filteredPages.map(page => page.id)));
    }
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取生成模式标签样式
  const getModeTagStyle = (mode: 'local' | 'deepseek') => {
    return mode === 'deepseek' 
      ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 dark:from-orange-900/30 dark:to-orange-800/30 dark:text-orange-300'
      : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-300';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 通知 */}
        {notification && (
          <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg border ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <Check className="mr-2" size={16} />
              ) : (
                <AlertCircle className="mr-2" size={16} />
              )}
              {notification.message}
            </div>
          </div>
        )}

        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-4">
            生成历史
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            管理您的所有HTML生成记录
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-orange-100 dark:border-orange-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">总页面数</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPages}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                <FileText className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-orange-100 dark:border-orange-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">总字数</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalWords.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <BarChart3 className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-orange-100 dark:border-orange-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">本地生成</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.localGenerated}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <FileText className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-orange-100 dark:border-orange-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI生成</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.aiGenerated}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Zap className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-orange-100 dark:border-orange-900/20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 搜索 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="搜索标题、内容或标签..."
                  value={filter.searchTerm}
                  onChange={(e) => setFilter(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            {/* 过滤器 */}
            <div className="flex gap-2">
              <select
                value={filter.generationMode}
                onChange={(e) => setFilter(prev => ({ ...prev, generationMode: e.target.value as any }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">所有模式</option>
                <option value="local">本地生成</option>
                <option value="deepseek">AI生成</option>
              </select>
              
              <select
                value={`${filter.sortBy}-${filter.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilter(prev => ({ ...prev, sortBy: sortBy as any, sortOrder: sortOrder as any }));
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="createdAt-desc">创建时间 ↓</option>
                <option value="createdAt-asc">创建时间 ↑</option>
                <option value="updatedAt-desc">更新时间 ↓</option>
                <option value="updatedAt-asc">更新时间 ↑</option>
                <option value="title-asc">标题 A-Z</option>
                <option value="title-desc">标题 Z-A</option>
                <option value="wordCount-desc">字数 ↓</option>
                <option value="wordCount-asc">字数 ↑</option>
              </select>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex gap-2">
              <Button
                onClick={() => navigate('/text-to-html')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              >
                <Plus className="mr-1" size={16} />
                新建页面
              </Button>
              
              {selectedPages.size > 0 && (
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="mr-1" size={16} />
                  删除选中 ({selectedPages.size})
                </Button>
              )}
            </div>
          </div>
          
          {/* 批量操作 */}
          {filteredPages.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={selectedPages.size === filteredPages.length && filteredPages.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span>全选 ({filteredPages.length} 项)</span>
              </label>
            </div>
          )}
        </div>

        {/* 页面列表 */}
        {filteredPages.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-orange-100 dark:border-orange-900/20">
            <FileText className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {pages.length === 0 ? '还没有生成任何页面' : '没有找到匹配的页面'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {pages.length === 0 
                ? '开始创建您的第一个HTML页面吧！'
                : '尝试调整搜索条件或过滤器'
              }
            </p>
            <Button
              onClick={() => navigate('/text-to-html')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              <Plus className="mr-2" size={16} />
              创建新页面
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
              <div
                key={page.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 dark:border-orange-900/20 overflow-hidden"
              >
                {/* 卡片头部 */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPages.has(page.id)}
                        onChange={() => togglePageSelection(page.id)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getModeTagStyle(page.generationMode)
                      }`}>
                        {page.generationMode === 'deepseek' ? (
                          <><Zap className="inline mr-1" size={12} />AI生成</>
                        ) : (
                          <><FileText className="inline mr-1" size={12} />本地生成</>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {page.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {page.preview}...
                  </p>
                  
                  {/* 标签 */}
                  {page.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {page.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                      {page.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                          +{page.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* 元信息 */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="mr-1" size={12} />
                        {formatDate(page.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <FileText className="mr-1" size={12} />
                        {page.wordCount} 字
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1" size={12} />
                        {page.estimatedReadTime} 分钟
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => setPreviewPage(page)}
                      size="sm"
                      variant="outline"
                      className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20"
                    >
                      <Eye className="mr-1" size={14} />
                      预览
                    </Button>
                    
                    <Button
                      onClick={() => handleEditPage(page)}
                      size="sm"
                      variant="outline"
                      className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                    >
                      <Edit className="mr-1" size={14} />
                      编辑
                    </Button>
                    
                    <Button
                      onClick={() => handleCopyHtml(page.htmlContent)}
                      size="sm"
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    >
                      <Copy className="mr-1" size={14} />
                      复制
                    </Button>
                    
                    <Button
                      onClick={() => handleExportAsHtml(page)}
                      size="sm"
                      variant="outline"
                      className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20"
                    >
                      <FileDown className="mr-1" size={14} />
                      HTML
                    </Button>
                    
                    <Button
                      onClick={() => handleExportPage(page)}
                      size="sm"
                      variant="outline"
                      className="border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
                    >
                      <Download className="mr-1" size={14} />
                      JSON
                    </Button>
                  </div>
                  
                  <div className="mt-2">
                    <Button
                      onClick={() => handleDeletePage(page.id)}
                      size="sm"
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="mr-1" size={14} />
                      删除
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 预览模态框 */}
        {previewPage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {previewPage.title}
                </h3>
                <Button
                  onClick={() => setPreviewPage(null)}
                  variant="outline"
                  size="sm"
                >
                  <X size={16} />
                </Button>
              </div>
              <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                <div 
                  className="prose prose-slate dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewPage.htmlContent }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 编辑模态框 */}
        {editingPage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
              {/* 模态框头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <div className="flex items-center space-x-3">
                  <Edit className="text-orange-600 dark:text-orange-400" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    编辑页面
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setIsEditPreviewMode(!isEditPreviewMode)}
                    variant="outline"
                    size="sm"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400"
                  >
                    {isEditPreviewMode ? (
                      <><Edit className="mr-1" size={14} />编辑</>
                    ) : (
                      <><Eye className="mr-1" size={14} />预览</>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
              
              {/* 标题编辑 */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  页面标题
                </label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="请输入页面标题"
                />
              </div>
              
              {/* 内容编辑区域 */}
              <div className="flex-1 overflow-hidden">
                {isEditPreviewMode ? (
                  /* 预览模式 */
                  <div className="h-[60vh] overflow-auto p-6">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <Eye className="mr-2" size={16} />
                        实时预览
                      </h4>
                      <div 
                        className="prose prose-slate dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                        dangerouslySetInnerHTML={{ __html: editedContent }}
                      />
                    </div>
                  </div>
                ) : (
                  /* 编辑模式 */
                  <div className="h-[60vh] p-6">
                    <div className="h-full">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        HTML 内容
                      </label>
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full h-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none"
                        placeholder="请输入HTML内容..."
                        style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* 模态框底部操作按钮 */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex space-x-2">
                  <Button
                    onClick={handleResetEdit}
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400"
                  >
                    <X className="mr-1" size={14} />
                    重置
                  </Button>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400"
                  >
                    取消
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  >
                    <Check className="mr-1" size={14} />
                    保存更改
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 删除确认模态框 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle className="text-red-500 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    确认删除
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  您确定要删除选中的 {selectedPages.size} 个页面吗？此操作无法撤销。
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    取消
                  </Button>
                  <Button
                    onClick={handleBatchDelete}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    确认删除
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratedPages;