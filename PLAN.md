# Dashboard Studio — 开发路线图

## 当前已完成

- json-render 渲染管线完整打通（catalog → registry → Renderer）
- 7 个基础组件：Grid、Flex、Card、MetricCard、ChartPlaceholder、SectionTitle、StatusDot
- 4 个预设布局模板，点击侧边栏命令即可渲染
- UI 壳子：Header（面包屑 + 状态徽章）、Sidebar（命令列表 + 输入框）、PreviewPanel（浏览器工具栏 + 渲染视口）

---

## Phase 1：接入 AI 生成（核心链路）

打通 **prompt → AI → Spec → 渲染** 的完整闭环，让 Generate 按钮真正工作。

### 1.1 服务端 API 路由

- 新建 AI 生成服务（可选方案：本地 proxy 或直接前端调用）
- 利用 `catalog.prompt()` 自动生成系统提示词，约束 AI 输出符合 Spec schema
- 利用 `catalog.jsonSchema()` 做 structured output 约束

### 1.2 前端流式接入

- 使用 `useUIStream({ api })` 或 `useChatUI({ api })` 接收流式 Spec
- 替换 `app.tsx` 中 `handleGenerate` 的 console.log stub
- 流式渲染：AI 逐步输出 JSONL patch → Renderer 实时更新

### 1.3 StatusBadge 联动

- 将 `loading` / `error` 状态从 App 传到 Header
- 生成中显示 `loading`（琥珀色脉冲），失败显示 `error`（红色）

### 1.4 错误处理

- AI 返回无效 Spec 时，使用 `autoFixSpec()` 自动修复
- 展示友好错误提示而非白屏

---

## Phase 2：真实图表渲染

将 ChartPlaceholder 替换为真实的可视化图表。

### 2.1 选型与接入

- 接入图表库（Recharts / ECharts / 其他）
- 新建 `Chart` 组件替代 `ChartPlaceholder`，支持 `data` prop 接收数据

### 2.2 Mock 数据层

- 为每种图表类型生成合理的 mock 数据
- 后续可对接真实数据源

### 2.3 扩展图表类型

- Line、Bar、Area、Pie、Donut、Scatter、Stacked Area
- 拓扑图可单独选型（如 D3 force layout）

---

## Phase 3：交互与状态管理

### 3.1 Actions 系统

- 在 catalog 中定义 actions（如 `refresh`、`filter`、`navigate`）
- 在 registry 中实现 action handlers
- 使用 `JSONUIProvider` 的 `handlers` prop 注入

### 3.2 键盘快捷键

- 注册 `Alt+1` ~ `Alt+4` 全局快捷键触发预设命令
- 使用 `useEffect` + `keydown` 监听

### 3.3 BrowserToolbar 刷新

- 刷新按钮重新渲染当前 spec
- 地址栏动态显示当前 spec 的标识

---

## Phase 4：组件扩展

扩充 catalog 组件库，覆盖更多仪表盘场景。

| 组件 | 用途 |
|------|------|
| Table | 数据表格 |
| List | 列表展示 |
| Badge | 标签徽章 |
| Alert | 告警通知 |
| Tabs | 页签切换 |
| Progress | 进度条 |
| Divider | 分隔线 |

---

## Phase 5：工程化完善

### 5.1 Spec 管理

- Spec 历史记录（undo/redo）
- 导入/导出 JSON Spec
- Spec 编辑器（侧边 JSON 面板）

### 5.2 动态化硬编码

- BreadcrumbNav 的 workspace / projectId 动态化
- BrowserToolbar URL 动态生成

### 5.3 多轮对话

- 使用 `useChatUI` 支持对已有 Spec 的增量修改
- "在左侧加一个图表" → AI 基于 `currentSpec` 生成 patch
