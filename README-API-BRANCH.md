# API 分支部署指南

这是 `api-only` 分支，专门用于将 API 服务部署到 Vercel。

## 🎯 分支目的

此分支配置为仅部署 API 路由到 Vercel，与主分支配合实现混合部署：
- **主分支**: 前端静态文件 → EdgeOne Pages
- **API分支**: API服务 → Vercel

## 📋 部署步骤

### 1. 连接到 Vercel

1. 访问 [Vercel 控制台](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 选择你的 GitHub 仓库
4. **重要**: 选择 `api-only` 分支进行部署

### 2. 配置 Vercel 项目

```yaml
项目名称: game-manager-api
分支: api-only
根目录: /
构建命令: npm run vercel:build
输出目录: .next
Node.js 版本: 18.x
```

### 3. 环境变量设置

无需特殊环境变量，API 使用文件系统存储。

### 4. 部署验证

部署完成后，Vercel 会提供一个域名，如：
```
https://game-manager-api.vercel.app
```

使用以下命令测试 API：
```bash
npm run vercel:api-test
```

## 🔧 API 端点

部署后可用的 API 端点：

```
GET  /api/data           # 获取所有数据
POST /api/data           # 保存所有数据
GET  /api/users          # 获取用户列表
POST /api/users          # 创建/更新用户
GET  /api/users/[name]   # 根据用户名获取用户
```

## 🌐 CORS 配置

已在 `vercel.json` 中配置了 CORS 头，允许：
- 所有来源访问 (`Access-Control-Allow-Origin: *`)
- 常用 HTTP 方法
- 标准请求头

## 📊 与前端集成

部署成功后：

1. **复制 API 域名**：如 `https://game-manager-api.vercel.app`
2. **在主分支配置环境变量**：
   ```bash
   NEXT_PUBLIC_API_URL=https://game-manager-api.vercel.app
   ```
3. **重新部署前端**到 EdgeOne Pages

## 🔄 自动部署

Vercel 会监听 `api-only` 分支的变化：
- Push 到此分支会自动触发重新部署
- 支持预览部署和生产部署

## 🛠️ 本地测试

在 API 分支本地测试：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 测试 API 端点
npm run vercel:api-test
```

## 📈 监控和日志

Vercel 提供：
- 实时部署日志
- 函数执行日志
- 性能监控
- 错误追踪

## 🚨 注意事项

1. **数据持久化**: 使用文件系统，数据在函数重启时会保持
2. **并发限制**: Vercel 免费版有并发函数限制
3. **超时设置**: API 函数最大执行时间为 10 秒
4. **文件大小**: 数据文件不应超过 4.5MB

## 🎉 部署成功标志

- ✅ Vercel 部署状态显示 "Ready"
- ✅ API 测试脚本全部通过
- ✅ 可以通过浏览器访问 `/api/data`
- ✅ 前端可以正常调用 API

部署完成后，记得更新主分支的 API 配置并重新部署前端！ 