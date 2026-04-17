# AGENTS.md

本文件用于帮助 AI 在 Umo Editor 仓库中更快进入工作状态，减少重复扫描代码和低质量修改。

## 项目定位

- 项目名称：`@umoteam/editor`
- 技术栈：`Vue 3`、`Tiptap 3`、`Vite`
- 产物形态：组件库（lib）+ 本地开发演示
- 核心目标：提供类 Word 的在线文档编辑体验，覆盖分页、Web 版式、富文本、Markdown、扩展节点、导出、打印、国际化、主题

## 代码入口地图

优先按下面顺序阅读，能最快建立全局认知。

1. `src/components/index.vue`
   - 顶层总控层
   - 负责 `provide/inject`、事件桥接、自动保存、历史记录、导出/打印、对外 API
2. `src/components/editor/index.vue`
   - 实际 `new Editor(...)` 位置
   - 负责内容初始化、扩展挂载、编辑器生命周期
3. `src/extensions/index.js`
   - 内建扩展总装配入口 `getDefaultExtensions(...)`
   - 负责扩展过滤、输入/粘贴规则、结构型扩展联动
4. `src/options/config/index.js`
   - 默认配置来源
5. `src/options/schema.js`
   - 配置 schema 校验与 merge 约束
6. `src/utils/options.js`
   - `defaultOptions + globalOptions + props` 合并入口

## 目录职责速览

- `src/components/`
  - UI 层与总控层，含 toolbar、bubble、block、statusbar、container
- `src/extensions/`
  - Tiptap/ProseMirror 扩展层，节点/命令/规则/NodeView 的主要实现区
- `src/options/`
  - 默认配置、字典、schema
- `src/composables/`
  - 状态、快捷键、弹窗、i18n 等可复用能力
- `src/utils/`
  - 内容转换、历史记录、资源加载、文件处理等工具
- `src/locales/`
  - 国际化文案
- `src/assets/`
  - 图标、样式和静态资源

## 运行时数据流

- 启动链路
  - `main.js` -> `app.use(useUmoEditor, options)` -> `UmoEditor`
- 配置链路
  - `defaultOptions` -> 插件注入 `defaultOptions` -> 组件 props -> `getOpitons()` 合并 + schema 校验
- 编辑器链路
  - `components/editor/index.vue` 创建 `Editor`
  - `extensions/index.js` 组装默认扩展
  - `options.extensions` 追加外部扩展
- 内容链路
  - `setContent/insertContent` 写入
  - `onUpdate` 回写 `$document.content`
  - `getContent/getHTML/getText/getJSON` 导出
- 保存链路
  - 变更触发 `contentUpdated`
  - autoSave 定时器触发 `saveContent()`
  - `onSave(content,page,document)` 由业务侧实现

## 高频改动入口

- 新增工具栏按钮
  - `src/components/menus/toolbar/*`
  - 如需新能力，联动 `src/extensions/*` 与 `src/extensions/index.js`
- 新增节点/扩展
  - `src/extensions/<feature>/index.js`
  - 有可视渲染时补 `node-view.vue`
  - 在 `getDefaultExtensions()` 注册
- 新增配置项
  - `src/options/config/index.js` 默认值
  - `src/options/schema.js` 约束
  - 必要时在 UI 或 API 层接入
- 修改保存/导出/打印
  - 先看 `src/components/index.vue`
  - 再看 `src/components/menus/toolbar/export/*` 与 `src/utils/*`

## 项目关键约定

- `components/index.vue` 是总控层
  - 菜单改动常常需要联动历史记录、自动保存、对外 API 或事件
- `disableExtensions` 是复用开关，不仅影响扩展注册
  - 还影响多个 UI 菜单显隐和部分功能入口
- `options.extensions` 是外部扩展入口
  - 不要破坏追加扩展机制
- `provide/inject` 是主通信机制
  - 改共享状态前先追踪 provider 与所有 consumer

## disableExtensions 特别说明

- 扩展层按 `Extension.name` 过滤（常见是 camelCase）
- UI 层很多是 kebab-case key（例如 `text-box`）
- 两者不保证同名一一对应
- 修改禁用逻辑时必须同时检查：
  - `src/extensions/index.js` 的过滤逻辑
  - `src/components/toolbar/*.vue`、`src/components/menus/*` 的显隐逻辑

## 事件与 API 认知

- 对外事件定义在 `components/index.vue` 的 `defineEmits`
- 编辑器事件通过桥接转发（`update/selection/transaction/focus/blur/...`）
- 对外方法通过 `defineExpose` 暴露
  - 配置类：`setOptions/setToolbar/setPage/setDocument`
  - 内容类：`setContent/insertContent/getContent`
  - 控制类：`saveContent/print/toggleFullscreen/reset/destroy`

## 配置改动检查表

改配置前后至少检查以下项：

- 默认值是否在 `config/index.js`
- 约束是否在 `schema.js`
- 是否影响运行时方法校验（`setTheme`、`setSkin` 等）
- 是否影响只读模式、自动保存、历史记录
- 是否需要国际化文案
- 是否需要 `disableExtensions` 控制

## 扩展改动检查表

- 扩展 `name` 是否稳定且与现有能力冲突可控
- 是否需要 NodeView（Vue 组件）
- 是否已接入 `getDefaultExtensions()`
- 是否需要菜单入口（toolbar/bubble/block）
- 是否需要配置化开关与 schema
- 是否影响导出/保存/复制粘贴

## 保存与上传改动检查表

- `onSave` 返回值处理是否兼容现有逻辑
- `onFileUpload/onFileDelete` 回调是否保持契约
- 粘贴/拖拽文件链路是否受影响（`file-handler`）
- `uploadFileMap` 读写时机是否正确

## 验证建议

- 本地开发：

```bash
npm run dev
```

- 构建验证：

```bash
npm run build
```

- 格式与静态修复：

```bash
npm run format
npm run lint
```

如果改动集中在局部文件，至少确认：

- 没有新增明显语法错误
- 菜单显隐符合预期
- 相关命令在编辑器内能执行
- 没有破坏 `options` 合并与 `provide/inject`

## 给 AI 提需求模板

为提升成功率，建议在需求中包含以下信息：

- 目标效果
- 触发位置（toolbar/bubble/block/page/export/save）
- 是否配置化（默认值、是否外部可控）
- 是否接入 `disableExtensions`
- 是否需要国际化
- 验收路径（你希望如何验证）

示例：

- “给分页模式新增一个工具栏按钮，插入自定义节点，支持 `disableExtensions` 隐藏，并补中英文文案。”
- “把某能力改成可配置项，默认开启，业务方可通过 props 关闭，同时补 schema 约束。”
- “排查 readOnly 模式下某按钮可点击的问题，给出根因并修复。”

## AI 输出约定（建议）

任务完成后优先输出：

- 改动文件列表
- 每个文件的职责变化
- 联动点（配置、扩展、菜单、文案、验证）
- 风险与待确认项

若需求复杂，先给 3-6 步短计划再实施。
