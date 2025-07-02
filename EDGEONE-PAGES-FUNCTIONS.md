# EdgeOne Pages Functions 部署指南

## 🚀 快速开始

### 1. 安装 EdgeOne CLI
```bash
npm install -g edgeone
```

### 2. 配置 KV 存储
1. 登录 [EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
2. 创建 KV 命名空间：`game-manager-kv`
3. 更新 `edgeone.json` 中的 KV ID

### 3. 部署
```bash
# 推送代码到 Git 仓库
git push origin main

# EdgeOne 自动检测并部署
```

## 📁 项目结构

```
functions/
└── api/
    ├── data.js           # 主数据API: GET/POST /api/data
    └── users/
        ├── index.js      # 用户列表: GET/POST /api/users
        └── [name].js     # 单个用户: GET/POST /api/users/{name}
```

## 💾 数据存储

使用 EdgeOne KV 存储，数据结构：
```javascript
{
  "users": [],
  "games": [],
  "dailySignups": [],
  "weekendPlans": [],
  "gameGroups": [],
  "lastUpdated": "2025-01-02T10:00:00Z"
}
```

## ✅ 优势

- ✅ **无跨域问题**：同域API
- ✅ **低延迟**：边缘节点部署
- ✅ **自动扩容**：无需配置
- ✅ **简单部署**：Git 推送即部署 