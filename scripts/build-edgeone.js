#!/usr/bin/env node

/**
 * EdgeOne Pages 专用构建脚本
 * 处理静态导出和API路由的兼容性问题
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始 EdgeOne Pages 构建...\n');

// 检查 EdgeOne Pages 构建环境
const isEdgeOneBuild = process.env.EDGEONE_BUILD === 'true';

if (isEdgeOneBuild) {
  console.log('📦 检测到 EdgeOne Pages 环境，使用静态导出模式...');
  
  // 创建临时的 next.config.js 用于静态导出
  const staticConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true
  },
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
};

module.exports = nextConfig;
`;

  // 备份原配置
  const originalConfig = path.join(process.cwd(), 'next.config.ts');
  const backupConfig = path.join(process.cwd(), 'next.config.ts.backup');
  
  if (fs.existsSync(originalConfig)) {
    fs.copyFileSync(originalConfig, backupConfig);
  }
  
  // 写入静态导出配置
  fs.writeFileSync(path.join(process.cwd(), 'next.config.js'), staticConfig);
  
  try {
    // 设置环境变量禁用API路由
    process.env.NEXT_DISABLE_API_ROUTES = 'true';
    
    // 执行构建
    console.log('⚙️  执行静态构建...');
    execSync('npx next build', { stdio: 'inherit' });
    
    // 检查输出目录
    const outDir = path.join(process.cwd(), 'out');
    if (fs.existsSync(outDir)) {
      console.log('✅ 静态导出成功！');
      
      // 创建 API 提示文件
      const apiNotice = `
# API 路由说明

EdgeOne Pages 静态导出模式下，API 路由需要部署到支持服务器端功能的平台。

建议方案：
1. 前端：EdgeOne Pages (国内加速)
2. API：Vercel/Railway (海外服务器)

配置方法：
在前端代码中设置 API 基础 URL：
\`\`\`javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.vercel.app'  // API 服务器
  : 'http://localhost:3000'               // 本地开发
\`\`\`
`;
      
      fs.writeFileSync(path.join(outDir, 'API-SETUP.md'), apiNotice);
      
    } else {
      throw new Error('输出目录 out 未找到');
    }
    
  } catch (error) {
    console.error('❌ 构建失败:', error.message);
    process.exit(1);
  } finally {
    // 恢复原配置
    fs.unlinkSync(path.join(process.cwd(), 'next.config.js'));
    if (fs.existsSync(backupConfig)) {
      fs.copyFileSync(backupConfig, originalConfig);
      fs.unlinkSync(backupConfig);
    }
  }
  
} else {
  // 标准构建（用于本地开发和其他平台）
  console.log('🔧 标准构建模式...');
  execSync('next build', { stdio: 'inherit' });
}

console.log('\n🎉 构建完成！'); 