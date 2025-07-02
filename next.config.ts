import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // EdgeOne Pages 配置
  images: {
    unoptimized: true // EdgeOne Pages 优化图片处理
  },
  // 保持 SSR 和 API 路由支持
  serverExternalPackages: [],
  
  // 修复静态资源问题
  trailingSlash: true,
  
  // 处理静态文件
  async rewrites() {
    return [
      // 处理 .txt 文件请求，重定向到主页
      {
        source: '/:path*.txt',
        destination: '/',
      },
    ];
  },
  
  // 处理404页面
  async redirects() {
    return [
      // 重定向不存在的.txt文件到对应页面
      {
        source: '/weekend-plan.txt',
        destination: '/weekend-plan',
        permanent: false,
      },
      {
        source: '/daily-report.txt',
        destination: '/daily-report',
        permanent: false,
      },
      {
        source: '/games.txt',
        destination: '/games',
        permanent: false,
      },
      {
        source: '/group-report.txt',
        destination: '/group-report',
        permanent: false,
      },
      {
        source: '/profile.txt',
        destination: '/profile',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
