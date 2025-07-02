# 🚀 EdgeOne Pages Functions 部署指南

## 📋 部署前检查

运行设置助手确保所有配置正确：
```bash
npm run setup
```

## 🔧 EdgeOne 控制台配置

### 1. 登录 EdgeOne 控制台
访问：https://console.cloud.tencent.com/edgeone

### 2. 创建 Pages 项目
1. 点击「创建项目」
2. 选择「连接 Git 仓库」
3. 授权并选择您的项目仓库
4. 配置构建设置：
   - **构建命令**：`npm run build`
   - **输出目录**：`out`
   - **安装命令**：`npm install`

### 3. 配置 KV 存储
1. 在 EdgeOne 控制台，进入「KV 存储」
2. 创建新的 KV 命名空间：
   - **命名空间名称**：`game-manager-kv`
   - **描述**：游戏管理系统数据存储
3. 记录生成的命名空间 ID
4. 更新项目中的 `edgeone.json`：
   ```json
   {
     "kv": [
       {
         "binding": "GAME_MANAGER_KV",
         "preview_id": "your-preview-kv-id",
         "id": "your-production-kv-id"
       }
     ]
   }
   ```

### 4. 环境变量配置（可选）
如果需要自定义配置，可以在控制台设置环境变量：
- `NEXT_PUBLIC_APP_NAME`：应用名称
- `NEXT_PUBLIC_DEBUG`：调试模式

## 🧪 本地测试

### 1. 启动开发服务器
```bash
npm run dev
```

### 2. 测试 API 接口
```bash
npm run test:api
```

### 3. 手动测试
访问以下URL测试功能：
- http://localhost:3000/test - 测试函数
- http://localhost:3000/api/data - 数据API  
- http://localhost:3000/api/users - 用户API
- http://localhost:3000 - 主页面

## 📤 部署流程

### 1. 提交代码
```bash
git add .
git commit -m "feat: 配置EdgeOne Pages Functions"
git push origin main
```

### 2. 自动部署
EdgeOne 会自动检测到代码推送并开始构建部署：
1. 代码拉取
2. 安装依赖
3. 执行构建
4. 部署 Functions
5. 部署静态资源

### 3. 验证部署
部署完成后：
1. 访问分配的域名
2. 测试 Functions：`https://your-domain.edgeone.site/test`
3. 测试应用功能

## 🔍 调试和监控

### 查看构建日志
在 EdgeOne 控制台的「部署」页面查看详细日志

### 查看 Functions 日志
在「Functions」页面查看函数执行日志

### 性能监控
在「监控」页面查看访问统计和性能数据

## 🛠️ 常见问题

### Q: KV 存储数据丢失？
A: 检查 edgeone.json 中的 KV 配置是否正确

### Q: Functions 返回 500 错误？
A: 查看 Functions 日志，通常是代码语法错误

### Q: CORS 错误？
A: EdgeOne Pages Functions 使用同域部署，不应该有 CORS 问题

### Q: 构建失败？
A: 检查 package.json 中的构建脚本和依赖

## 📖 相关链接

- [EdgeOne Pages 官方文档](https://cloud.tencent.com/document/product/1552)
- [EdgeOne KV 存储文档](https://cloud.tencent.com/document/product/1552/84084)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)

---

🎉 **恭喜！您已成功配置 EdgeOne Pages Functions！** 