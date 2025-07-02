const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// CloudBase 函数入口
exports.main = async (event, context) => {
  const dev = false;
  const app = next({ dev, dir: './' });
  const handle = app.getRequestHandler();

  await app.prepare();

  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      // 设置请求路径为 /api/data
      const parsedUrl = parse('/api/data', true);
      
      // 设置请求方法和数据
      req.method = event.httpMethod || 'GET';
      req.url = '/api/data';
      
      // 处理请求体
      if (event.body) {
        req.body = JSON.parse(event.body);
      }
      
      // 设置请求头
      req.headers = event.headers || {};
      
      // 处理响应
      const originalEnd = res.end;
      res.end = function(chunk, encoding) {
        resolve({
          statusCode: res.statusCode,
          headers: res.getHeaders(),
          body: chunk ? chunk.toString() : ''
        });
      };
      
      handle(req, res, parsedUrl);
    });

    // 模拟请求
    server.emit('request', {
      method: event.httpMethod || 'GET',
      url: '/api/data',
      headers: event.headers || {},
      body: event.body
    }, {
      statusCode: 200,
      setHeader: () => {},
      getHeaders: () => ({}),
      end: (data) => {
        resolve({
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: data
        });
      }
    });
  });
}; 