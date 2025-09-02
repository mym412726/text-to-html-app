# GitHub Pages 部署指南

本文档将指导您如何将文本转HTML应用部署到GitHub Pages。

## 📋 部署前准备

### 1. 创建GitHub仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 仓库名称建议使用：`TS-Tailwindcss`（与vite.config.ts中的base路径保持一致）
4. 设置为 Public 仓库（GitHub Pages免费版需要公开仓库）
5. 不要初始化README、.gitignore或license（因为本地已有）

### 2. 配置API密钥

#### 本地开发环境
1. 复制 `.env.example` 文件为 `.env.local`
2. 在 `.env.local` 中填入您的DeepSeek API密钥：
   ```
   VITE_DEEPSEEK_API_KEY=sk-your-actual-api-key-here
   ```
3. 从 [DeepSeek平台](https://platform.deepseek.com) 获取API密钥

#### GitHub Actions环境
1. 进入您的GitHub仓库
2. 点击 "Settings" 选项卡
3. 在左侧菜单中选择 "Secrets and variables" > "Actions"
4. 点击 "New repository secret"
5. 添加以下密钥：
   - Name: `DEEPSEEK_API_KEY`
   - Secret: 您的实际DeepSeek API密钥

## 🚀 部署步骤

### 步骤1：推送代码到GitHub

```bash
# 初始化Git仓库（如果还没有）
git init

# 添加远程仓库（替换为您的仓库URL）
git remote add origin https://github.com/YOUR_USERNAME/TS-Tailwindcss.git

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: Text to HTML application"

# 推送到main分支
git push -u origin main
```

### 步骤2：启用GitHub Pages

1. 进入您的GitHub仓库
2. 点击 "Settings" 选项卡
3. 在左侧菜单中找到 "Pages"
4. 在 "Source" 部分选择 "GitHub Actions"
5. 保存设置

### 步骤3：触发自动部署

推送代码到main分支后，GitHub Actions会自动：
1. 安装依赖
2. 构建项目
3. 部署到GitHub Pages

您可以在仓库的 "Actions" 选项卡中查看部署进度。

### 步骤4：访问部署的应用

部署完成后，您的应用将在以下地址可用：
```
https://YOUR_USERNAME.github.io/TS-Tailwindcss/
```

## 📁 项目结构说明

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions工作流
├── src/
│   ├── components/             # React组件
│   ├── pages/                  # 页面组件
│   ├── utils/
│   │   └── deepseekApi.ts      # DeepSeek API集成
│   └── ...
├── .env.example                # 环境变量示例
├── .gitignore                  # Git忽略文件
├── vite.config.ts              # Vite配置（包含GitHub Pages设置）
└── DEPLOY.md                   # 本部署指南
```

## 🔧 配置文件说明

### GitHub Actions工作流 (`.github/workflows/deploy.yml`)
- 自动触发：推送到main分支时
- 构建环境：Ubuntu最新版本，Node.js 18
- 部署目标：GitHub Pages
- 环境变量：自动注入DEEPSEEK_API_KEY

### Vite配置 (vite.config.ts)
- `base`: 生产环境使用 `/TS-Tailwindcss/`，开发环境使用 `/`
- `outDir`: 构建输出到 `dist` 目录
- 插件：React、TypeScript路径、Trae徽章

## 🛠️ 故障排除

### 部署失败
1. 检查GitHub Actions日志中的错误信息
2. 确认API密钥已正确设置在仓库Secrets中
3. 确认仓库名称与vite.config.ts中的base路径一致

### API功能不工作
1. 检查DeepSeek API密钥是否有效
2. 确认API密钥有足够的调用额度
3. 检查浏览器控制台的错误信息

### 页面404错误
1. 确认GitHub Pages已启用
2. 检查仓库是否为Public
3. 确认访问URL格式正确

## 📱 功能特性

部署后的应用包含以下功能：
- ✅ 文本转HTML（本地解析 + AI生成）
- ✅ DeepSeek AI集成
- ✅ 生成历史管理
- ✅ HTML编辑器
- ✅ 文件导出功能
- ✅ 响应式设计
- ✅ 现代化UI（橙色主题）

## 🔄 更新部署

要更新已部署的应用：
1. 修改代码
2. 提交并推送到main分支
3. GitHub Actions会自动重新部署

```bash
git add .
git commit -m "Update: 描述您的更改"
git push origin main
```

## 📞 支持

如果遇到问题：
1. 检查GitHub Actions日志
2. 查看浏览器控制台错误
3. 确认所有配置步骤已正确完成
4. 检查DeepSeek API服务状态

---

🎉 **恭喜！** 您的文本转HTML应用现在已成功部署到GitHub Pages！