# 混合部署方案指南

## 🎯 方案概述

由于 EdgeOne Pages 主要支持静态网站，而我们的游戏管理系统需要 API 功能，我们采用混合部署方案：

```
┌─────────────────┐    ┌──────────────────┐
│   国内用户       │────│ EdgeOne Pages    │  (前端 - 国内加速)
│                 │    │ 静态网站          │
└─────────────────┘    └──────────────────┘
                                ↕ API 调用
                       ┌──────────────────┐
                       │ Vercel           │  (API - 全球服务)
                       │ API 路由         │
                       └──────────────────┘
```

## 🚀 部署步骤

### 步骤 1：部署 API 服务到 Vercel

1. **创建新的 Vercel 项目**（仅用于 API）
   ```bash
   # 在 Vercel 控制台创建项目
   # 项目名称：game-manager-api
   ```

2. **配置 API 专用分支**
   ```bash
   git checkout -b api-only
   # 这个分支将专门用于 Vercel API 部署
   ```

3. **获取 API 域名**
   ```
   Vercel 会提供类似：
   https://game-manager-api.vercel.app
   ```

### 步骤 2：配置前端连接 API

1. **设置环境变量**
   ```bash
   # 在 EdgeOne Pages 环境变量中设置
   NEXT_PUBLIC_API_URL=https://game-manager-api.vercel.app
   ```

2. **更新 API 配置**
   ```javascript
   // config/api.ts 中已经配置好
   PRODUCTION_API_URL: process.env.NEXT_PUBLIC_API_URL
   ```

### 步骤 3：部署前端到 EdgeOne Pages

1. **使用静态构建**
   ```bash
   npm run edgeone:build
   ```

2. **在 EdgeOne Pages 配置**
   ```yaml
   构建命令: npm run edgeone:build
   输出目录: out
   环境变量: 
     NEXT_PUBLIC_API_URL: https://game-manager-api.vercel.app
   ```

## ⚙️ 技术细节

### CORS 配置
项目已包含 `middleware.ts` 处理跨域请求：
- 允许 EdgeOne Pages 访问 Vercel API
- 自动处理 OPTIONS 预检请求

### 数据流程
```
1. 用户访问 EdgeOne Pages (快速加载)
2. 前端调用 Vercel API (数据操作)
3. API 返回数据到前端
4. 前端更新界面
```

## 🔧 本地测试

```bash
# 测试混合模式
npm run dev

# 测试静态导出
npm run edgeone:build
cd out && npx serve .
```

## 💡 优化建议

1. **CDN 加速**：EdgeOne Pages 自带国内 CDN
2. **缓存策略**：API 响应添加适当缓存头
3. **错误处理**：网络错误时的友好提示
4. **监控告警**：监控 API 服务状态

## 📊 性能预期

| 指标 | EdgeOne + Vercel | 纯 Vercel |
|------|------------------|-----------|
| 国内首屏加载 | 500ms | 2000ms |
| API 响应时间 | 500ms | 500ms |
| 稳定性 | 高 | 中等 |

## 🎉 部署完成检查清单

- [ ] Vercel API 部署成功
- [ ] EdgeOne Pages 前端部署成功  
- [ ] API 跨域访问正常
- [ ] 用户登录功能正常
- [ ] 数据持久化功能正常
- [ ] 国内访问速度提升明显

这样你就能获得两者的优势：**国内访问快速** + **完整的功能支持**！🚀 