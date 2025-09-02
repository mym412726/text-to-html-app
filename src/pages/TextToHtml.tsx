import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Eye, Save, Edit, AlertCircle, CheckCircle, Download, Trash2, Settings, Zap, Key } from 'lucide-react';
import { TextToHtmlParser, ParsedContent } from '@/utils/textToHtmlParser';
import { BlogManager } from '@/utils/blogManager';
import { getDeepSeekApi, DeepSeekConfig, DeepSeekResponse } from '@/utils/deepseekApi';
import { GeneratedPageManager } from '@/utils/generatedPageManager';
import { useNavigate } from 'react-router-dom';

const TextToHtml: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<ParsedContent | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(true);
  const [editableHtml, setEditableHtml] = useState<string>('');
  const [isAutoPreview, setIsAutoPreview] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHtml, setEditedHtml] = useState('');
  
  // 保存到历史相关状态
  const [isSavingToHistory, setIsSavingToHistory] = useState(false);
  const [saveToHistorySuccess, setSaveToHistorySuccess] = useState(false);
  
  // DeepSeek API 相关状态
  const [generationMode, setGenerationMode] = useState<'local' | 'deepseek'>('local');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputText(text);
        setValidationError('');
        if (isAutoPreview) {
          handleGenerate(text);
        }
      };
      reader.readAsText(file);
    } else {
      setValidationError('请上传 .txt 文件');
    }
  };



  // 实时预览效果
  useEffect(() => {
    if (isAutoPreview && inputText.trim()) {
      const timeoutId = setTimeout(() => {
        handleGenerate(inputText);
      }, 1000); // 1秒延迟
      
      return () => clearTimeout(timeoutId);
    }
  }, [inputText, isAutoPreview]);

  // 文本输入变化处理
  const handleTextChange = (text: string) => {
    setInputText(text);
    
    // 实时验证
    const validation = TextToHtmlParser.validateText(text);
    if (!validation.isValid) {
      setValidationError(validation.error || '');
    } else {
      setValidationError('');
    }
  };



  // 生成HTML
  const handleGenerate = async (text?: string) => {
    const textToProcess = text || inputText;
    
    if (!textToProcess.trim()) {
      setValidationError('请输入文本内容');
      return;
    }


    
    setIsGenerating(true);
    setValidationError('');
    
    try {
      let generated: ParsedContent;
      
      if (generationMode === 'deepseek') {
        // 使用DeepSeek AI生成
        const api = getDeepSeekApi();
        const response: DeepSeekResponse = await api.generateHtml(textToProcess);
        
        if (response.success && response.content) {
          generated = {
            title: '由DeepSeek AI生成',
            content: textToProcess,
            htmlContent: response.content,
            summary: '由DeepSeek AI智能生成的HTML内容',
            wordCount: textToProcess.length,
            estimatedReadTime: Math.ceil(textToProcess.length / 200)
          };
        } else {
          throw new Error(response.error || 'AI生成失败');
        }
      } else {
        // 使用本地解析器
        await new Promise(resolve => setTimeout(resolve, 500));
        generated = TextToHtmlParser.parseText(textToProcess);
      }
      
      setGeneratedContent(generated);
      setEditableHtml(generated.htmlContent);
      setEditedHtml(generated.htmlContent);
      setIsPreviewMode(true);
      setIsEditing(false);
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : '生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  // 保存到博客
  const handleSaveToBlog = async () => {
    if (!generatedContent) {
      alert('请先生成HTML内容');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // 如果用户编辑了HTML，使用编辑后的内容
      const contentToSave = isEditing ? {
        ...generatedContent,
        htmlContent: editedHtml
      } : generatedContent;
      
      // 保存到博客列表
      const newPost = BlogManager.saveBlogPost(contentToSave);
      
      setSaveSuccess(true);
      
      // 2秒后跳转到博客列表页面
      setTimeout(() => {
        navigate('/blog');
      }, 2000);
      
    } catch (error) {
      console.error('保存博客失败:', error);
      setValidationError('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 保存到生成历史
  const handleSaveToHistory = async () => {
    // 清除之前的错误信息
    setValidationError('');
    
    if (!generatedContent) {
      setValidationError('请先生成HTML内容后再保存');
      return;
    }

    if (!inputText.trim()) {
      setValidationError('原始文本内容不能为空');
      return;
    }

    setIsSavingToHistory(true);
    setSaveToHistorySuccess(false);
    
    try {
      // 检查本地存储是否可用
      if (typeof Storage === 'undefined') {
        throw new Error('浏览器不支持本地存储功能');
      }

      // 检查存储空间
      const testKey = 'storage_test';
      try {
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
      } catch (storageError) {
        throw new Error('存储空间不足，请清理浏览器数据后重试');
      }
      
      // 如果用户编辑了HTML，使用编辑后的内容
      const contentToSave = isEditing ? {
        ...generatedContent,
        htmlContent: editedHtml
      } : generatedContent;
      
      console.log('正在保存页面到历史记录...', {
        title: contentToSave.title,
        contentLength: inputText.length,
        generationMode: generationMode
      });
      
      // 保存到生成历史
      const savedPage = GeneratedPageManager.savePage(
        contentToSave,
        inputText,
        generationMode
      );
      
      console.log('页面保存成功:', savedPage.id);
      setSaveToHistorySuccess(true);
      
      // 3秒后重置状态
      setTimeout(() => {
        setSaveToHistorySuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('保存到历史失败:', error);
      const errorMessage = error instanceof Error ? error.message : '保存失败，请重试';
      setValidationError(`保存失败: ${errorMessage}`);
    } finally {
      setIsSavingToHistory(false);
    }
  };

  // 切换编辑模式
  const handleToggleEdit = () => {
    if (!isEditing) {
      setEditedHtml(generatedContent?.htmlContent || '');
    }
    setIsEditing(!isEditing);
  };

  // 应用编辑的HTML
  const handleApplyEdit = () => {
    if (generatedContent) {
      setGeneratedContent({
        ...generatedContent,
        htmlContent: editedHtml
      });
      setEditableHtml(editedHtml);
    }
    setIsEditing(false);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditedHtml(generatedContent?.htmlContent || '');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            文本转HTML生成器
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            上传文本文件或粘贴文本，自动生成美观的HTML页面
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入区域 */}
          <div className="space-y-6">
            {/* 文件上传区域 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Upload className="mr-2" size={20} />
                文件上传
              </h2>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  点击上传 .txt 文件
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  选择文件
                </Button>
              </div>
            </div>

            {/* 生成模式选择区域 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Zap className="mr-2 text-orange-500" size={20} />
                生成模式
              </h2>
              
              {/* 生成模式选择 */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 本地解析选项 */}
                  <label className="flex items-start space-x-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    generationMode === 'local' 
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                      : 'border-gray-200 dark:border-gray-600'
                  }">
                    <input
                      type="radio"
                      name="generationMode"
                      value="local"
                      checked={generationMode === 'local'}
                      onChange={(e) => setGenerationMode(e.target.value as 'local' | 'deepseek')}
                      className="text-orange-500 focus:ring-orange-500 mt-1"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">本地解析</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        使用本地解析器生成HTML，支持基本的Markdown语法，快速且免费
                      </div>
                    </div>
                  </label>
                  
                  {/* DeepSeek AI选项 */}
                  <label className="flex items-start space-x-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    generationMode === 'deepseek' 
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                      : 'border-gray-200 dark:border-gray-600'
                  }">
                    <input
                      type="radio"
                      name="generationMode"
                      value="deepseek"
                      checked={generationMode === 'deepseek'}
                      onChange={(e) => setGenerationMode(e.target.value as 'local' | 'deepseek')}
                      className="text-orange-500 focus:ring-orange-500 mt-1"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white flex items-center">
                        DeepSeek AI
                        <Zap className="ml-1 text-orange-500" size={14} />
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        使用DeepSeek AI生成更智能、更美观的HTML内容，需要API密钥
                      </div>
                    </div>
                  </label>
                </div>
                
                {/* API密钥提示 */}
                {generationMode === 'deepseek' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="text-blue-500 mt-0.5" size={16} />
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-medium mb-1">API密钥已在代码中配置</p>
                        <p>如需使用DeepSeek AI功能，请确保在 <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">deepseekApi.ts</code> 文件中设置了有效的API密钥。</p>
                        <p className="mt-2 text-xs">
                          获取API密钥：<a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">DeepSeek 平台</a>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 文本输入区域 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Edit className="mr-2" size={20} />
                文本输入
              </h2>
              <textarea
                value={inputText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="在这里粘贴或输入您的文本内容...\n\n支持格式：\n# 标题 (一到六级)\n- 无序列表\n1. 有序列表\n> 引用\n**粗体** *斜体*\n`代码`\n[链接](URL)\n```代码块```"
                className={`w-full h-64 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  validationError ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {/* 验证错误显示 */}
              {validationError && (
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={16} />
                    <div className="whitespace-pre-line">{validationError}</div>
                  </div>
                </div>
              )}
              
              {/* 字符计数 */}
              <div className="mt-2 text-right text-sm text-gray-500 dark:text-gray-400">
                {inputText.length} / 50000 字符
              </div>
              
              {/* 自动预览开关 */}
              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={isAutoPreview}
                    onChange={(e) => setIsAutoPreview(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>自动预览 (1秒延迟)</span>
                </label>
                
                {!validationError && inputText.trim() && (
                  <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                    <CheckCircle className="mr-1" size={16} />
                    文本格式正确
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => handleGenerate()}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  disabled={!inputText.trim() || !!validationError || isGenerating}
                >
                  {isGenerating ? (
                    generationMode === 'deepseek' ? 'AI生成中...' : '生成中...'
                  ) : (
                    generationMode === 'deepseek' ? (
                      <>
                        <Zap className="mr-1" size={16} />
                        AI生成HTML
                      </>
                    ) : (
                      '生成HTML'
                    )
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setInputText('');
                    setGeneratedContent(null);
                    setValidationError('');
                    setIsEditing(false);
                    setEditedHtml('');
                    setSaveSuccess(false);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  variant="outline"
                >
                  清空
                </Button>
              </div>
            </div>
          </div>

          {/* 右侧：预览区域 */}
          <div className="space-y-6">
            {generatedContent && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Eye className="mr-2" size={20} />
                    预览
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleToggleEdit}
                      variant="outline"
                      size="sm"
                    >
                      {isEditing ? '预览模式' : '编辑HTML'}
                    </Button>
                    {isEditing && (
                      <>
                        <Button
                          onClick={handleApplyEdit}
                          size="sm"
                          variant="default"
                        >
                          应用
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          size="sm"
                          variant="outline"
                        >
                          取消
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={handleSaveToHistory}
                      disabled={isSavingToHistory || saveToHistorySuccess}
                      size="sm"
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    >
                      {saveToHistorySuccess ? (
                        <>
                          <CheckCircle className="mr-1" size={16} />
                          已保存
                        </>
                      ) : isSavingToHistory ? (
                        <>
                          <Save className="mr-1 animate-spin" size={16} />
                          保存中...
                        </>
                      ) : (
                        <>
                          <Save className="mr-1" size={16} />
                          保存到历史
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleSaveToBlog}
                      disabled={isSaving || saveSuccess}
                      size="sm"
                      variant="outline"
                    >
                      {saveSuccess ? (
                        <>
                          <CheckCircle className="mr-1" size={16} />
                          保存成功
                        </>
                      ) : isSaving ? (
                        <>
                          <Save className="mr-1 animate-spin" size={16} />
                          保存中...
                        </>
                      ) : (
                        <>
                          <Save className="mr-1" size={16} />
                          保存到博客
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {!isEditing ? (
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 min-h-96 overflow-auto">
                    <div dangerouslySetInnerHTML={{ __html: editableHtml }} />
                  </div>
                ) : (
                  <textarea
                    value={editedHtml}
                    onChange={(e) => setEditedHtml(e.target.value)}
                    className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                    placeholder="HTML代码将在这里显示..."
                  />
                )}
              </div>
            )}

            {!generatedContent && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="text-center py-12">
                  <FileText className="mx-auto mb-4 text-gray-400" size={64} />
                  <p className="text-gray-500 dark:text-gray-400">
                    上传文件或输入文本后，生成的HTML预览将在这里显示
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToHtml;