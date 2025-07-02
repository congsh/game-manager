/**
 * 环境配置文件
 * 用于混合部署方案：EdgeOne Pages (前端) + 多重API备份
 */

// API 基础地址配置
export const API_CONFIG = {
  // 主要 API 地址（华为云函数计算）
  PRIMARY_API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_HUAWEI_API_URL || 'https://your-function-url.functiongraph.cn-north-4.huaweicloud.com',
  
  // 备用 API 地址列表
  BACKUP_API_URLS: [
    'https://your-env-id.service.tcloudbase.com', // CloudBase 备用
    'https://game-manager-api.vercel.app',        // Vercel 备用
    'https://game-manager-murex.vercel.app'
  ],
  
  // 开发环境 API 地址
  DEVELOPMENT_API_URL: 'http://localhost:3000',
  
  // 获取当前 API 基础地址（带自动切换）
  getApiBaseUrl: () => {
    if (typeof window === 'undefined') {
      // 服务器端
      return process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_API_URL || API_CONFIG.PRIMARY_API_URL
        : API_CONFIG.DEVELOPMENT_API_URL;
    }
    
    // 客户端
    return process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_API_URL || API_CONFIG.PRIMARY_API_URL
      : API_CONFIG.DEVELOPMENT_API_URL;
  },
  
  // 获取所有可用的 API 地址
  getAllApiUrls: () => {
    const primary = process.env.NEXT_PUBLIC_API_URL || API_CONFIG.PRIMARY_API_URL;
    return [primary, ...API_CONFIG.BACKUP_API_URLS];
  }
};

// 导出配置
export default API_CONFIG; 