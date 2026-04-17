---
name: "umo-editor-dev"
description: "Implements and reviews Umo Editor changes. Invoke when requests involve toolbar, extensions, options/schema, save/export flows, or runtime editor behaviors."
---

# Umo Editor Dev

该技能用于在 `@umoteam/editor` 仓库中进行高质量功能开发与问题修复，目标是让改动与项目现有架构保持一致，并保证可验证交付。

## 使用时机

当请求属于以下场景时，优先启用本技能：

- 新增或修改工具栏、气泡菜单、块菜单
- 新增或改造 Tiptap 扩展、节点、命令、NodeView
- 调整 `defaultOptions`、`schema`、`disableExtensions` 行为
- 修改保存、自动保存、导出、打印、内容导入导出流程
- 排查编辑器运行时问题（readOnly、Markdown、分页、国际化、主题、历史记录）

## 项目理解基线

在动手前，优先建立以下认知：

- 总控层：`src/components/index.vue`
- Editor 实例层：`src/components/editor/index.vue`
- 扩展装配层：`src/extensions/index.js`
- 配置默认值：`src/options/config/index.js`
- 配置校验：`src/options/schema.js`
- 配置合并：`src/utils/options.js`

## 执行流程

1. 判断需求层级
   - UI（菜单/交互）
   - 扩展（节点/命令/规则）
   - 配置（默认值/schema/API）
   - 内容流（set/get/transform）
   - 保存流（autoSave/onSave/upload）
2. 定位最小改动点
   - 优先修改最靠近问题根因的文件
3. 检查联动影响
   - `disableExtensions`
   - 国际化文案
   - readOnly
   - 自动保存与历史记录
   - 对外事件与 `defineExpose` API
4. 进行实现
   - 保持最小必要改动，避免无关重构
5. 完成验证
   - 至少做静态检查或构建验证
6. 结构化交付
   - 变更文件、影响范围、验证结果、风险说明

## 模块分流策略

### 菜单类需求

优先检查：

- `src/components/menus/toolbar/`
- `src/components/menus/bubble/`
- `src/components/menus/block/`

必须确认：

- 按钮是否已有命令可用
- 是否要接入 `disableExtensions`
- 是否受 `readOnly` 或其他配置开关影响

### 扩展类需求

优先检查：

- `src/extensions/`
- `src/extensions/index.js`

必须确认：

- 扩展是否需要 `node-view.vue`
- 是否需要菜单入口
- 是否要纳入默认扩展管线
- 是否要支持配置开关

### 配置类需求

优先检查：

- `src/options/config/index.js`
- `src/options/schema.js`
- `src/utils/options.js`

必须确认：

- 是新增顶层配置还是已有对象下的子项
- 是否需要默认值
- 是否需要 schema 校验
- 是否与已有运行时校验冲突
- 是否要通过组件 props 或 API 暴露给外部

### 保存/导出/内容处理类需求

优先检查：

- `src/components/index.vue`
- `src/utils/content-transform.js`
- `src/utils/history-record.js`
- `src/components/menus/toolbar/export/`

必须确认：

- 是否影响 `onSave`
- 是否影响 `getContent()` / `setContent()` / `insertContent()`
- 是否影响自动保存或历史记录

## 关键风险清单

- `disableExtensions` 在扩展层与 UI 层有双重语义，键名可能不完全一致
- 仅修改 UI 不改扩展注册，会出现按钮存在但命令失效
- 仅修改默认配置不改 schema，会导致配置可传但运行时报错
- 忽略 `provide/inject` 依赖关系，容易引发隐性空引用问题
- 变更总控层时未检查 `defineExpose` 与事件桥接，易破坏外部集成

## 验证策略

优先使用以下命令验证：

```bash
npm run build
npm run lint
```

需要交互验证时再执行：

```bash
npm run dev
```

至少覆盖：

- 目标功能路径可执行
- 菜单显隐符合预期
- 关键 API 返回正常
- 未新增明显诊断错误

## 输出格式要求

完成后优先给出：

1. 变更文件列表
2. 每个文件的职责变化
3. 联动影响点（配置/扩展/菜单/文案/保存）
4. 验证结果
5. 剩余风险与待确认项

## 任务接收模板

当用户需求不完整时，先补齐以下信息再实施：

- 目标行为
- 触发位置
- 是否配置化
- 是否接入 `disableExtensions`
- 是否需要国际化
- 验收标准
