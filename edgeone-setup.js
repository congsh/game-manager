#!/usr/bin/env node

/**
 * EdgeOne Pages Functions 设置助手
 * 帮助配置和部署项目到 EdgeOne Pages
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 EdgeOne Pages Functions 设置助手\n');

// 检查必要文件
const requiredFiles = [
  'edgeone.json',
  'functions/api/data.js',
  'functions/api/users/index.js',
  'functions/test.js'
];

console.log('📋 检查项目文件...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 缺失`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ 某些必要文件缺失，请检查项目结构。');
  process.exit(1);
}

console.log('\n✅ 所有必要文件已就绪！');

// 检查 package.json 脚本
console.log('\n📦 检查 package.json 脚本...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredScripts = ['dev', 'build', 'start'];
const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);

if (missingScripts.length > 0) {
  console.log(`❌ 缺少脚本: ${missingScripts.join(', ')}`);
} else {
  console.log('✅ 所有必要脚本已配置');
}

// 显示下一步操作
console.log('\n🎯 下一步操作：');
console.log('1. 安装EdgeOne CLI（如果尚未安装）：');
console.log('   npm install -g edgeone\n');

console.log('2. 登录EdgeOne账户：');
console.log('   edgeone login\n');

console.log('3. 创建EdgeOne项目（在控制台）：');
console.log('   - 访问：https://console.cloud.tencent.com/edgeone');
console.log('   - 创建新的Pages项目');
console.log('   - 连接Git仓库\n');

console.log('4. 配置KV存储：');
console.log('   - 在EdgeOne控制台创建KV命名空间：game-manager-kv');
console.log('   - 更新 edgeone.json 中的KV ID\n');

console.log('5. 本地测试：');
console.log('   npm run dev');
console.log('   测试API：http://localhost:3000/test\n');

console.log('6. 部署：');
console.log('   git add . && git commit -m "feat: 配置EdgeOne Pages Functions"');
console.log('   git push origin main\n');

console.log('📖 详细文档：./EDGEONE-PAGES-FUNCTIONS.md');
console.log('🎉 设置完成！开始使用EdgeOne Pages Functions吧！'); 