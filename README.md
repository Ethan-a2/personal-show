# Markdown 简历展示

一个参考 CodeCV 简历样式制作的纯正文静态简历页。项目采用「Markdown 写内容、HTML/CSS 控制排版」的方式，方便日常编辑，也方便使用浏览器直接打印或导出 PDF。

当前主题为深灰色 + 深棕色：深灰负责正文阅读，深棕负责标题、分割线和重点信息，整体观感沉稳得体，同时保留一点温润和灵动。

## 文件结构

```text
.
├── index.html   # 页面入口，只保留简历正文容器
├── resume.md    # 简历内容源，推荐主要编辑这个文件
├── script.js    # 读取 Markdown、解析元信息并渲染为 HTML
├── styles.css   # 简历样式、响应式布局和打印样式
└── README.md    # 使用说明
```

## 快速开始

在当前目录启动一个静态服务：

```bash
python3 -m http.server 8000
```

然后用浏览器打开：

```text
http://localhost:8000
```

不要直接双击打开 `index.html`，因为浏览器通常会限制本地文件读取，导致 `resume.md` 无法通过 `fetch` 加载。

## GitHub Pages 发布

当前项目是纯静态站点，最简单的发布方式是使用 GitHub Pages 的「Deploy from a branch」。

推荐配置：

- 仓库：`Ethan-a2/personal-show`
- 分支：`main`
- 目录：`/root`
- 访问地址：`https://ethan-a2.github.io/personal-show/`

本仓库需要保留 `.nojekyll` 文件，避免 GitHub Pages 用 Jekyll 处理 `resume.md`，否则可能导致 Pages 构建失败。

如果还没有推送 `.nojekyll`，执行：

```bash
git add .nojekyll README.md
git commit -m "Configure GitHub Pages"
git push origin main
```

推送后进入 GitHub 仓库页面：

1. 打开 `Settings`。
2. 点击左侧 `Pages`。
3. 在 `Build and deployment` 中选择 `Deploy from a branch`。
4. `Branch` 选择 `main`，目录选择 `/root`。
5. 保存后等待 1-3 分钟。

也可以用 GitHub CLI 开启 Pages：

```bash
gh api repos/Ethan-a2/personal-show/pages \
  -X POST \
  -F 'source[branch]=main' \
  -F 'source[path]=/'
```

如果 Pages 已经开启，只需要推送文件并等待重新构建即可。

## 编辑简历

主要编辑 `resume.md`。文件顶部的 frontmatter 控制基础信息和主题变量：

```yaml
---
title: CodeCV简历 - 前端工程师
subtitle: 高级前端工程师
experience: 3年经验
age: 25岁
gender: 男
phone: 185****5387
email: coderleilei@163.com
github: https://github.com/acmenlei
blog: yueque.com/xiongleixin
accent: "#6F4E37"
text: "#3E3A36"
font: Nunito, Inter, "PingFang SC", "Microsoft YaHei", sans-serif
lineHeight: 22px
---
```

常用字段说明：

- `title`：简历顶部主标题。
- `subtitle`：头像占位和辅助标题信息。
- `experience`、`age`、`gender`、`phone`：顶部基础信息。
- `email`、`github`、`blog`：顶部联系方式。
- `accent`：主色，当前为深棕色 `#6F4E37`。
- `text`：正文色，当前为深灰色 `#3E3A36`。
- `font`：简历字体栈。
- `lineHeight`：正文行高。

## Markdown 约定

简历正文使用一小组固定写法，保证排版稳定：

- `## 专业技能`：一级模块，会渲染为深棕标题和横向分割线。
- `### 公司名称 | 2021年01月 - 2022年01月`：经历条目，会自动左右分栏显示名称和时间。
- `- 项目职责或成果`：普通列表，适合写技能、经历、项目亮点。
- `` `985` ``：标签样式，适合学校层次、关键词、证书等短标签。

示例：

```markdown
## 工作经历

### 某某科技 | 2022年03月 - 至今

- 负责核心业务前端架构设计，推进组件化、工程化和性能优化
- 将首屏加载时间从 3.2s 优化至 1.8s，提升关键路径体验
```

## 打印和导出 PDF

打开页面后使用浏览器自带打印功能：

- Chrome / Edge：按 `Ctrl+P` 或 `Cmd+P`。
- 目标打印机选择「另存为 PDF」。
- 纸张选择 `A4`。
- 边距可选择「默认」或「无」。当前样式已在打印模式中设置 `12mm` 页面边距。
- 如需保留背景色或标签底色，打印设置中开启「背景图形」。

打印模式会自动移除页面阴影、圆角和背景，只保留适合 PDF 的简历正文。

## 主题调整

如果只想微调颜色，优先修改 `resume.md` 顶部字段：

```yaml
accent: "#6F4E37"
text: "#3E3A36"
```

如果要调整更细的视觉细节，可修改 `styles.css` 顶部变量：

```css
:root {
  --accent: #6f4e37;
  --text: #3e3a36;
  --muted: #766e66;
  --page-bg: #f2f0ed;
  --soft-brown: #8a6a4f;
  --warm-line: #d8cabe;
}
```

推荐配色方向：

- 深灰正文：保证长期阅读舒适，不像纯黑那样生硬。
- 深棕强调：用于标题和关键线条，比紫色更沉稳，也比纯灰更有记忆点。
- 暖灰背景：用于屏幕预览，打印时自动转为白底。

## 部署方式

这是纯静态项目，无需构建，可以直接部署到任意静态托管服务：

- GitHub Pages
- Nginx
- Vercel
- Netlify
- 对象存储静态网站

部署时保持 `index.html`、`resume.md`、`script.js`、`styles.css` 在同一目录即可。

## 常见问题

### 页面提示无法读取 `resume.md`

通常是因为直接双击打开了 `index.html`。请使用静态服务访问：

```bash
python3 -m http.server 8000
```

### 修改 `resume.md` 后页面没有变化

刷新页面即可。脚本读取 Markdown 时已附加时间戳参数，一般不会被浏览器缓存。

### 想放真实头像怎么办

在 `resume.md` 顶部增加 `avatar` 字段：

```yaml
avatar: ./avatar.jpg
```

然后把头像文件放到项目目录中。没有设置 `avatar` 时，会显示一个圆形文字占位头像。

### 想压缩到一页怎么办

可以按优先级调整：

- 缩短经历和项目 bullet 的文字。
- 在 `resume.md` 中把 `lineHeight` 调小到 `20px`。
- 在 `styles.css` 中适当减小 `.resume-card` 的内边距。
- 打印时选择更小边距。

## 设计说明

这个方案没有引入构建工具和第三方库，目的是让简历长期可维护：

- 内容可读：Markdown 文件适合持续编辑和版本管理。
- 样式集中：排版细节集中在 CSS，避免内容里混杂大量 HTML。
- 打印友好：专门提供 `@media print`，导出 PDF 时更干净。
- 可迁移：整个目录可直接复制、托管或归档。
