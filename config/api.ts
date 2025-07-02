/**
 * API 配置文件
 * EdgeOne Pages Functions - 同域API，无跨域问题
 */

export const API_CONFIG = {
  // 获取 API 基础地址
  getApiBaseUrl: () => {
    // 开发环境
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000';
    }
    
    // 生产环境：使用同域API（EdgeOne Pages Functions）
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    
    return '';
  }
};

export default API_CONFIG; 