# 游戏组队管理系统 - 部署方案

## 免费国内方案 ⭐ 推荐

### 1. 腾讯云 EdgeOne Pages (首推)
**完全免费，公测期间无限制**

优势：
- ✅ 支持 Next.js 全栈部署
- ✅ 支持 Edge Functions（API）
- ✅ 无需绑定信用卡
- ✅ 无并发构建限制
- ✅ 自动 HTTPS 和 CDN
- ✅ GitHub 自动部署
- ✅ 国内访问速度优秀

部署步骤：
1. 访问 [EdgeOne Pages](https://edgeone.ai/products/pages)
2. 使用微信/GitHub 登录
3. 连接 GitHub 仓库
4. 选择 Next.js 模板
5. 自动构建部署

配置示例：
```yaml
# edgeone.config.js
module.exports = {
  build: {
    command: 'npm run build',
    output: '.next'
  },
  functions: {
    'api/**': {
      runtime: 'nodejs18'
    }
  }
}
```

### 2. 腾讯云开发 CloudBase
**有免费额度，适合全栈应用**

免费额度：
- 存储：5GB
- 云函数：10万次/月
- 数据库：1GB

部署方式：
```bash
# 安装 CloudBase CLI
npm install -g @cloudbase/cli

# 登录
cloudbase login

# 部署
cloudbase deploy
```

### 3. 阿里云函数计算
**有免费额度：100万次调用/月**

部署配置：
```yaml
# serverless.yml
edition: 1.0.0
name: game-manager
access: default

services:
  game-manager:
    component: fc
    props:
      region: cn-hangzhou
      service:
        name: game-manager
        description: 游戏组队管理系统
      function:
        name: index
        description: Next.js 应用
        codeUri: ./
        handler: index.handler
        runtime: nodejs16
        memorySize: 512
        timeout: 30
```

## 国外免费方案

### Vercel (国外访问)
```bash
# 部署到 Vercel
npm install -g vercel
vercel --prod
```

### Cloudflare Pages (国外访问)
```bash
# 使用 Wrangler CLI
npm install -g wrangler
wrangler pages project create game-manager
wrangler pages publish dist
```

### Netlify (国外访问)
```bash
# 使用 Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## ⚠️ 避免的收费方案

- ~~21YunBox~~ - 不再免费
- ~~Railway~~ - 限制较多
- ~~Render~~ - 免费版本限制严格

## 💡 推荐部署策略

### 方案A：单一平台 (推荐)
**EdgeOne Pages** - 前端 + API 一体化部署

### 方案B：混合部署
- 前端：EdgeOne Pages
- API：腾讯云开发 CloudBase
- 数据：本地 JSON + 定期备份

### 方案C：完全本地化
- 静态页面：EdgeOne Pages
- 数据存储：浏览器 localStorage
- 数据备份：GitHub Issues/Gist

## 🔧 部署检查清单

- [ ] 环境变量配置
- [ ] 构建命令正确
- [ ] API 路由测试
- [ ] 自定义域名 (可选)
- [ ] SSL 证书自动配置
- [ ] CDN 缓存设置
- [ ] 监控和日志配置

## 📊 方案对比

| 平台 | 费用 | Next.js支持 | API支持 | 国内访问 | 推荐度 |
|------|------|-------------|---------|----------|---------|
| EdgeOne Pages | 免费 | ✅ | ✅ | 优秀 | ⭐⭐⭐⭐⭐ |
| CloudBase | 免费额度 | ✅ | ✅ | 优秀 | ⭐⭐⭐⭐ |
| 阿里云FC | 免费额度 | ✅ | ✅ | 优秀 | ⭐⭐⭐⭐ |
| Vercel | 免费额度 | ✅ | ✅ | 较差 | ⭐⭐⭐ |

## 🎯 最终建议

基于你的需求（20-30人群组，约10人填写），推荐使用 **EdgeOne Pages**：

1. 完全免费，无隐藏费用
2. 国内访问速度快
3. 支持全栈 Next.js 应用
4. 部署过程简单
5. 自动 HTTPS 和 CDN

如果需要更复杂的后端功能，可以考虑 EdgeOne + CloudBase 的组合方案。 