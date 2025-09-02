import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Github, Heart, Shield, ShoppingCart, Zap, Calendar, User, ArrowRight, BookOpen, Star, FileText, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogData";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            shadcn/ui + Tailwind CSS
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            一个现代化的前端项目，展示 shadcn/ui 组件库与 Tailwind CSS 的强大功能
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2">
              <Star className="w-4 h-4" />
              开始使用
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Github className="w-4 h-4" />
              查看源码
            </Button>
          </div>
        </div>

        {/* Button Variants Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
            按钮组件变体
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Default Buttons */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">默认样式</h3>
              <div className="space-y-3">
                <Button variant="default" className="w-full">Default Button</Button>
                <Button variant="secondary" className="w-full">Secondary Button</Button>
                <Button variant="outline" className="w-full">Outline Button</Button>
              </div>
            </div>

            {/* Interactive Buttons */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">交互样式</h3>
              <div className="space-y-3">
                <Button variant="ghost" className="w-full">Ghost Button</Button>
                <Button variant="link" className="w-full">Link Button</Button>
                <Button variant="destructive" className="w-full">Destructive Button</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">尺寸变体</h3>
              <div className="space-y-3">
                <Button size="sm" className="w-full">Small Button</Button>
                <Button size="default" className="w-full">Default Size</Button>
                <Button size="lg" className="w-full">Large Button</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
            组件库特性
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">高性能</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                基于 React 和 TypeScript 构建，提供出色的开发体验和运行性能。
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">类型安全</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                完整的 TypeScript 支持，确保代码的可靠性和可维护性。
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg mr-3">
                  <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">易于使用</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                简洁的 API 设计，开箱即用的组件，让开发变得更加高效。
              </p>
            </div>
          </div>
        </div>

        {/* Product Recommendations Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
            推荐产品
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product Card 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                <img 
                  src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20wireless%20headphones%20product%20photography%20white%20background%20minimalist%20style&image_size=square" 
                  alt="无线耳机" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">无线蓝牙耳机</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">高品质音效，降噪技术，续航24小时</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">¥299</span>
                  <Button size="sm" className="gap-1">
                    <ShoppingCart className="w-3 h-3" />
                    购买
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 flex items-center justify-center">
                <img 
                  src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20watch%20fitness%20tracker%20product%20photography%20white%20background%20modern%20design&image_size=square" 
                  alt="智能手表" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">智能运动手表</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">健康监测，GPS定位，防水设计</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">¥899</span>
                  <Button size="sm" className="gap-1">
                    <ShoppingCart className="w-3 h-3" />
                    购买
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 flex items-center justify-center">
                <img 
                  src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=wireless%20charging%20pad%20modern%20minimalist%20design%20product%20photography%20white%20background&image_size=square" 
                  alt="无线充电器" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">无线充电底座</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">快速充电，兼容多设备，安全保护</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">¥199</span>
                  <Button size="sm" className="gap-1">
                    <ShoppingCart className="w-3 h-3" />
                    购买
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Card 4 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 flex items-center justify-center">
                <img 
                  src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=portable%20bluetooth%20speaker%20modern%20design%20product%20photography%20white%20background%20compact&image_size=square" 
                  alt="蓝牙音箱" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">便携蓝牙音箱</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">360度环绕音效，防水防尘，长续航</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">¥399</span>
                  <Button size="sm" className="gap-1">
                    <ShoppingCart className="w-3 h-3" />
                    购买
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Preview Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              最新博客
            </h2>
            <Link to="/blog">
              <Button variant="outline" className="gap-2">
                <BookOpen className="w-4 h-4" />
                查看全部
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden rounded-t-lg">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                     <Calendar className="w-3 h-3" />
                     <span>{new Date(post.publishedAt).toLocaleDateString('zh-CN')}</span>
                     <User className="w-3 h-3 ml-2" />
                     <span>{post.author.name}</span>
                   </div>
                  <CardTitle className="text-lg leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Link to={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {post.readTime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
            开始你的项目
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2">
              <Download className="w-4 h-4" />
              下载模板
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </Button>
            <Link to="/text-to-html">
              <Button variant="secondary" size="lg" className="gap-2">
                <FileText className="w-4 h-4" />
                文本转HTML
              </Button>
            </Link>
            <Link to="/ui-designer">
              <Button variant="secondary" size="lg" className="gap-2">
                <Palette className="w-4 h-4" />
                UI设计器
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              查看文档
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}