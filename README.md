# Nian - 数字藏品展架

一个有趣活泼又有质感的藏品展示网站！

## ✨ 特点

- 🎨 美观的渐变色设计，柔和的背景光晕效果
- 📦 支持多种藏品分类（盲盒、合金车、卡片）
- 🎯 分类筛选功能
- 📝 YAML 数据管理，易于更新
- 🎭 模态框详情展示
- 📱 响应式设计

## 🚀 使用方法

由于需要加载 YAML 文件，请使用本地服务器运行。

### 方法一：使用 Python

```bash
python -m http.server 8000
```

### 方法二：使用 Node.js (http-server)

```bash
npm install -g http-server
http-server
```

### 方法三：VS Code Live Server

在 VS Code 中安装 Live Server 插件，右键点击 index.html 选择 "Open with Live Server"

然后在浏览器中打开 `http://localhost:8000` 即可查看效果！

## 📁 项目结构

```
Nian/
├── index.html          # 主页面
├── styles.css        # 样式文件
├── app.js          # 交互逻辑
├── data/
│   ├── blindboxes.yml  # 盲盒数据
│   ├── diecast.yml     # 合金车数据
│   └── cards.yml       # 卡片数据
└── README.md
```

## 💡 添加藏品

在 `data/` 文件夹下的对应 YAML 文件中添加新条目：

```yaml
- id: 唯一ID
  title: 藏品名称
  category: blindbox/diecast/card
  description: 描述
  image: 🎁 (emoji 占位)
  imageUrl: 图片路径 (可选)
  date: 2026-01-01
  rarity: common/rare/epic/legendary
  brand: 品牌
  notes: 备注
  # 其他可选字段：series/model/scale/set/type
```

