// EdgeOne Pages 配置文件
// 参考: https://cloud.tencent.com/document/product/1552

module.exports = {
  // 构建配置
  build: {
    command: 'npm run build',
    directory: '.next',
    environment: {
      NODE_VERSION: '18'
    }
  },
  
  // 函数配置（API Routes）
  functions: {
    'api/**': {
      runtime: 'nodejs18.x',
      memory: 512,
      timeout: 10
    }
  },
  
  // 重定向配置
  redirects: [
    {
      source: '/api/(.*)',
      destination: '/api/$1',
      permanent: false
    }
  ],
  
  // 环境变量（在控制台配置）
  env: {
    // 这些需要在 EdgeOne 控制台中设置
    NODE_ENV: 'production'
  }
}; 