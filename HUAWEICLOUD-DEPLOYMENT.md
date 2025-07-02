# 华为云部署指南

## 🚨 重要说明
由于 **腾讯云 CloudBase 已取消免费套餐**，推荐迁移到华为云函数计算。

## 🏗️ 部署架构
- **前端**: EdgeOne Pages (静态网站托管)
- **后端**: 华为云函数计算 FunctionGraph (API服务)

## 💰 免费额度说明
**华为云新用户可享受12个月免费试用，包含：**
- 🔥 **函数计算**: 每月100万次调用，40万GB·秒免费
- 💾 **对象存储**: 100GB存储空间，12个月免费  
- 🚀 **CDN**: 500GB流量包免费

**相比 Vercel 的优势**:
- 🚀 **访问速度**: 50-200ms (vs Vercel 1000-5000ms)
- 🛡️ **稳定性**: 99.9%可用性，无被墙风险
- 💰 **成本**: 免费试用期充足使用
- 👥 **适合**: 20-30人的小团队

## 🚀 快速部署

### 步骤 1: 注册华为云
1. 访问 [华为云官网](https://www.huaweicloud.com/)
2. 注册新账号（享12个月免费试用）
3. 完成实名认证
4. 开通 **函数计算 FunctionGraph** 服务

### 步骤 2: 构建函数包
```bash
# 安装依赖
npm install

# 构建华为云函数包
npm run huawei:build
```
执行完成后，会在 `dist/` 目录生成 `huawei-function.zip`

### 步骤 3: 创建函数
1. 登录华为云控制台，进入 **函数计算 FunctionGraph**
2. 点击 **创建函数**
3. 配置参数：
   ```
   函数名称: game-manager-api
   运行时: Node.js 18.x
   入口函数: index.handler
   内存: 128MB
   超时时间: 30秒
   ```
4. 上传代码包：选择 `dist/huawei-function.zip`

### 步骤 4: 配置API网关触发器
1. 在函数详情页，点击 **触发器** 标签
2. 创建 **API网关触发器**：
   ```
   触发器类型: API网关服务 (APIG)
   API名称: API_game_manager_api
   分组: 选择或创建新分组
   发布环境: RELEASE
   安全认证: App (或根据需要选择)
   请求协议: HTTPS
   请求方法: GET (创建后可添加其他方法)
   后端超时: 5000ms
   ```

3. **重要：配置多个HTTP方法**
   - 创建完成后，需要为API添加多个方法支持
   - 在API网关控制台中，为同一个API路径添加：
     - GET 方法
     - POST 方法  
     - OPTIONS 方法 (用于CORS预检)

4. 获取API访问URL，格式如：
   ```
   https://xxxxxxxx.apig.cn-north-4.huaweicloudapis.com/api
   ```

### 步骤 5: 更新前端配置
1. 复制环境变量文件：
   ```bash
   cp env.huawei.example .env.local
   ```

2. 编辑 `.env.local`，设置华为云函数URL：
   ```env
   NEXT_PUBLIC_HUAWEI_API_URL=https://your-function-url.functiongraph.cn-north-4.huaweicloud.com
   ```

### 步骤 6: 测试API
```bash
# 本地测试
npm run dev

# 访问 http://localhost:3000 检查API连接
```

## 🔧 可用命令

```bash
# 构建华为云函数包
npm run huawei:build

# 本地开发（使用华为云API）
npm run dev

# 构建生产版本
npm run build
```

## 📊 成本估算

| 使用场景 | 调用次数/月 | 费用 |
|---------|------------|------|
| 20人小团队 | ~50,000 | 免费 |
| 50人团队 | ~200,000 | 免费 |
| 100人团队 | ~500,000 | 免费 |

## ⚠️ 注意事项

1. **数据持久化**: 当前使用 `/tmp` 目录，函数重启会丢失数据
2. **冷启动**: 首次访问可能有1-2秒延迟
3. **监控**: 可在华为云控制台查看调用统计和日志
4. **备份**: 建议定期备份 `app-data.json` 文件

## 🎯 升级方案

如需更稳定的数据存储，可升级为：
- **华为云 RDS** (关系型数据库)
- **华为云 NoSQL** (文档数据库)
- **华为云 OBS** (对象存储)

## 📞 支持

- [华为云文档](https://support.huaweicloud.com/functiongraph/)
- [函数计算最佳实践](https://support.huaweicloud.com/bestpractice-functiongraph/)

---

✅ **部署完成后，您的游戏管理系统将拥有稳定、快速的国内访问体验！** 