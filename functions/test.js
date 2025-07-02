/**
 * EdgeOne Pages Functions 测试函数
 * 访问路径：/test
 */

export async function onRequest({ request }) {
  console.log('🧪 测试函数被调用');
  
  const { method, url } = request;
  const userAgent = request.headers.get('User-Agent') || '未知';
  
  const response = {
    success: true,
    message: 'EdgeOne Pages Functions 工作正常！',
    timestamp: new Date().toISOString(),
    requestInfo: {
      method,
      url,
      userAgent
    },
    functions: '✅ 已启用',
    version: '1.0.0'
  };
  
  return new Response(JSON.stringify(response, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    }
  });
} 