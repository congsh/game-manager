/**
 * EdgeOne Pages Functions - 用户管理API
 * 处理用户相关的操作
 */

const DATA_KEY = 'game-manager-data';

/**
 * 创建标准响应
 */
function createResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Cache-Control': 'no-cache'
    }
  });
}

/**
 * 获取数据
 */
async function getData(env) {
  if (env.GAME_MANAGER_KV) {
    const storedData = await env.GAME_MANAGER_KV.get(DATA_KEY);
    return storedData ? JSON.parse(storedData) : { users: [] };
  }
  return { users: [] };
}

/**
 * 保存数据
 */
async function saveData(env, data) {
  if (env.GAME_MANAGER_KV) {
    await env.GAME_MANAGER_KV.put(DATA_KEY, JSON.stringify(data));
  }
}

/**
 * 处理用户API请求
 */
export async function onRequest({ request, env }) {
  const { method } = request;
  
  console.log(`👥 用户API请求: ${method} /api/users`);
  
  try {
    // 处理OPTIONS预检请求
    if (method === 'OPTIONS') {
      return createResponse({ message: 'CORS preflight OK' });
    }
    
    // GET请求 - 获取所有用户
    if (method === 'GET') {
      console.log('👥 获取所有用户');
      const data = await getData(env);
      return createResponse(data.users || []);
    }
    
    // POST请求 - 创建新用户
    if (method === 'POST') {
      console.log('➕ 创建新用户');
      
      const userData = await request.json();
      const data = await getData(env);
      
      // 确保users数组存在
      if (!data.users) {
        data.users = [];
      }
      
      // 检查用户是否已存在
      const existingUserIndex = data.users.findIndex(u => u.name === userData.name);
      
      if (existingUserIndex >= 0) {
        // 更新现有用户
        data.users[existingUserIndex] = { ...data.users[existingUserIndex], ...userData };
      } else {
        // 添加新用户
        data.users.push({
          ...userData,
          id: userData.id || Date.now().toString(),
          createdAt: new Date().toISOString()
        });
      }
      
      // 更新时间戳
      data.lastUpdated = new Date().toISOString();
      
      await saveData(env, data);
      
      return createResponse({ 
        success: true, 
        message: existingUserIndex >= 0 ? '用户更新成功' : '用户创建成功'
      });
    }
    
    // 不支持的HTTP方法
    return createResponse({ 
      error: '不支持的HTTP方法', 
      method 
    }, 405);
    
  } catch (error) {
    console.error('❌ 用户API错误:', error);
    return createResponse({ 
      error: '服务器内部错误', 
      message: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
} 