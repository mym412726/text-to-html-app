import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CalendarDays, Clock, User, Share2, BookOpen, Sparkles, Heart } from 'lucide-react';
import { getPostById, getRelatedPosts } from '@/data/blogData';
import { BlogPost } from '@/types/blog';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundPost = getPostById(id);
      if (foundPost) {
        setPost(foundPost);
        const related = getRelatedPosts(id, foundPost.tags, 3);
        setRelatedPosts(related);
      }
      setLoading(false);
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('分享失败:', error);
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  // 检测内容是否包含HTML标签
  const isHtmlContent = (content: string) => {
    const htmlTagRegex = /<\/?[a-z][\s\S]*>/i;
    return htmlTagRegex.test(content);
  };

  const renderMarkdownContent = (content: string) => {
    // 简单的 Markdown 渲染（实际项目中建议使用专业的 Markdown 解析库）
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return (
            <h1 key={index} className="text-3xl font-bold text-slate-900 dark:text-white mb-6 mt-8">
              {line.substring(2)}
            </h1>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4 mt-6">
              {line.substring(3)}
            </h2>
          );
        }
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="text-slate-700 dark:text-slate-300 mb-2 ml-4">
              {line.substring(2)}
            </li>
          );
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return (
          <p key={index} className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
            {line}
          </p>
        );
      });
  };

  // 渲染HTML内容（使用dangerouslySetInnerHTML）
  const renderHtmlContent = (content: string) => {
    return (
      <>
        {/* 添加文本转HTML页面的样式 */}
        <style>{`
          /* 自定义动画 */
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
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          
          /* 代码块语法高亮 */
          .code-block {
            position: relative;
            overflow: hidden;
          }
          
          .code-block::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
            animation: pulse 2s infinite;
          }
        `}</style>
        <div 
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">文章未找到</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">抱歉，您访问的文章不存在。</p>
          <Button onClick={() => navigate('/blog')} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            返回博客列表
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-950/30 dark:to-purple-950/30 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回博客列表
          </Button>
        </div>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-xl" />
            <div className="absolute top-4 right-4 z-20">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">精选文章</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8 mb-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-20"></div>
              <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30"></div>
            </div>

            <div className="relative z-10">
              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-6">
                {post.tags.map((tag, index) => (
                  <Badge 
                    key={tag} 
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                      index % 3 === 0 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-blue-500/25'
                        : index % 3 === 1
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-purple-500/25'
                        : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg hover:shadow-pink-500/25'
                    }`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full border border-blue-200 dark:border-blue-700">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-blue-700 dark:text-blue-300 font-medium">{post.author.name}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full border border-purple-200 dark:border-purple-700">
                  <CalendarDays className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-purple-700 dark:text-purple-300 font-medium">{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-full border border-green-200 dark:border-green-700">
                  <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-300 font-medium">{post.readTime} 分钟阅读</span>
                </div>
              </div>

              {/* Share Button */}
              <div className="flex justify-end mb-8">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    收藏
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    分享
                  </Button>
                </div>
              </div>

              {/* Excerpt */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-700 dark:to-blue-900/20 rounded-xl p-6 mb-8 border border-slate-200/50 dark:border-slate-600/50">
                <p className="text-lg text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* Content */}
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {isHtmlContent(post.content) ? renderHtmlContent(post.content) : renderMarkdownContent(post.content)}
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-400 to-purple-400 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                    相关文章推荐
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost, index) => (
                    <Card key={relatedPost.id} className="group cursor-pointer bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
                      <div className="relative overflow-hidden">
                        <img
                          src={relatedPost.imageUrl}
                          alt={relatedPost.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300" />
                        <div className="absolute top-3 right-3">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm ${
                            index % 3 === 0 
                              ? 'bg-blue-500/80'
                              : index % 3 === 1
                              ? 'bg-purple-500/80'
                              : 'bg-pink-500/80'
                          }`}>
                            推荐
                          </div>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex flex-wrap gap-1">
                            {relatedPost.tags.slice(0, 2).map((tag, tagIndex) => (
                              <Badge 
                                key={tag} 
                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  tagIndex % 2 === 0
                                    ? 'bg-white/20 text-white border-white/30'
                                    : 'bg-blue-500/20 text-blue-100 border-blue-300/30'
                                }`}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={relatedPost.author.avatar}
                              alt={relatedPost.author.name}
                              className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-600"
                            />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{relatedPost.author.name}</span>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(relatedPost.publishedAt)}</span>
                        </div>
                        <Link to={`/blog/${relatedPost.id}`} className="block mt-4">
                          <Button variant="outline" size="sm" className="w-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 transition-all duration-300">
                            阅读文章
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;