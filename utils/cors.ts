import { NextResponse } from 'next/server';

/**
 * 添加 CORS 头到响应
 */
export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

/**
 * 处理 OPTIONS 预检请求
 */
export function handleCorsOptions(): NextResponse {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}

/**
 * 创建带有 CORS 头的 JSON 响应
 */
export function corsJsonResponse(data: any, init?: ResponseInit): NextResponse {
  const response = NextResponse.json(data, init);
  return addCorsHeaders(response);
} 