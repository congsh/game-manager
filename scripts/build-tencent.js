const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

async function buildForTencent() {
  console.log('📦 构建腾讯云函数包...');
  
  try {
    // 确保dist目录存在
    const distDir = path.join(__dirname, '../dist');
    await fs.ensureDir(distDir);
    
    // 创建临时目录
    const tempDir = path.join(__dirname, '../temp-tencent');
    await fs.ensureDir(tempDir);
    
    // 创建腾讯云Web函数适配器代码
    const functionCode = `
const fs = require('fs');
const path = require('path');

// 数据文件路径 - 使用函数运行时的临时目录
const dataPath = '/tmp/app-data.json';

/**
 * 初始化数据文件
 */
function initData() {
  if (!fs.existsSync(dataPath)) {
    const defaultData = {
      users: [],
      games: [],
      reports: {},
      weekendPlans: []
    };
    fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2));
    console.log('📝 初始化数据文件');
  }
}

/**
 * 读取数据
 */
function readData() {
  initData();
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
}

/**
 * 写入数据
 */
function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

/**
 * 创建CORS响应
 */
function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    },
    body: JSON.stringify(body)
  };
}

/**
 * 腾讯云Web函数主入口
 * @param {Object} event - 腾讯云函数事件对象
 * @param {Object} context - 腾讯云函数上下文对象
 */
exports.main = async (event, context) => {
  console.log('🚀 腾讯云函数启动, event:', JSON.stringify(event));
  
  try {
    const { httpMethod, path: reqPath, body, queryString } = event;
    
    // 处理OPTIONS预检请求
    if (httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'CORS preflight' });
    }
    
    let result;
    
    // 路由处理
    if (reqPath === '/api/data' || reqPath === '/release/api/data') {
      const data = readData();
      
      if (httpMethod === 'GET') {
        console.log('📊 获取所有数据');
        result = data;
      } else if (httpMethod === 'POST') {
        const newData = JSON.parse(body || '{}');
        console.log('✏️ 更新数据:', Object.keys(newData));
        
        // 合并数据
        Object.assign(data, newData);
        writeData(data);
        result = { success: true, message: '数据更新成功' };
      } else {
        return createResponse(405, { error: '不支持的HTTP方法', method: httpMethod });
      }
    } 
    else if (reqPath.startsWith('/api/users') || reqPath.startsWith('/release/api/users')) {
      const data = readData();
      const pathParts = reqPath.split('/');
      const userName = pathParts[pathParts.length - 1];
      
      if (httpMethod === 'GET') {
        if (userName && userName !== 'users') {
          console.log('👤 获取用户: ' + userName);
          result = data.users.find(u => u.name === userName) || null;
        } else {
          console.log('👥 获取所有用户');
          result = data.users || [];
        }
      } else if (httpMethod === 'POST') {
        const userData = JSON.parse(body || '{}');
        
        if (userName && userName !== 'users') {
          console.log('✏️ 更新用户: ' + userName);
          const userIndex = data.users.findIndex(u => u.name === userName);
          if (userIndex >= 0) {
            data.users[userIndex] = { ...data.users[userIndex], ...userData };
          } else {
            data.users.push({ name: userName, ...userData });
          }
          writeData(data);
          result = { success: true, message: '用户数据更新成功' };
        } else {
          console.log('➕ 创建新用户');
          data.users.push(userData);
          writeData(data);
          result = { success: true, message: '用户创建成功' };
        }
      } else {
        return createResponse(405, { error: '不支持的HTTP方法', method: httpMethod });
      }
    } 
    else {
      console.log('❓ 未知路径: ' + reqPath);
      return createResponse(404, { error: '路径不存在', path: reqPath });
    }
    
    return createResponse(200, result);
    
  } catch (error) {
    console.error('❌ 函数执行错误:', error);
    return createResponse(500, { 
      error: '服务器内部错误', 
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
`;

    // 写入函数代码
    const functionPath = path.join(tempDir, 'index.js');
    await fs.writeFile(functionPath, functionCode);
    
    // 复制package.json (简化版)
    const packageJson = {
      "name": "game-manager-scf",
      "version": "1.0.0",
      "description": "游戏管理系统 - 腾讯云函数版本",
      "main": "index.js",
      "dependencies": {},
      "engines": {
        "node": ">=18.0.0"
      }
    };
    
    await fs.writeFile(
      path.join(tempDir, 'package.json'), 
      JSON.stringify(packageJson, null, 2)
    );
    
    // 创建部署包
    const output = fs.createWriteStream(path.join(distDir, 'tencent-scf.zip'));
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', function() {
      console.log('✅ 腾讯云函数包创建成功: ' + archive.pointer() + ' bytes');
      console.log('📁 文件路径: dist/tencent-scf.zip');
      
      // 清理临时目录
      fs.removeSync(tempDir);
      console.log('🧹 清理临时文件完成');
    });
    
    archive.on('error', function(err) {
      throw err;
    });
    
    archive.pipe(output);
    archive.directory(tempDir, false);
    archive.finalize();
    
  } catch (error) {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  buildForTencent();
}

module.exports = buildForTencent; 