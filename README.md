# 游戏管理系统

基于 Next.js + EdgeOne Pages Functions 构建的轻量级游戏管理系统。

## ✨ 特性

- 🎮 **游戏管理**：游戏信息录入和管理
- 👥 **用户管理**：成员信息管理
- 📅 **活动规划**：日常报名和周末计划
- 📊 **数据报表**：活动统计和成员报告

## 🚀 技术栈

- **前端**：Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **后端**：EdgeOne Pages Functions (Serverless)
- **存储**：EdgeOne KV Storage
- **部署**：EdgeOne Pages (一键部署)

## 📦 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 开发环境
```bash
npm run dev
```

### 3. 部署
```bash
npm run build
git push origin main  # EdgeOne 自动部署
```

## 📁 项目结构

```
├── app/                 # Next.js 页面
├── components/          # React 组件
├── functions/           # EdgeOne Pages Functions
│   └── api/            # API 路由
├── config/             # 配置文件
├── services/           # 数据服务
└── types/              # TypeScript 类型
```

## 📖 文档

- [EdgeOne Pages Functions 部署指南](./EDGEONE-PAGES-FUNCTIONS.md)
- [开发进度](./开发进度.md)

---

简单、高效、稳定的游戏管理解决方案 🎯
