import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // EdgeOne Pages 配置
  images: {
    unoptimized: true // EdgeOne Pages 优化图片处理
  },
  // 保持 SSR 和 API 路由支持
  serverExternalPackages: []
};

export default nextConfig;
