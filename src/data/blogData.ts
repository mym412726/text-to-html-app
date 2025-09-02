import { BlogPost } from '../types/blog';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'React 18 新特性深度解析',
    content: `# React 18 新特性深度解析

React 18 带来了许多令人兴奋的新特性，包括并发渲染、自动批处理、Suspense 改进等。

## 并发渲染

并发渲染是 React 18 最重要的特性之一。它允许 React 在渲染过程中暂停和恢复工作，从而提供更好的用户体验。

## 自动批处理

在 React 18 中，所有的状态更新都会自动批处理，无论它们发生在哪里。这意味着更少的重新渲染和更好的性能。

## Suspense 改进

Suspense 现在支持服务端渲染，并且可以与并发特性完美配合。

总的来说，React 18 为开发者提供了更强大的工具来构建高性能的用户界面。`,
    excerpt: 'React 18 带来了并发渲染、自动批处理等重要特性，让我们深入了解这些新功能如何改善开发体验。',
    author: {
      name: '张三',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%20portrait&image_size=square'
    },
    publishedAt: '2024-01-15',
    tags: ['React', 'JavaScript', '前端开发'],
    readTime: 8,
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20react%20development%20coding%20workspace&image_size=landscape_16_9'
  },
  {
    id: '2',
    title: 'TypeScript 最佳实践指南',
    content: `# TypeScript 最佳实践指南

TypeScript 为 JavaScript 带来了静态类型检查，帮助开发者编写更可靠的代码。

## 类型定义

良好的类型定义是 TypeScript 项目成功的关键。我们应该：

- 使用接口定义对象结构
- 利用联合类型处理多种可能性
- 善用泛型提高代码复用性

## 配置优化

合理的 tsconfig.json 配置可以显著提升开发体验：

- 启用严格模式
- 配置路径映射
- 设置合适的编译目标

## 工具集成

与现代开发工具的集成让 TypeScript 更加强大：

- ESLint 代码检查
- Prettier 代码格式化
- VS Code 智能提示

掌握这些最佳实践，你将能够充分发挥 TypeScript 的威力。`,
    excerpt: '掌握 TypeScript 最佳实践，包括类型定义、配置优化和工具集成，提升代码质量和开发效率。',
    author: {
      name: '李四',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=female%20software%20engineer%20professional%20headshot&image_size=square'
    },
    publishedAt: '2024-01-12',
    tags: ['TypeScript', 'JavaScript', '最佳实践'],
    readTime: 6,
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=typescript%20code%20editor%20with%20type%20annotations&image_size=landscape_16_9'
  },
  {
    id: '3',
    title: 'Tailwind CSS 设计系统构建',
    content: `# Tailwind CSS 设计系统构建

Tailwind CSS 提供了一种全新的方式来构建现代化的设计系统。

## 原子化 CSS

原子化 CSS 的核心思想是将样式拆分成最小的、可复用的单元：

- 每个类只负责一个样式属性
- 高度可组合和可预测
- 避免样式冲突

## 自定义配置

Tailwind 的配置系统非常灵活：

- 自定义颜色调色板
- 扩展间距系统
- 添加自定义工具类

## 组件抽象

虽然 Tailwind 是原子化的，但我们仍然需要合理的组件抽象：

- 使用 @apply 指令
- 创建可复用的组件类
- 保持设计一致性

## 性能优化

Tailwind 的 PurgeCSS 集成确保生产环境的 CSS 文件最小化。

通过这些策略，你可以构建出既灵活又高效的设计系统。`,
    excerpt: '学习如何使用 Tailwind CSS 构建可维护的设计系统，包括原子化 CSS、自定义配置和组件抽象。',
    author: {
      name: '王五',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=creative%20ui%20designer%20professional%20portrait&image_size=square'
    },
    publishedAt: '2024-01-10',
    tags: ['Tailwind CSS', 'CSS', '设计系统'],
    readTime: 7,
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20web%20design%20interface%20with%20tailwind%20css&image_size=landscape_16_9'
  },
  {
    id: '4',
    title: 'Vite 构建工具深入理解',
    content: `# Vite 构建工具深入理解

Vite 是下一代前端构建工具，提供了极快的开发体验。

## 核心原理

Vite 的核心优势来自于：

- 基于 ES 模块的开发服务器
- 使用 esbuild 进行依赖预构建
- Rollup 打包生产代码

## 开发体验

极速的热更新和模块替换：

- 毫秒级的模块热替换
- 按需编译
- 原生 ES 模块支持

## 插件生态

Vite 拥有丰富的插件生态：

- Vue、React、Svelte 官方插件
- TypeScript 开箱即用
- CSS 预处理器支持

## 生产优化

生产环境的优化策略：

- Tree-shaking
- 代码分割
- 资源压缩

Vite 正在改变前端开发的游戏规则。`,
    excerpt: '深入了解 Vite 构建工具的核心原理、开发体验和生产优化，体验下一代前端开发工具的魅力。',
    author: {
      name: '赵六',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=senior%20frontend%20developer%20professional%20headshot&image_size=square'
    },
    publishedAt: '2024-01-08',
    tags: ['Vite', '构建工具', '前端开发'],
    readTime: 5,
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fast%20build%20tool%20development%20environment&image_size=landscape_16_9'
  },
  {
    id: '5',
    title: '现代前端状态管理方案对比',
    content: `# 现代前端状态管理方案对比

前端状态管理一直是复杂应用开发的核心问题。

## Redux Toolkit

Redux 的现代化版本：

- 简化的 API
- 内置 Immer
- 优秀的 DevTools

## Zustand

轻量级状态管理：

- 极简的 API
- TypeScript 友好
- 无样板代码

## Jotai

原子化状态管理：

- 自底向上的方法
- 细粒度更新
- 组合性强

## React Query

服务端状态管理：

- 缓存和同步
- 后台更新
- 乐观更新

## 选择建议

根据项目需求选择合适的方案：

- 大型应用：Redux Toolkit
- 中小型应用：Zustand
- 复杂状态逻辑：Jotai
- 服务端数据：React Query

没有银弹，选择最适合的工具。`,
    excerpt: '对比分析 Redux Toolkit、Zustand、Jotai 和 React Query 等现代前端状态管理方案的特点和适用场景。',
    author: {
      name: '钱七',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=experienced%20javascript%20developer%20portrait&image_size=square'
    },
    publishedAt: '2024-01-05',
    tags: ['状态管理', 'React', 'JavaScript'],
    readTime: 9,
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=state%20management%20architecture%20diagram&image_size=landscape_16_9'
  },
  {
    id: '6',
    title: 'Web 性能优化实战指南',
    content: `# Web 性能优化实战指南

网站性能直接影响用户体验和业务指标。

## 加载性能

优化首屏加载时间：

- 代码分割和懒加载
- 资源压缩和缓存
- CDN 加速
- 预加载关键资源

## 运行时性能

提升交互响应速度：

- 避免长任务阻塞
- 使用 Web Workers
- 优化重排和重绘
- 内存泄漏防范

## 图像优化

图像是性能的重要因素：

- 选择合适的格式
- 响应式图像
- 懒加载实现
- WebP 和 AVIF 支持

## 监控和测量

性能监控工具：

- Lighthouse 审计
- Web Vitals 指标
- 真实用户监控
- 性能预算设定

## 最佳实践

持续的性能优化策略：

- 建立性能文化
- 自动化测试
- 渐进式优化
- 用户体验优先

性能优化是一个持续的过程，需要团队的共同努力。`,
    excerpt: '全面的 Web 性能优化指南，涵盖加载性能、运行时性能、图像优化和监控测量等关键领域。',
    author: {
      name: '孙八',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=web%20performance%20engineer%20professional%20photo&image_size=square'
    },
    publishedAt: '2024-01-03',
    tags: ['性能优化', 'Web开发', '用户体验'],
    readTime: 10,
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=web%20performance%20optimization%20dashboard&image_size=landscape_16_9'
  }
];

export const getPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

export const getRelatedPosts = (currentPostId: string, tags: string[], limit: number = 3): BlogPost[] => {
  return blogPosts
    .filter(post => 
      post.id !== currentPostId && 
      post.tags.some(tag => tags.includes(tag))
    )
    .slice(0, limit);
};

export const getPaginatedPosts = (page: number, pageSize: number = 6) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPosts = blogPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(blogPosts.length / pageSize);
  
  return {
    posts: paginatedPosts,
    currentPage: page,
    totalPages,
    totalPosts: blogPosts.length
  };
};