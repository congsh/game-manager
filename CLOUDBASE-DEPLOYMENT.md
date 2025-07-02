# 腾讯云 CloudBase 部署指南

## 🎯 部署方案

将游戏管理系统完全迁移到腾讯云 CloudBase，享受国内优质的访问体验：

```
┌─────────────────┐    ┌──────────────────┐
│   国内用户       │────│ CloudBase        │  
│                 │    │ 前端 + API       │  (国内高速访问)
└─────────────────┘    └──────────────────┘
```

## 📋 部署前准备

### 1. 注册腾讯云账号
1. 访问 [腾讯云官网](https://cloud.tencent.com/)
2. 注册并完成实名认证
3. 开通云开发 CloudBase 服务

### 2. 创建云开发环境
1. 登录 [云开发控制台](https://console.cloud.tencent.com/tcb)
2. 点击"新建环境"
3. 选择"按量计费"（有免费额度）
4. 记录环境ID（如：`game-manager-xxx`）

## 🚀 部署步骤

### 步骤 1：登录 CloudBase
```bash
# 登录云开发
cloudbase login
```

### 步骤 2：配置环境变量
创建 `.env` 文件：
```bash
# 云开发环境ID
ENV_ID=your-env-id-here
# API基础地址
NEXT_PUBLIC_API_URL=https://your-env-id.service.tcloudbase.com
```

### 步骤 3：初始化项目
```bash
# 初始化云开发项目
cloudbase init --without-template
```

### 步骤 4：部署到 CloudBase
```bash
# 构建项目
npm run cloudbase:build

# 部署到云开发
npm run cloudbase:deploy
```

## ⚙️ 配置说明

### cloudbaserc.json 配置
```json
{
  "envId": "{{env.ENV_ID}}",
  "version": "2.0",
  "framework": {
    "name": "game-manager",
    "plugins": {
      "client": {
        "use": "@cloudbase/framework-plugin-website",
        "inputs": {
          "buildCommand": "npm run build",
          "outputPath": "out",
          "cloudPath": "/",
          "envVariables": {
            "NEXT_PUBLIC_API_URL": "{{env.NEXT_PUBLIC_API_URL}}"
          }
        }
      },
      "server": {
        "use": "@cloudbase/framework-plugin-function",
        "inputs": {
          "functionRootPath": "./",
          "functions": [
            {
              "name": "api-data",
              "config": {
                "timeout": 10,
                "runtime": "Nodejs18.15",
                "memorySize": 256
              }
            }
          ]
        }
      }
    }
  }
}
```

## 🌐 访问地址

部署成功后，您将获得：

### 前端访问地址
```
https://your-env-id.tcloudbaseapp.com
```

### API 访问地址
```
https://your-env-id.service.tcloudbase.com/api/data
https://your-env-id.service.tcloudbase.com/api/users
```

## 💰 费用说明

### 免费额度（每月）
- **静态网站托管**: 1GB 存储 + 5GB 流量
- **云函数**: 40万GBs资源使用量 + 100万次调用
- **数据库**: 2GB 存储 + 5万次读写
- **文件存储**: 5GB 存储 + 10GB CDN流量

### 超出费用
- **静态托管**: ¥0.0043/GB/天（存储）+ ¥0.18/GB（流量）
- **云函数**: ¥0.0133/万次调用 + ¥0.00003367/GBs
- **数据库**: ¥0.07/GB/天

对于20-30人的群组，免费额度完全够用！

## 🔧 本地开发

```bash
# 启动本地开发服务器
npm run dev

# 启动 CloudBase 本地调试
npm run cloudbase:dev
```

## 📊 性能优势

| 指标 | CloudBase | Vercel |
|------|-----------|--------|
| 国内访问速度 | 100-300ms | 1000-5000ms |
| 稳定性 | 99.9% | 不稳定 |
| API响应时间 | 50-200ms | 500-2000ms |
| 被墙风险 | 无 | 高 |

## 🛠️ 故障排除

### 常见问题

1. **部署失败**
   ```bash
   # 检查环境ID是否正确
   cloudbase env list
   
   # 重新登录
   cloudbase logout
   cloudbase login
   ```

2. **API 404错误**
   ```bash
   # 检查函数是否部署成功
   cloudbase functions list
   
   # 查看函数日志
   cloudbase functions log api-data
   ```

3. **环境变量问题**
   ```bash
   # 检查环境变量配置
   cat .env
   
   # 重新设置环境变量
   cloudbase env set ENV_ID your-env-id
   ```

## 🎉 部署完成检查清单

- [ ] CloudBase 环境创建成功
- [ ] 静态网站部署成功
- [ ] API 函数部署成功
- [ ] 前端可以正常访问
- [ ] API 接口响应正常
- [ ] 用户登录功能正常
- [ ] 数据持久化功能正常
- [ ] 国内访问速度提升明显

## 🔄 数据迁移

如果需要从 Vercel 迁移数据：

1. **导出 Vercel 数据**：
   ```bash
   # 从 Vercel API 导出数据
   curl https://game-manager-api.vercel.app/api/data > data-backup.json
   ```

2. **导入到 CloudBase**：
   ```bash
   # 通过 CloudBase API 导入数据
   curl -X POST https://your-env-id.service.tcloudbase.com/api/data \
        -H "Content-Type: application/json" \
        -d @data-backup.json
   ```

部署成功后，您的游戏管理系统将享受国内优质的访问体验！🚀 