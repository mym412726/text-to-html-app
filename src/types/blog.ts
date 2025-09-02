export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  tags: string[];
  readTime: number;
  imageUrl: string;
}

export interface BlogListProps {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface BlogDetailProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}