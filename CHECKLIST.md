# ✅ EdgeOne Pages Functions 部署检查清单

## 📋 部署前准备

### 🔧 项目配置
- [ ] 已安装 EdgeOne CLI：`npm install -g edgeone`
- [ ] 运行设置助手：`npm run setup`
- [ ] 所有必要文件存在：
  - [ ] `edgeone.json`
  - [ ] `functions/api/data.js`
  - [ ] `functions/api/users/index.js`
  - [ ] `functions/test.js`

### 🧪 本地测试
- [ ] 启动开发服务器：`npm run dev`
- [ ] 测试API接口：`npm run test:api`
- [ ] 手动访问测试：
  - [ ] http://localhost:3000 - 主页
  - [ ] http://localhost:3000/test - 测试函数
  - [ ] http://localhost:3000/api/data - 数据API

## 🌐 EdgeOne 控制台配置

### 📝 创建项目
- [ ] 登录 EdgeOne 控制台：https://console.cloud.tencent.com/edgeone
- [ ] 创建新 Pages 项目
- [ ] 连接 Git 仓库
- [ ] 配置构建设置：
  - [ ] 构建命令：`npm run build`
  - [ ] 输出目录：`out`
  - [ ] 安装命令：`npm install`

### 💾 KV 存储配置
- [ ] 创建 KV 命名空间：`game-manager-kv`
- [ ] 记录命名空间 ID
- [ ] 更新 `edgeone.json` 中的 KV 配置
- [ ] 生产环境 ID：`your-production-kv-id`
- [ ] 预览环境 ID：`your-preview-kv-id`

## 🚀 部署流程

### 📤 代码提交
- [ ] 提交所有更改：`git add .`
- [ ] 创建提交：`git commit -m "feat: 配置EdgeOne Pages Functions"`
- [ ] 推送到远程：`git push origin main`

### 🔍 部署验证
- [ ] EdgeOne 自动开始构建
- [ ] 构建成功完成
- [ ] 获得部署URL
- [ ] 测试部署的应用：
  - [ ] 主页面正常加载
  - [ ] Functions 正常工作：`/test`
  - [ ] API 正常响应：`/api/data`

## 🔧 配置检查

### edgeone.json 配置
```json
{
  "name": "game-manager",
  "description": "游戏管理系统",
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "functions": {
    "directory": "functions"
  },
  "kv": [
    {
      "binding": "GAME_MANAGER_KV",
      "preview_id": "填入预览环境KV ID",
      "id": "填入生产环境KV ID"
    }
  ]
}
```

### package.json 脚本检查
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "setup": "node edgeone-setup.js",
    "test:api": "node test-local-api.js"
  }
}
```

## 🆘 故障排除

### 常见问题检查
- [ ] 构建失败 → 检查 package.json 和依赖
- [ ] Functions 错误 → 查看控制台 Functions 日志
- [ ] KV 存储问题 → 确认 ID 配置正确
- [ ] 域名访问问题 → 检查域名配置和 DNS

### 调试工具
- [ ] EdgeOne 控制台构建日志
- [ ] EdgeOne Functions 执行日志
- [ ] 浏览器开发者工具
- [ ] 本地测试脚本：`npm run test:api`

## 🎯 部署成功指标

- ✅ 构建成功，无错误
- ✅ 主页面可以正常访问
- ✅ Functions 返回正确响应
- ✅ API 接口工作正常
- ✅ KV 存储可以读写数据
- ✅ 无 CORS 或网络错误

---

## 📞 获取帮助

如果遇到问题：
1. 查看 [部署指南](./DEPLOYMENT-GUIDE.md)
2. 运行 `npm run setup` 检查配置
3. 查看 EdgeOne 官方文档
4. 检查项目的 issues 或创建新 issue

🎉 **完成所有检查项目后，您的 EdgeOne Pages Functions 就部署成功了！** 