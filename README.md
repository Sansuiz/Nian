# Nian - 一年的记忆

用圆点记录一整年的美好时光，温暖且有情绪的纪念日记网站。

## 项目结构

```
Nian/
├── _config.yml              # Jekyll 配置文件
├── index.html               # 首页
├── _data/                   # Jekyll 数据目录（预留）
├── _layouts/                # 布局模板目录
│   └── default.html         # 默认布局
├── _posts/                  # 博客文章目录（预留）
├── assets/                  # 静态资源目录
│   ├── css/                 # 样式文件
│   │   └── styles.css       # 主样式
│   ├── js/                  # JavaScript 文件
│   │   └── app.js           # 主脚本
│   ├── data/                # 数据文件目录（可通过 HTTP 访问）
│   │   ├── anniversaries.yml # 纪念日数据
│   │   └── notes.yml        # 笔记数据
│   └── images/              # 图片目录（预留）
└── README.md                # 项目说明
```

## 功能特性

- 🎯 **年视图**：显示全年 365/366 个圆点
- 📅 **月视图**：鼠标滚轮放大可切换到月视图
- 💖 **多种情绪样式**：支持 love、happy、sad、excited、peaceful 等样式
- 🌬️ **呼吸动效**：有内容的圆点有呼吸动画效果
- 📝 **卡片详情**：点击圆点显示详细内容卡片
- 📊 **统计信息**：右下角显示纪念日和笔记数量

## 数据格式

数据文件存放在 `assets/data/` 目录下（注意：不是 `_data/` 目录，因为 `_data/` 目录下的文件在 GitHub Pages 上不能通过 HTTP 直接访问）。

### 纪念日 (assets/data/anniversaries.yml)

```yaml
- date: "2026-02-14"
  title: "情人节"
  content: |
    和心爱的人一起度过的美好时光。
    感谢有你在身边。
  mood: "love"
  style: "love"
```

### 笔记 (assets/data/notes.yml)

```yaml
- date: "2026-03-07"
  title: "项目启动"
  content: |
    今天开始了一个新的项目！
    充满了期待和兴奋。
  mood: "excited"
  style: "excited"
```

## 可用样式和心情

### 样式 (style)
- `love` - 爱意满满的粉红色
- `happy` - 开心的暖黄色
- `sad` - 伤感的淡蓝色
- `excited` - 激动的紫色
- `peaceful` - 平静的青绿色

### 心情 (mood)
- `love` - 💕 爱意满满
- `happy` - 😊 开心
- `sad` - 😢 伤感
- `excited` - 🎉 激动
- `peaceful` - 🌿 平静

## 本地运行

### 使用 Jekyll (推荐)

```bash
# 安装 Jekyll
gem install bundler jekyll

# 安装依赖
bundle install

# 本地预览
bundle exec jekyll serve
```

然后在浏览器中访问 `http://localhost:4000`

### 使用简单 HTTP 服务器

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server -p 8000
```

然后在浏览器中访问 `http://localhost:8000`

## 部署到 GitHub Pages

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中开启 GitHub Pages
3. 选择 `main` 分支作为源
4. 稍等几分钟，网站就会部署成功

## 使用说明

- **滚轮向上**：放大切换到月视图
- **滚轮向下**：缩小切换到年视图
- **鼠标悬停**：显示圆点标题提示
- **点击圆点**：查看详细内容卡片
- **ESC 键或点击背景**：关闭卡片

## 自定义

### 修改配色

编辑 `assets/css/styles.css` 中的颜色值。

### 添加新样式

在 `styles.css` 中添加新的 `.style-xxx` 类，并在 `app.js` 的 `moodLabels` 中添加对应的标签。

## 技术栈

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Jekyll (静态网站生成)
- js-yaml (YAML 解析)

## License

MIT
