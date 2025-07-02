#!/usr/bin/env node

/**
 * 本地API测试脚本
 * 测试EdgeOne Pages Functions在本地是否正常工作
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// 测试API端点
const testEndpoints = [
  {
    name: '测试函数',
    path: '/test',
    method: 'GET'
  },
  {
    name: '获取数据',
    path: '/api/data',
    method: 'GET'
  },
  {
    name: '获取用户',
    path: '/api/users',
    method: 'GET'
  }
];

console.log('🧪 开始测试本地API...\n');

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint.path,
      method: endpoint.method
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const success = res.statusCode >= 200 && res.statusCode < 300;
        resolve({
          success,
          status: res.statusCode,
          data: data.substring(0, 200) // 只显示前200字符
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        success: false,
        error: err.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        success: false,
        error: '请求超时'
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🔗 测试服务器连接...');
  
  for (const endpoint of testEndpoints) {
    console.log(`\n📡 测试: ${endpoint.name} (${endpoint.method} ${endpoint.path})`);
    
    const result = await testEndpoint(endpoint);
    
    if (result.success) {
      console.log(`✅ 成功 (${result.status})`);
      if (result.data) {
        console.log(`📄 响应预览: ${result.data}${result.data.length >= 200 ? '...' : ''}`);
      }
    } else {
      console.log(`❌ 失败: ${result.error || `HTTP ${result.status}`}`);
    }
  }
  
  console.log('\n🎉 API测试完成！');
  console.log('\n💡 提示：');
  console.log('- 如果测试失败，请确保 npm run dev 正在运行');
  console.log('- 如果端口被占用，请检查3000端口是否可用');
  console.log('- 测试函数URL: http://localhost:3000/test');
}

// 等待3秒让开发服务器启动
setTimeout(runTests, 3000); 