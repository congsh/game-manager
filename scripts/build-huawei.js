const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

async function buildForHuawei() {
  console.log('📦 构建华为云函数包...');
  
  try {
    // 确保dist目录存在
    const distDir = path.join(__dirname, '../dist');
    await fs.ensureDir(distDir);
    
    // 创建临时目录
    const tempDir = path.join(__dirname, '../temp-huawei');
    await fs.ensureDir(tempDir);
    
    // 创建函数适配器代码
    const functionCode = `
const fs = require('fs');
const path = require('path');

// 数据文件路径 - 使用 /tmp 目录（华为云函数计算的临时存储）
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
  console.log('💾 数据已保存');
}

/**
 * 处理CORS响应
 */
function createResponse(statusCode, body, additionalHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Requested-With',
      'Content-Type': 'application/json',
      ...additionalHeaders
    },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  };
}

/**
 * 华为云函数计算入口函数
 * @param {Object} event - 事件对象
 * @param {Object} context - 上下文对象
 */
exports.handler = async (event, context) => {
  console.log('📨 收到请求:', JSON.stringify(event, null, 2));
  
  const { httpMethod, path: reqPath, queryStringParameters, body, headers } = event;
  
  // 处理 OPTIONS 预检请求
  if (httpMethod === 'OPTIONS') {
    console.log('🔄 处理 OPTIONS 预检请求');
    return createResponse(200, '');
  }

  try {
    let result;
    
    // 路由处理
    if (reqPath === '/api/data') {
      if (httpMethod === 'GET') {
        console.log('📖 获取全部数据');
        result = readData();
      } else if (httpMethod === 'POST') {
        console.log('💾 保存数据');
        const newData = JSON.parse(body || '{}');
        writeData(newData);
        result = { success: true, message: '数据保存成功' };
      }
    } 
    else if (reqPath.startsWith('/api/users')) {
      const data = readData();
      const pathParts = reqPath.split('/');
      const userName = pathParts[3]; // /api/users/{name}
      
      if (httpMethod === 'GET') {
                 if (userName) {
           console.log('👤 获取用户: ' + userName);
           result = data.users.find(u => u.name === userName) || null;
         } else {
           console.log('👥 获取所有用户');
           result = data.users || [];
         }
       } else if (httpMethod === 'POST') {
         const userData = JSON.parse(body || '{}');
         
         if (userName) {
           console.log('✏️ 更新用户: ' + userName);
           const userIndex = data.users.findIndex(u => u.name === userName);
          if (userIndex >= 0) {
            data.users[userIndex] = { ...data.users[userIndex], ...userData };
          } else {
            data.users.push({ name: userName, ...userData });
          }
        } else {
          console.log('➕ 添加新用户');
          data.users = data.users || [];
          data.users.push(userData);
        }
        
        writeData(data);
        result = { success: true, message: '用户数据保存成功' };
      }
    }
         else {
       console.log('❓ 未知路径: ' + reqPath);
       return createResponse(404, { error: '路径不存在', path: reqPath });
     }

    console.log('✅ 请求处理成功');
    return createResponse(200, result);
    
  } catch (error) {
    console.error('❌ 请求处理失败:', error);
    return createResponse(500, { 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
`;
    
    // 写入函数代码
    await fs.writeFile(path.join(tempDir, 'index.js'), functionCode);
    
    // 创建 package.json
    const packageJson = {
      name: 'game-manager-api',
      version: '1.0.0',
      description: '游戏管理系统API - 华为云函数计算版本',
      main: 'index.js',
      runtime: 'nodejs18.2',
      dependencies: {}
    };
    
    await fs.writeJSON(path.join(tempDir, 'package.json'), packageJson, { spaces: 2 });
    
    // 创建 ZIP 包
    console.log('📦 打包函数代码...');
    const output = fs.createWriteStream(path.join(distDir, 'huawei-function.zip'));
    const archive = archiver('zip', { zlib: { level: 9 } });
    
         output.on('close', function() {
       console.log('✅ 函数包创建成功: ' + archive.pointer() + ' bytes');
       console.log('📁 文件路径: dist/huawei-function.zip');
     });
    
    archive.on('error', function(err) {
      throw err;
    });
    
    archive.pipe(output);
    archive.directory(tempDir, false);
    await archive.finalize();
    
    // 清理临时目录
    await fs.remove(tempDir);
    
    console.log('🎉 华为云函数包构建完成！');
    console.log('');
    console.log('📋 下一步操作：');
    console.log('1. 登录华为云控制台');
    console.log('2. 进入函数计算服务 (FunctionGraph)');
    console.log('3. 创建新函数，上传 dist/huawei-function.zip');
    console.log('4. 配置函数触发器 (HTTP触发器)');
    console.log('5. 获取函数访问URL并更新前端配置');
    
  } catch (error) {
    console.error('❌ 构建失败:', error);
    throw error;
  }
}

// 执行构建
if (require.main === module) {
  buildForHuawei().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = buildForHuawei; 