# Nian's Collection

一个充满设计感的数字藏品展架，展示盲盒、合金车模型和卡片等藏品。

## ✨ 特色功能

- 🌟 **宇宙主题设计** - 星空背景配合轨道导航，打造沉浸式体验
- 🪐 **轨道导航系统** - 行星式分类按钮，围绕中心旋转
- 🎴 **3D 卡片效果** - 悬停时的 3D 变换和缩放动画
- ⏭️ **横向滚动画廊** - 流畅的卡片翻页体验
- 📍 **分页指示器** - 直观的页面导航
- 🎯 **YAML 数据驱动** - 轻松添加和管理藏品
- ⌨️ **键盘快捷键** - 左右箭头翻页，ESC 关闭弹窗

## 🚀 快速开始

### 方法 1：使用本地服务器（推荐）

由于需要加载 YAML 数据文件，建议使用本地服务器运行：

#### 使用 Python（如果已安装）：

```bash
# Python 3
python -m http.server 8000

# 然后在浏览器中打开：http://localhost:8000
```

#### 使用 VS Code Live Server：

1. 安装 "Live Server" 扩展
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

### 方法 2：直接打开（部分功能受限）

直接双击 `index.html` 在浏览器中打开，但 YAML 数据加载可能会受到 CORS 限制。

## 📁 项目结构

```
Nian/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── app.js             # JavaScript 逻辑
├── data/              # 藏品数据目录
│   ├── blindboxes.yml # 盲盒数据
│   ├── diecast.yml    # 合金车数据
│   └── cards.yml      # 卡片数据
└── README.md
```

## 🎨 添加藏品

在 `data/` 目录下的 YAML 文件中添加新的藏品：

### 数据字段说明

| 字段 | 说明 | 必填 |
|------|------|------|
| `id` | 唯一标识符 | 是 |
| `title` | 藏品标题 | 是 |
| `category` | 分类 (blindbox/diecast/card) | 是 |
| `description` | 描述文字 | 是 |
| `image` | Emoji 图标（无图片时使用） | 是 |
| `imageUrl` | 图片 URL（可选） | 否 |
| `date` | 入手日期 | 是 |
| `rarity` | 稀有度 (common/rare/epic/legendary) | 是 |
| `brand` | 品牌 | 是 |
| `series` | 系列（盲盒专用） | 否 |
| `model` | 型号（合金车专用） | 否 |
| `scale` | 比例（合金车专用） | 否 |
| `set` | 卡包（卡片专用） | 否 |
| `type` | 类型（卡片专用） | 否 |
| `notes` | 备注 | 否 |

### 示例

```yaml
- id: bb-001
  title: 泡泡玛特 - Dimoo 太空旅行系列
  category: blindbox
  description: Dimoo 带你探索宇宙
  image: 🧑‍🚀
  imageUrl: https://example.com/image.jpg
  date: 2025-12-15
  rarity: epic
  series: Dimoo 太空旅行
  brand: 泡泡玛特
  notes: 隐藏款！
```

## ⌨️ 快捷键

| 按键 | 功能 |
|------|------|
| `←` | 上一页 |
| `→` | 下一页 |
| `ESC` | 关闭弹窗 |

## 🎯 设计亮点

- **宇宙星空背景** - 三层动态星空，营造深邃感
- **行星导航** - 分类按钮沿轨道旋转，交互有趣
- **3D 卡片** - CSS 3D 变换，悬停效果惊艳
- **玻璃态设计** - 半透明背景配合模糊效果
- **渐变配色** - 紫蓝金渐变，现代感十足
- **流畅动画** - 精心设计的缓动函数和过渡效果

## 📝 License

Made with 💖
