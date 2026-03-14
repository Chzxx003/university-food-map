# Magazine Feed 设计方案

## 概述

将首页餐厅展示从传统卡片网格改为「杂志式推荐 + 极简玻璃列表」的混合信息流布局。顶部用不等大小图片网格展示 4 家推荐餐厅，制造视觉冲击；下方用紧凑的玻璃列表高效展示其余餐厅。

## Hero 区域（杂志式推荐）

### 布局
- 左大右小 + 底部横条，共 4 个位置
- 大图：60% 宽 × 280px（左侧）
- 右上：40% 宽 × 140px
- 右下：40% 宽 × 140px
- 底部横条：100% 宽 × 90px
- 间距：8px gap

### 推荐逻辑（混合策略）
1. **大图 — 🔥 本周热门**：按 `visits` 降序，取第 1 名
2. **右上 — ⭐ 高分新发现**：按 `rating` 降序，排除已选，取第 1 名
3. **右下 — 💰 性价比之王**：按 `rating / avgPrice` 降序，排除已选，取第 1 名
4. **横条 — ✨ 编辑推荐**：从剩余餐厅中随机选 1 家（用 seed 保证同一会话内稳定）

### 视觉样式
- 每张图底部：`linear-gradient(transparent, rgba(0,0,0,0.7))` 遮罩
- 文字：白色，店名 bold，副信息（评分 + 价格 + 菜系）半透明
- 左上角：彩色标签（玻璃风格），标注推荐类型
  - 本周热门：`bg-primary/85 backdrop-blur`
  - 高分新发现：`bg-amber-500/85 backdrop-blur`
  - 性价比之王：`bg-green-500/85 backdrop-blur`
  - 编辑推荐：`bg-purple-500/85 backdrop-blur`
- 圆角：大图 20px，小图 16px，横条 16px
- 点击跳转 `/restaurant/:id`

### 响应式
- 移动端（<640px）：如上所述
- 平板/桌面端（>=640px）：可适当加大高度，横条变为第三列

## 玻璃分隔条

- 样式：`glass-strong rounded-2xl`
- 布局：`flex justify-between items-center`，`px-4 py-3`
- 左侧：「附近 {count} 家餐厅」，`text-sm font-semibold text-text`
- 右侧：排序 pill 组
  - 选项：距离、评分、价格
  - 未选中：`glass-subtle rounded-xl text-text-secondary text-xs px-3 py-1.5`
  - 选中：`glass-accent text-primary font-semibold rounded-xl text-xs px-3 py-1.5`
- 排序改变时列表重新排序并触发入场动画

## 列表区域（极简玻璃列表）

### 单项布局（~76px 高）
- 容器：`glass rounded-2xl p-3`，`flex items-center gap-3`
- 左：48×48 缩略图，`rounded-xl object-cover`
- 中（flex-1 min-w-0）：
  - 第一行：`flex justify-between` — 店名（`text-sm font-semibold text-text truncate`）+ 价格（`text-sm font-bold text-primary`，如 `¥35`）
  - 第二行：`flex items-center gap-2 text-xs text-text-muted mt-1` — 评分（⭐ 4.8）+ 菜系 pill（`glass-subtle rounded-lg px-1.5 py-0.5`）+ 距离（如有）
- 右：收藏按钮（Heart icon）

### 动画
- `card-animate` class，staggered `animationDelay: ${i * 50}ms`

## 需要修改的文件

### `HomePage.jsx`
- 移除 `viewMode` / `setViewMode` 相关逻辑和网格/列表切换按钮
- 保留地图按钮
- 新增 Hero 区域（`MagazineHero` 组件或内联）
- 新增排序状态（`sortBy: 'distance' | 'rating' | 'price'`）
- 新增玻璃分隔条
- 列表区改为新的紧凑列表样式

### `RestaurantCard.jsx`
- 新增 `mini` 模式（76px 高的列表项），或新建 `RestaurantListItem` 组件
- 保留现有 `compact` 和默认模式供其他页面使用

### `AppContext.jsx`
- 新增 `sortBy` 状态和 setter
- 新增排序逻辑（距离/评分/价格）
- 新增 `heroRestaurants` 计算（混合策略选出 4 家）

### `Skeleton.jsx`
- 新增 `MagazineHeroSkeleton`（匹配 hero 布局的骨架屏）
- 新增 `ListItemSkeleton`（匹配列表项的骨架屏）

## 移除项
- `viewMode` 状态和 grid/list 切换按钮（HomePage 不再需要）
- `RestaurantCard` 的默认（大卡片）模式在首页不再使用（但保留组件供 FavoritesPage 等使用）
