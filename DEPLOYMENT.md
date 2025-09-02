# GitHub Pages 部署指南

本指南将详细指导您如何将文本转HTML应用部署到GitHub Pages。

## 前提条件

- 已注册GitHub账户
- 已安装Git（如果没有，请访问 https://git-scm.com/ 下载安装）
- 项目代码已准备就绪

## 步骤1：创建GitHub仓库

### 1.1 登录GitHub
1. 打开浏览器，访问 https://github.com
2. 使用您的账户登录

### 1.2 创建新仓库
1. 点击右上角的 "+" 按钮
2. 选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `text-to-html-app`（或您喜欢的名称）
   - **Description**: `文本转HTML应用 - 支持DeepSeek AI生成`
   - 选择 **Public**（GitHub Pages免费版需要公开仓库）
   - 不要勾选 "Add a README file"（我们已有项目文件）
4. 点击 "Create repository"

## 步骤2：上传代码到GitHub

### 2.1 初始化Git仓库（在项目目录中）
```bash
# 打开命令行，进入项目目录
cd "c:\Users\ZhiKe\Desktop\TS+Tailwindcss"

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: Text to HTML app with DeepSeek AI"
```

### 2.2 连接到GitHub仓库
```bash
# 添加远程仓库（替换YOUR_USERNAME为您的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/text-to-html-app.git

# 推送代码到GitHub
git branch -M main
git push -u origin main
```

## 步骤3：配置GitHub Pages

### 3.1 启用GitHub Pages
1. 在GitHub仓库页面，点击 "Settings" 标签
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分：
   - 选择 "Deploy from a branch"
   - Branch: 选择 "gh-pages"
   - Folder: 选择 "/ (root)"
4. 点击 "Save"

### 3.2 配置GitHub Actions
我们的项目已经包含了自动部署配置文件 `.github/workflows/deploy.yml`，它会：
- 自动构建项目
- 部署到gh-pages分支
- 每次推送代码时自动更新网站

## 步骤4：配置DeepSeek API密钥

### 4.1 获取DeepSeek API密钥
1. 访问 https://platform.deepseek.com/
2. 注册并登录账户
3. 获取您的API密钥

### 4.2 在GitHub中设置环境变量
1. 在GitHub仓库页面，点击 "Settings"
2. 在左侧菜单中找到 "Secrets and variables" > "Actions"
3. 点击 "New repository secret"
4. 添加以下密钥：
   - **Name**: `VITE_DEEPSEEK_API_KEY`
   - **Value**: 您的DeepSeek API密钥
5. 点击 "Add secret"

## 步骤5：触发部署

### 5.1 推送代码触发自动部署
```bash
# 如果您修改了代码，可以推送更新
git add .
git commit -m "Update: Configure for GitHub Pages"
git push
```

### 5.2 查看部署状态
1. 在GitHub仓库页面，点击 "Actions" 标签
2. 您会看到部署工作流正在运行
3. 等待绿色勾号表示部署成功

## 步骤6：访问您的网站

### 6.1 获取网站地址
1. 部署成功后，回到 "Settings" > "Pages"
2. 您会看到网站地址：`https://YOUR_USERNAME.github.io/text-to-html-app/`
3. 点击链接访问您的应用

### 6.2 功能验证
访问以下页面确认功能正常：
- 主页：`https://YOUR_USERNAME.github.io/text-to-html-app/`
- 文本转HTML：`https://YOUR_USERNAME.github.io/text-to-html-app/text-to-html`
- 生成历史：`https://YOUR_USERNAME.github.io/text-to-html-app/generated-pages`

## 常见问题解决

### Q1: 部署失败怎么办？
**A1**: 
1. 检查 "Actions" 标签中的错误信息
2. 确保所有文件都已正确推送到GitHub
3. 检查API密钥是否正确设置

### Q2: 网站显示404错误
**A2**: 
1. 确认GitHub Pages已正确配置
2. 等待几分钟，GitHub Pages需要时间生效
3. 检查仓库是否为Public

### Q3: DeepSeek AI功能不工作
**A3**: 
1. 确认API密钥已正确设置在GitHub Secrets中
2. 检查DeepSeek账户是否有足够的调用额度
3. 查看浏览器控制台是否有错误信息

### Q4: 如何更新网站？
**A4**: 
```bash
# 修改代码后
git add .
git commit -m "Update: 描述您的更改"
git push
# GitHub Actions会自动重新部署
```

### Q5: 如何自定义域名？
**A5**: 
1. 在 "Settings" > "Pages" 中的 "Custom domain" 输入您的域名
2. 在您的域名DNS设置中添加CNAME记录指向 `YOUR_USERNAME.github.io`

## 技术特性

✅ **自动化部署**: 推送代码即自动更新网站  
✅ **环境变量安全**: API密钥安全存储  
✅ **缓存优化**: 构建缓存提升部署速度  
✅ **错误处理**: 完善的错误提示和处理  
✅ **响应式设计**: 支持各种设备访问  
✅ **现代UI**: 橙色主题，现代化界面  
✅ **数据持久化**: 本地存储生成历史  

## 支持

如果您在部署过程中遇到问题，可以：
1. 查看GitHub Actions的详细日志
2. 检查浏览器开发者工具的控制台
3. 确认所有配置步骤都已正确完成

---

🎉 **恭喜！您的文本转HTML应用已成功部署到GitHub Pages！**

现在您可以在任何地方访问您的应用，享受AI驱动的文本转HTML功能。