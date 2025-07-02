#!/usr/bin/env node

/**
 * API 端点测试脚本
 * 用于验证 Vercel 部署的 API 是否正常工作
 */

const https = require('https');
const http = require('http');

// 配置
const API_BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : process.env.API_URL || 'http://localhost:3000';

console.log('🚀 开始测试 API 端点...');
console.log(`📍 API 基础地址: ${API_BASE_URL}`);

// 测试端点列表
const endpoints = [
  { method: 'GET', path: '/api/data', description: '获取所有数据' },
  { method: 'GET', path: '/api/users', description: '获取用户列表' },
];

/**
 * 发送 HTTP 请求
 */
function makeRequest(method, url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Test-Script/1.0'
      }
    };

    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.end();
  });
}

/**
 * 测试单个端点
 */
async function testEndpoint(endpoint) {
  const url = `${API_BASE_URL}${endpoint.path}`;
  
  try {
    console.log(`\n🔍 测试: ${endpoint.method} ${endpoint.path}`);
    console.log(`   描述: ${endpoint.description}`);
    
    const response = await makeRequest(endpoint.method, url);
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log(`   ✅ 成功 (${response.statusCode})`);
      
      // 尝试解析 JSON 响应
      try {
        const jsonData = JSON.parse(response.body);
        console.log(`   📊 响应数据类型: ${typeof jsonData}`);
        if (Array.isArray(jsonData)) {
          console.log(`   📝 数组长度: ${jsonData.length}`);
        } else if (typeof jsonData === 'object') {
          console.log(`   🔑 对象键: ${Object.keys(jsonData).join(', ')}`);
        }
      } catch (e) {
        console.log(`   📄 响应长度: ${response.body.length} 字符`);
      }
    } else {
      console.log(`   ❌ 失败 (${response.statusCode})`);
      console.log(`   💬 响应: ${response.body.substring(0, 200)}`);
    }
    
    return response.statusCode >= 200 && response.statusCode < 300;
  } catch (error) {
    console.log(`   💥 错误: ${error.message}`);
    return false;
  }
}

/**
 * 主测试函数
 */
async function runTests() {
  let successCount = 0;
  let totalCount = endpoints.length;
  
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint);
    if (success) successCount++;
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 测试结果: ${successCount}/${totalCount} 通过`);
  
  if (successCount === totalCount) {
    console.log('🎉 所有 API 端点测试通过！');
    process.exit(0);
  } else {
    console.log('⚠️  部分 API 端点测试失败');
    process.exit(1);
  }
}

// 运行测试
runTests().catch((error) => {
  console.error('💥 测试运行失败:', error);
  process.exit(1);
}); 