/**
 * EdgeOne Pages Functions - 单个用户API
 * 动态路由：/api/users/[name]
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
 * 处理单个用户API请求
 */
export async function onRequest({ request, params, env }) {
  const { method } = request;
  const userName = params.name;
  
  console.log(`👤 单个用户API请求: ${method} /api/users/${userName}`);
  
  try {
    // 处理OPTIONS预检请求
    if (method === 'OPTIONS') {
      return createResponse({ message: 'CORS preflight OK' });
    }
    
    // GET请求 - 获取特定用户
    if (method === 'GET') {
      console.log(`👤 获取用户: ${userName}`);
      
      const data = await getData(env);
      const user = data.users ? data.users.find(u => u.name === userName) : null;
      
      if (user) {
        return createResponse(user);
      } else {
        return createResponse({ 
          error: '用户不存在', 
          userName 
        }, 404);
      }
    }
    
    // POST请求 - 更新特定用户
    if (method === 'POST') {
      console.log(`✏️ 更新用户: ${userName}`);
      
      const userData = await request.json();
      const data = await getData(env);
      
      // 确保users数组存在
      if (!data.users) {
        data.users = [];
      }
      
      // 查找并更新用户
      const userIndex = data.users.findIndex(u => u.name === userName);
      
      if (userIndex >= 0) {
        // 更新现有用户
        data.users[userIndex] = { 
          ...data.users[userIndex], 
          ...userData,
          name: userName, // 确保用户名不被覆盖
          updatedAt: new Date().toISOString()
        };
      } else {
        // 创建新用户
        data.users.push({
          ...userData,
          name: userName,
          id: userData.id || Date.now().toString(),
          createdAt: new Date().toISOString()
        });
      }
      
      // 更新时间戳
      data.lastUpdated = new Date().toISOString();
      
      await saveData(env, data);
      
      return createResponse({ 
        success: true, 
        message: userIndex >= 0 ? '用户更新成功' : '用户创建成功',
        user: data.users[userIndex >= 0 ? userIndex : data.users.length - 1]
      });
    }
    
    // 不支持的HTTP方法
    return createResponse({ 
      error: '不支持的HTTP方法', 
      method 
    }, 405);
    
  } catch (error) {
    console.error('❌ 单个用户API错误:', error);
    return createResponse({ 
      error: '服务器内部错误', 
      message: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
} 