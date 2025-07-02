/**
 * 环境配置文件
 * 用于混合部署方案：EdgeOne Pages (前端) + Vercel (API)
 */

// API 基础地址配置
export const API_CONFIG = {
  // 生产环境 API 地址（Vercel）
  PRODUCTION_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-app.vercel.app',
  
  // 开发环境 API 地址
  DEVELOPMENT_API_URL: 'http://localhost:3000',
  
  // 获取当前 API 基础地址
  getApiBaseUrl: () => {
    if (typeof window === 'undefined') {
      // 服务器端
      return process.env.NODE_ENV === 'production' 
        ? API_CONFIG.PRODUCTION_API_URL 
        : API_CONFIG.DEVELOPMENT_API_URL;
    }
    
    // 客户端
    return process.env.NODE_ENV === 'production' 
      ? API_CONFIG.PRODUCTION_API_URL 
      : API_CONFIG.DEVELOPMENT_API_URL;
  }
};

// 导出配置
export default API_CONFIG; 