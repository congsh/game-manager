# 腾讯云函数 SCF 部署指南

## 🚀 方案介绍
- **前端**: EdgeOne Pages (静态网站托管)
- **后端**: 腾讯云函数 SCF Web函数 (API服务)

## 💰 免费额度 (2025年确认)
- 🎯 **免费调用**: 每月100万次调用免费
- ⏱️ **免费时长**: 每月40万GB·秒免费
- 🌐 **访问速度**: 国内50-200ms
- 👥 **适合**: 20-30人团队完全免费使用

## 🌟 技术优势
- ✅ **Web函数支持**: 直接处理HTTP请求，无需API网关
- ✅ **零配置触发器**: 自动生成HTTP访问URL
- ✅ **完整CORS支持**: 内置跨域处理
- ✅ **多种部署方式**: 控制台上传、命令行、VS Code插件

## 🚀 快速部署

### 步骤 1: 注册腾讯云
1. 访问 [腾讯云官网](https://cloud.tencent.com/)
2. 注册新账号并完成实名认证
3. 开通 **云函数 SCF** 服务

### 步骤 2: 构建函数包
```bash
# 安装依赖
npm install

# 构建腾讯云函数包
npm run tencent:build
```

### 步骤 3: 创建Web函数
1. 登录腾讯云控制台，进入 **云函数 SCF**
2. 点击 **新建函数**
3. 选择 **Web函数**
4. 配置参数：
   ```
   函数名称: game-manager-api
   运行环境: Node.js 18.x
   函数类型: Web函数
   内存配置: 128MB (免费额度内)
   超时时间: 60秒
   ```

### 步骤 4: 上传代码
1. 选择 **本地上传zip包**
2. 上传构建好的 `dist/tencent-scf.zip`
3. 设置 **启动文件**: `index.main`

### 步骤 5: 配置环境变量
```
NODE_ENV=production
```

### 步骤 6: 获取访问URL
函数创建成功后，会自动生成访问URL，格式如：
```
https://service-xxxxxxxx-xxxxxxxxx.gz.apigw.tencentcs.com/release/
```

### 步骤 7: 更新前端配置
1. 复制 `env.tencent.example` 为 `.env.local`
2. 设置腾讯云函数URL：
```env
NEXT_PUBLIC_TENCENT_API_URL=https://service-xxxxxxxx-xxxxxxxxx.gz.apigw.tencentcs.com/release
```

## 🛠️ 进阶配置

### 自定义域名 (可选)
1. 在 **API网关控制台** 中绑定自定义域名
2. 配置SSL证书 (可申请免费证书)
3. 更新前端配置中的API地址

### 监控告警
1. 进入 **云监控控制台**
2. 配置函数调用量、错误率等监控指标
3. 设置告警通知 (短信/邮件)

### 日志查看
1. 在函数详情页查看 **运行日志**
2. 支持实时日志和历史日志查询
3. 可配置日志持久化到CLS (云日志服务)

## 🔧 本地开发

### 安装开发工具
```bash
# 安装腾讯云CLI
npm install -g @serverless/cli

# 安装VS Code插件
# 搜索 "Tencent Serverless"
```

### 本地调试
```bash
# 本地启动模拟环境
npm run tencent:dev

# 本地测试API
curl http://localhost:3000/api/data
```

## 📋 部署脚本
项目已包含完整的腾讯云部署脚本：
- `npm run tencent:build` - 构建函数包
- `npm run tencent:deploy` - 命令行部署 (需配置密钥)
- `npm run tencent:logs` - 查看函数日志

## 💡 最佳实践

### 性能优化
1. **函数复用**: 利用实例复用减少冷启动
2. **内存配置**: 根据实际使用调整内存大小
3. **并发控制**: 设置合理的并发上限

### 安全配置
1. **网络配置**: 可配置VPC私有网络
2. **访问控制**: 设置API密钥验证
3. **HTTPS强制**: 确保所有请求使用HTTPS

### 成本控制
1. **监控用量**: 定期查看调用次数和时长
2. **设置预算**: 配置用量告警避免超额
3. **清理资源**: 及时删除不用的函数版本

## 🆘 常见问题

### Q: 如何处理CORS跨域问题？
A: Web函数已内置CORS处理，如需自定义可在代码中配置响应头

### Q: 函数冷启动时间过长怎么办？  
A: 可考虑开启 **预置并发** 功能 (会产生少量费用)

### Q: 如何查看函数运行状态？
A: 在控制台的 **监控信息** 标签查看调用次数、成功率等指标

### Q: 免费额度用完后如何计费？
A: 超出免费额度后按实际使用量计费，价格透明且相对较低

## 📞 技术支持
- 📖 [官方文档](https://cloud.tencent.com/document/product/583)
- 💬 [开发者社区](https://cloud.tencent.com/developer)
- 🎯 [最佳实践](https://cloud.tencent.com/document/product/583/9199)

---

## 🎉 部署成功后
您的游戏管理系统API将运行在腾讯云函数上，享受：
- 🚀 毫秒级响应速度
- 🛡️ 99.9%服务可用性  
- 💰 完全免费的使用体验
- 🔒 企业级安全保障 