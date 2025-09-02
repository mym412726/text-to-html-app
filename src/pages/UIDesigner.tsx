import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Eye, FileText, Palette, Smartphone, Monitor } from 'lucide-react';

const UIDesigner: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);

  // 文本转HTML的核心函数
  const generateHTML = (text: string): string => {
    if (!text.trim()) return '';

    const lines = text.split('\n');
    let html = '';
    let inCodeBlock = false;
    let inList = false;
    let listItems: string[] = [];

    const processLine = (line: string): string => {
      // 代码块处理
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        return inCodeBlock ? '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"><code>' : '</code></pre>';
      }

      if (inCodeBlock) {
        return line + '\n';
      }

      // 标题处理
      if (line.startsWith('# ')) {
        return `<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">${line.substring(2)}</h1>`;
      }
      if (line.startsWith('## ')) {
        return `<h2 class="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-5 leading-tight">${line.substring(3)}</h2>`;
      }
      if (line.startsWith('### ')) {
        return `<h3 class="text-2xl font-medium text-gray-700 dark:text-gray-200 mb-4 leading-tight">${line.substring(4)}</h3>`;
      }

      // 列表处理
      if (line.trim().match(/^[\-\*\+]\s/)) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(`<li class="mb-2 text-gray-700 dark:text-gray-300">${line.trim().substring(2)}</li>`);
        return '';
      } else if (inList && line.trim() === '') {
        const listHtml = `<ul class="list-disc list-inside space-y-2 mb-6 pl-4">${listItems.join('')}</ul>`;
        inList = false;
        listItems = [];
        return listHtml;
      } else if (inList) {
        const listHtml = `<ul class="list-disc list-inside space-y-2 mb-6 pl-4">${listItems.join('')}</ul>`;
        inList = false;
        listItems = [];
        return listHtml + processLine(line);
      }

      // 空行处理
      if (line.trim() === '') {
        return '<div class="mb-4"></div>';
      }

      // 强调文本处理
      let processedLine = line;
      processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>');
      processedLine = processedLine.replace(/\*(.*?)\*/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>');
      processedLine = processedLine.replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>');

      // 普通段落
      return `<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">${processedLine}</p>`;
    };

    lines.forEach(line => {
      const processed = processLine(line);
      if (processed) html += processed;
    });

    // 处理未闭合的列表
    if (inList && listItems.length > 0) {
      html += `<ul class="list-disc list-inside space-y-2 mb-6 pl-4">${listItems.join('')}</ul>`;
    }

    return html;
  };

  // 生成完整的HTML页面
  const generateFullHTML = (content: string): string => {
    return `<!DOCTYPE html>
<html lang="zh-CN" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI设计原型 - 现代化UI界面</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    animation: {
                        'fade-in': 'fadeIn 0.8s ease-out',
                        'slide-up': 'slideUp 0.8s ease-out',
                        'slide-in-left': 'slideInLeft 0.6s ease-out',
                        'slide-in-right': 'slideInRight 0.6s ease-out',
                        'highlight': 'highlight 3s ease-in-out',
                        'float': 'float 6s ease-in-out infinite',
                        'glow': 'glow 2s ease-in-out infinite alternate',
                        'gradient-shift': 'gradientShift 8s ease-in-out infinite'
                    },
                    keyframes: {
                        fadeIn: {
                            '0%': { opacity: '0', transform: 'scale(0.95)' },
                            '100%': { opacity: '1', transform: 'scale(1)' }
                        },
                        slideUp: {
                            '0%': { transform: 'translateY(30px)', opacity: '0' },
                            '100%': { transform: 'translateY(0)', opacity: '1' }
                        },
                        slideInLeft: {
                            '0%': { transform: 'translateX(-30px)', opacity: '0' },
                            '100%': { transform: 'translateX(0)', opacity: '1' }
                        },
                        slideInRight: {
                            '0%': { transform: 'translateX(30px)', opacity: '0' },
                            '100%': { transform: 'translateX(0)', opacity: '1' }
                        },
                        highlight: {
                            '0%': { backgroundColor: 'transparent', boxShadow: '0 0 0 rgba(59, 130, 246, 0)' },
                            '50%': { backgroundColor: 'rgba(59, 130, 246, 0.1)', boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
                            '100%': { backgroundColor: 'transparent', boxShadow: '0 0 0 rgba(59, 130, 246, 0)' }
                        },
                        float: {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-10px)' }
                        },
                        glow: {
                            '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
                            '100%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' }
                        },
                        gradientShift: {
                            '0%, 100%': { backgroundPosition: '0% 50%' },
                            '50%': { backgroundPosition: '100% 50%' }
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .highlight-problem {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
            padding: 8px 12px;
            border-radius: 12px;
            border-left: 4px solid #3b82f6;
            animation: highlight 3s ease-in-out;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
        }
        .dark .highlight-problem {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%);
            border-left-color: #60a5fa;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        .gradient-bg {
            background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
            background-size: 400% 400%;
            animation: gradientShift 8s ease-in-out infinite;
        }
        .glass-effect {
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .dark .glass-effect {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
    </style>
</head>
<body class="gradient-bg min-h-screen transition-all duration-500">
    <!-- 装饰性背景元素 -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div class="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style="animation-delay: -3s;"></div>
        <div class="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float" style="animation-delay: -6s;"></div>
    </div>
    
    <div class="relative z-10 container mx-auto px-6 py-12 max-w-5xl">
        <div class="glass-effect rounded-3xl shadow-2xl p-10 animate-fade-in border border-white/20">
            <!-- 页面标题装饰 -->
            <div class="text-center mb-12">
                <div class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full backdrop-blur-sm border border-white/20 mb-6">
                    <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">AI 智能生成 • 实时渲染</span>
                </div>
            </div>
            
            <div class="prose prose-xl max-w-none dark:prose-invert prose-headings:bg-gradient-to-r prose-headings:from-blue-600 prose-headings:to-purple-600 prose-headings:bg-clip-text prose-headings:text-transparent prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed">
                ${content}
            </div>
        </div>
        
        <!-- 浮动操作按钮 -->
        <div class="fixed bottom-8 right-8 flex flex-col space-y-4">
            <button onclick="toggleDarkMode()" class="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
            </button>
            <button onclick="scrollToTop()" class="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
            </button>
        </div>
    </div>
    
    <script>
        // 深色模式切换
        function toggleDarkMode() {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('darkMode', isDark);
        }
        
        // 初始化深色模式
        if (localStorage.getItem('darkMode') === 'true') {
            document.documentElement.classList.add('dark');
        }
        
        // 平滑滚动到顶部
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // 问题高亮功能
        function highlightProblems() {
            const problemKeywords = ['问题', '错误', '异常', '故障', 'bug', 'error', 'issue', 'problem', '重要', '关键', '核心', '重点'];
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            let node;
            while (node = walker.nextNode()) {
                let text = node.textContent;
                let hasHighlight = false;
                
                problemKeywords.forEach(keyword => {
                    if (text.toLowerCase().includes(keyword.toLowerCase())) {
                        hasHighlight = true;
                    }
                });
                
                if (hasHighlight) {
                    const parent = node.parentNode;
                    if (parent && !parent.classList.contains('highlight-problem')) {
                        parent.classList.add('highlight-problem');
                    }
                }
            }
        }
        
        // 添加打字机效果
        function addTypewriterEffect() {
            const elements = document.querySelectorAll('h1, h2, h3');
            elements.forEach((el, index) => {
                el.style.opacity = '0';
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.animation = 'slideInLeft 0.8s ease-out ' + (index * 0.2) + 's both';
                }, index * 200);
            });
        }
        
        // 页面加载完成后执行
        document.addEventListener('DOMContentLoaded', function() {
            highlightProblems();
            addTypewriterEffect();
            
            // 添加滚动动画
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        const delay = index * 100;
                        setTimeout(() => {
                            entry.target.style.animation = 'slideUp 0.8s ease-out both';
                        }, delay);
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('p, ul, blockquote, pre').forEach(el => {
                el.style.opacity = '0';
                observer.observe(el);
            });
            
            // 添加鼠标跟随效果
            document.addEventListener('mousemove', (e) => {
                const cursor = document.querySelector('.cursor-glow');
                if (!cursor) {
                    const glowCursor = document.createElement('div');
                    glowCursor.className = 'cursor-glow fixed w-6 h-6 bg-blue-400/30 rounded-full pointer-events-none z-50 transition-all duration-300';
                    glowCursor.style.transform = 'translate(' + (e.clientX - 12) + 'px, ' + (e.clientY - 12) + 'px)';
                    document.body.appendChild(glowCursor);
                } else {
                    cursor.style.transform = 'translate(' + (e.clientX - 12) + 'px, ' + (e.clientY - 12) + 'px)';
                }
            });
        });
    </script>
</body>
</html>`;
  };

  // 实时生成HTML
  useEffect(() => {
    if (inputText.trim()) {
      setIsGenerating(true);
      const timer = setTimeout(() => {
        const html = generateHTML(inputText);
        setGeneratedHtml(html);
        setIsGenerating(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setGeneratedHtml('');
    }
  }, [inputText]);

  // 导出HTML文件
  const exportHTML = () => {
    const fullHTML = generateFullHTML(generatedHtml);
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ui-prototype.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 获取预览容器样式
  const getPreviewContainerStyle = () => {
    switch (previewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'max-w-full';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800 p-4 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-violet-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-6 transform hover:scale-105 transition-all duration-300">
            <Palette className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
            AI UI 设计原型生成器
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            基于文本内容生成响应式、现代化的单页面原型界面，支持实时预览和导出功能
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>AI 驱动 • 实时生成 • 高端设计</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <Card className="group shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 hover:shadow-purple-500/25 hover:shadow-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10 pb-6">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  文本输入
                </span>
              </CardTitle>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                在此输入您的文本内容，支持 Markdown 格式，内容将保持原样不做任何修改
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <div className="relative">
                <Textarea
                  placeholder="请输入您的文本内容...\n\n支持格式：\n# 标题\n## 二级标题\n**粗体文本**\n*斜体文本*\n- 列表项\n```代码块```"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[500px] resize-none border-0 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl p-6 focus:ring-2 focus:ring-purple-500/50 focus:bg-white dark:focus:bg-gray-700 transition-all duration-300 text-base leading-relaxed backdrop-blur-sm"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-medium shadow-lg">
                  Markdown 支持
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    字符数: <span className="text-purple-600 dark:text-purple-400 font-bold">{inputText.length}</span>
                  </span>
                  {inputText.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>实时预览中</span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={exportHTML}
                  disabled={!generatedHtml}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
                >
                  <Download className="w-5 h-5 mr-2" />
                  导出 HTML
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 预览区域 */}
          <Card className="group shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 hover:shadow-blue-500/25 hover:shadow-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10 pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    实时预览
                  </span>
                  {isGenerating && (
                    <div className="relative">
                      <div className="w-6 h-6 border-3 border-gradient-to-r from-purple-500 to-pink-500 border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-6 h-6 border-2 border-purple-500/30 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                    className={`rounded-xl transition-all duration-300 ${
                      previewMode === 'desktop' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                        : 'border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'tablet' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('tablet')}
                    className={`rounded-xl transition-all duration-300 ${
                      previewMode === 'tablet' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                        : 'border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 rotate-90" />
                  </Button>
                  <Button
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                    className={`rounded-xl transition-all duration-300 ${
                      previewMode === 'mobile' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                        : 'border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                实时预览生成的页面效果，支持响应式布局测试
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 pt-2">
               <div className="space-y-6">
                 <div className={`mx-auto transition-all duration-500 ease-out transform ${
                   previewMode === 'desktop' ? 'w-full scale-100' :
                   previewMode === 'tablet' ? 'w-3/4 scale-95' : 'w-1/2 scale-90'
                 }`}>
                   <div className="relative group">
                     <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                     <div className="relative border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-2xl">
                       <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                         <div className="flex gap-2">
                           <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                           <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                           <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                         </div>
                         <div className="flex-1 text-center">
                           <div className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full inline-block">
                             预览模式: {previewMode === 'desktop' ? '桌面端' : previewMode === 'tablet' ? '平板端' : '移动端'}
                           </div>
                         </div>
                       </div>
                       <iframe
                         srcDoc={generatedHtml}
                         className="w-full h-96 border-0 bg-white dark:bg-gray-900"
                         title="预览"
                       />
                     </div>
                   </div>
                 </div>
                
                 {generatedHtml && (
                   <div className="flex justify-center">
                     <Button 
                       onClick={exportHTML}
                       className="group relative px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                     >
                       <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                       <div className="relative flex items-center gap-3">
                         <Download className="w-5 h-5" />
                         <span>导出 HTML</span>
                         <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                       </div>
                     </Button>
                   </div>
                 )}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* 功能特性说明 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative text-center p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transform group-hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">响应式布局</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                适应不同屏幕尺寸，完美支持桌面、平板和移动设备
              </p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative text-center p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transform group-hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">现代设计</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                采用Tailwind CSS，简约美观的界面设计
              </p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative text-center p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transform group-hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">实时预览</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                即时查看设计效果，支持多设备预览模式
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIDesigner;