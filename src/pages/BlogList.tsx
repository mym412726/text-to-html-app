import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, User, ChevronLeft, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { getPaginatedPosts } from '@/data/blogData';
import { BlogPost } from '@/types/blog';

const BlogList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState({
    posts: [] as BlogPost[],
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0
  });

  useEffect(() => {
    const data = getPaginatedPosts(currentPage, 6);
    setPaginatedData(data);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 动态背景 */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full dark:hidden" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f1f5f9' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          <div className="w-full h-full dark:block hidden" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        {/* 浮动装饰元素 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">精选技术内容</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent mb-6 animate-slide-up">
            技术博客
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
            探索前沿技术，分享开发经验，构建更美好的数字世界
          </p>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500 dark:text-slate-400 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>每周更新</span>
            </div>
            <div className="w-1 h-1 bg-slate-400 rounded-full" />
            <span>深度技术洞察</span>
            <div className="w-1 h-1 bg-slate-400 rounded-full" />
            <span>实战经验分享</span>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {paginatedData.posts.map((post, index) => (
            <Card key={post.id} className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              {/* 卡片光效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />
              
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* 浮动标签 */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} className="bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 backdrop-blur-sm border-0 shadow-lg text-xs font-medium px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <CardHeader className="pb-4 relative">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2 leading-tight">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mt-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0 pb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <img
                      src={post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=6366f1&color=fff`}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-700 shadow-sm"
                    />
                    <span className="font-medium">{post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}min</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                  {formatDate(post.publishedAt)}
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                <Link to={`/blog/${post.id}`} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 font-medium">
                    <span className="flex items-center gap-2">
                      阅读全文
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </div>
                    </span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {paginatedData.totalPages > 1 && (
          <div className="flex flex-col items-center gap-6">
            <div className="flex justify-center items-center gap-3">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                上一页
              </Button>
              
              <div className="flex gap-2">
                {Array.from({ length: paginatedData.totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    className={`w-12 h-12 rounded-xl font-medium transition-all duration-300 ${
                      page === currentPage
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === paginatedData.totalPages}
                className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 disabled:opacity-50"
              >
                下一页
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Stats */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  显示第 <span className="font-medium text-blue-600 dark:text-blue-400">{((currentPage - 1) * 6) + 1}</span> - <span className="font-medium text-blue-600 dark:text-blue-400">{Math.min(currentPage * 6, paginatedData.totalPosts)}</span> 篇，
                  共 <span className="font-medium text-purple-600 dark:text-purple-400">{paginatedData.totalPosts}</span> 篇文章
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;