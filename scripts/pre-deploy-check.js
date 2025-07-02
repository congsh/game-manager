#!/usr/bin/env node

/**
 * EdgeOne Pages 预部署检查脚本
 * 确保项目可以在腾讯云 EdgeOne Pages 上正常部署
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 开始 EdgeOne Pages 预部署检查...\n');

// 检查项目
const checks = [
  {
    name: 'Node.js 版本',
    check: () => {
      const version = process.version;
      const major = parseInt(version.slice(1).split('.')[0]);
      if (major < 18) {
        throw new Error(`Node.js 版本过低 (${version})，EdgeOne Pages 需要 Node.js 18+`);
      }
      return `✅ ${version}`;
    }
  },
  
  {
    name: 'package.json 检查',
    check: () => {
      const packagePath = path.join(process.cwd(), 'package.json');
      if (!fs.existsSync(packagePath)) {
        throw new Error('package.json 不存在');
      }
      
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // 检查必要的脚本
      if (!pkg.scripts || !pkg.scripts.build) {
        throw new Error('缺少构建脚本 "build"');
      }
      
      return '✅ package.json 配置正确';
    }
  },
  
  {
    name: '依赖安装检查',
    check: () => {
      if (!fs.existsSync('node_modules')) {
        throw new Error('依赖未安装，请运行 npm install');
      }
      return '✅ 依赖已安装';
    }
  },
  
  {
    name: '构建测试',
    check: () => {
      try {
        console.log('   正在执行构建测试...');
        execSync('npm run build', { stdio: 'pipe' });
        
        // 检查构建输出
        if (!fs.existsSync('.next')) {
          throw new Error('构建输出目录 .next 不存在');
        }
        
        return '✅ 构建成功';
      } catch (error) {
        throw new Error(`构建失败: ${error.message}`);
      }
    }
  },
  
  {
    name: 'API 路由检查',
    check: () => {
      const apiPath = path.join(process.cwd(), 'app', 'api');
      if (!fs.existsSync(apiPath)) {
        return '⚠️  没有 API 路由';
      }
      
      // 检查 API 文件
      const apiFiles = [];
      function findApiFiles(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const fullPath = path.join(dir, file);
          if (fs.statSync(fullPath).isDirectory()) {
            findApiFiles(fullPath);
          } else if (file === 'route.ts' || file === 'route.js') {
            apiFiles.push(fullPath);
          }
        });
      }
      
      findApiFiles(apiPath);
      return `✅ 发现 ${apiFiles.length} 个 API 路由`;
    }
  },
  
  {
    name: 'EdgeOne 配置检查',
    check: () => {
      const configPath = path.join(process.cwd(), 'edgeone.config.js');
      if (fs.existsSync(configPath)) {
        return '✅ EdgeOne 配置文件存在';
      }
      return '⚠️  EdgeOne 配置文件不存在（可选）';
    }
  }
];

// 执行检查
let allPassed = true;

checks.forEach(({ name, check }) => {
  try {
    const result = check();
    console.log(`${name}: ${result}`);
  } catch (error) {
    console.log(`${name}: ❌ ${error.message}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 所有检查通过！项目已准备好部署到 EdgeOne Pages');
  console.log('\n📋 下一步：');
  console.log('1. 提交代码到 GitHub');
  console.log('2. 登录腾讯云控制台');
  console.log('3. 创建 EdgeOne Pages 站点');
  console.log('4. 连接 GitHub 仓库');
  console.log('5. 配置构建参数并部署');
} else {
  console.log('❌ 检查发现问题，请修复后重试');
  process.exit(1);
}

console.log('\n📖 详细部署指南: EdgeOne-deployment-guide.md'); 