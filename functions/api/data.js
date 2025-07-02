/**
 * EdgeOne Pages Functions - 数据管理API
 * 处理游戏管理系统的数据存储和读取
 */

// 使用KV存储作为数据持久化方案
const DATA_KEY = 'game-manager-data';

/**
 * 获取默认数据结构
 */
function getDefaultData() {
  return {
    users: [],
    games: [],
    dailySignups: [],
    weekendPlans: [],
    gameGroups: [],
    lastUpdated: new Date().toISOString()
  };
}

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
 * 处理所有HTTP方法的请求
 */
export async function onRequest({ request, env }) {
  const { method } = request;
  
  console.log(`📡 Pages Functions API请求: ${method} /api/data`);
  
  try {
    // 处理OPTIONS预检请求
    if (method === 'OPTIONS') {
      return createResponse({ message: 'CORS preflight OK' });
    }
    
    // GET请求 - 获取所有数据
    if (method === 'GET') {
      console.log('📊 获取所有数据');
      
      // 从KV存储获取数据
      let data;
      if (env.GAME_MANAGER_KV) {
        const storedData = await env.GAME_MANAGER_KV.get(DATA_KEY);
        data = storedData ? JSON.parse(storedData) : getDefaultData();
      } else {
        console.log('⚠️ KV存储未配置，使用默认数据');
        data = getDefaultData();
      }
      
      return createResponse(data);
    }
    
    // POST请求 - 更新数据
    if (method === 'POST') {
      console.log('✏️ 更新数据');
      
      const newData = await request.json();
      
      // 合并数据，保持结构完整性
      const updatedData = {
        users: newData.users || [],
        games: newData.games || [],
        dailySignups: newData.dailySignups || [],
        weekendPlans: newData.weekendPlans || [],
        gameGroups: newData.gameGroups || [],
        lastUpdated: newData.lastUpdated || new Date().toISOString()
      };
      
      // 保存到KV存储
      if (env.GAME_MANAGER_KV) {
        await env.GAME_MANAGER_KV.put(DATA_KEY, JSON.stringify(updatedData));
        console.log('💾 数据已保存到KV存储');
      } else {
        console.log('⚠️ KV存储未配置，数据未持久化');
      }
      
      return createResponse({ 
        success: true, 
        message: '数据更新成功',
        lastUpdated: updatedData.lastUpdated
      });
    }
    
    // 不支持的HTTP方法
    return createResponse({ 
      error: '不支持的HTTP方法', 
      method 
    }, 405);
    
  } catch (error) {
    console.error('❌ API执行错误:', error);
    return createResponse({ 
      error: '服务器内部错误', 
      message: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
} 