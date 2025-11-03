<p style="text-align: center; margin: 2rem 0;">
<a href="https://www.umodoc.com" target="_blank"><img src="https://unpkg.com/@umoteam/editor-external@latest/static/logo.svg" alt="umodoc.com" width="280" /></a>
</p>

<p style="text-align: center;">
<a href="https://github.com/umodoc/editor/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/@umoteam/editor" /></a>
<a href="https://www.npmjs.com/package/@umoteam/editor" target="_blank"><img src="https://img.shields.io/npm/v/@umoteam/editor" /></a>
<a href="https://www.npmjs.com/package/@umoteam/editor" target="_blank"><img src="https://img.shields.io/npm/d18m/@umoteam/editor" /></a>
<a href="https://www.npmjs.com/package/@umoteam/editor" target="_blank"><img src="https://img.shields.io/npm/unpacked-size/%40umoteam%2Feditor" /></a>
<a href="https://github.com/umodoc/editor/commits" target="_blank"><img src="https://img.shields.io/github/commit-activity/m/umodoc/editor" /></a>
</p>
<p style="text-align: center;"><a href="https://dev.umodoc.com/en/docs/editor">[English Documentation]</a> | 中文文档</p>

## 基本介绍

Umo Editor 是一个基于 Vue3 和 Tiptap 的本土化开源文档编辑器，专为国人用户设计。它提供了强大的文档编辑能力和 AI 创作功能，支持分页模式和普通 Web 模式、Markdown 语法、富文本编辑、多种格式的节点插入、页面样式设置、文档导出与打印等功能。

此外，Umo Editor 还支持自定义扩展、多语言设置和暗色主题。同时我们提供了单独的文本预览组件[Umo Viewer](https://github.com/umodoc/viewer)，用户可以在项目中使用该组件来预览文档。

Umo Editor 最大的特点是代码完全开源且自主可控，支持私有部署，您可以内网环境中使用，而无需担心数据安全问题。同时 Umo Editor 基于 Vue3 和 Tiptap，两者都有丰富的生态系统和社区支持，在遇到问题时可以迅速得到解决。

![Umo Editor](https://unpkg.com/@umoteam/editor-external@latest/static/umo-editor-cn@2x.png)

作为一个独立的 Vue3 插件，Umo Editor 可以轻松集成到各类 Vue3 项目中。对于非 Vue3 项目，您可以通过 Iframe 将 Umo Editor 嵌入到您的项目中。

[官网](https://www.umodoc.com) | [开发文档](https://dev.umodoc.com/cn/docs/editor) | [在线演示](https://www.umodoc.com/demo) | [GitHub](https://github.com/umodoc/editor) | [码云(国内镜像)](https://gitee.com/umodoc/editor) | [NPM](https://www.npmjs.com/package/@umoteam/editor)

## 在线体验

访问[https://www.umodoc.com/demo?pane=hide](https://www.umodoc.com/demo?pane=hide)快速体验。

## 开发文档

请访问[https://dev.umodoc.com/cn/docs/editor](https://dev.umodoc.com/cn/docs/editor)。

## 设计理念

Umo Editor 的诞生旨在解决 Web 应用中文档编辑的复杂性，为 Web 项目提供类似 Microsoft Word 的强大编辑能力，同时保持 Web 应用的便捷性。无论是政企信息管理系统、学术研究撰写、团队文档协作、知识库管理还是个人笔记整理，Umo Editor 都能成为您的得力助手。

## 开源优势

- **免费使用**：Umo Editor 基于[MIT 许可证](https://github.com/umo-editor/umo-editor/blob/main/LICENSE)对所有开发者免费开放，无需担心版权问题。
- **持续更新**：Umo Editor 将持续迭代，不断优化功能，提升用户体验。
- **定制化开发**：开源意味着更大的灵活性，开发者可根据项目需求进行定制化开发，打造专属的文档编辑器。

## 核心特性

- 支持内网部署
- 零配置开箱即用
- 类似 Microsoft Word 的分页模式
- 轻量级
- 所见即所得
- 富文本编辑功能
- Markdown 语法支持
- 实用工具集成
- 演示模式
- 文档导出与分享
- 页面设置
- AI 文档助手
- 支持打印及打印预览
- 支持自定义扩展
- 快捷键支持
- 主题定制
- 多语言设置
- 暗色主题
- 支持 Web 版式
- 单独的文档预览组件[Umo Viewer](https://github.com/umodoc/viewer)

更多详细介绍见[核心特性](https://dev.umodoc.com/cn/docs/editor/features)。

## 浏览器支持

| 浏览器                   |  版本  | 支持情况  |
| ------------------------ | :----: | :-------: |
| Google Chrome            | 最新版 |  ✅ 支持  |
| Firefox                  | 最新版 |  ✅ 支持  |
| Safari                   | 最新版 |  ✅ 支持  |
| Microsoft Edge           | 最新版 |  ✅ 支持  |
| 360 极速浏览器           | 最新版 |  ✅ 支持  |
| 各类国产浏览器的极速模式 | 最新版 |  ✅ 支持  |
| Internet Explorer (IE)   |  所有  | ❌ 不支持 |

## 环境支持

- **Node.js** (>=v18.0.0)
- **Vue** (>=v3.x)
- **Vite** (>=v5.x)
- **Tiptap** (>=v2.6)
- **TypeScript** (>=v5.5)

## 加入社区

我们鼓励用户加入 Umo Editor 的开源社区，共同参与到产品的开发和改进中。无论是提交 Bug 报告、功能请求还是代码贡献，都是我们社区宝贵的一部分。

您可以通过 [GitHub Discussions](https://github.com/umodoc/editor/discussions) 提交问题或意见。

或通过 [GitHub Issues](https://github.com/umodoc/editor/issues) 提交 Bug 报告。

## 贡献代码

Umo Editor 的发展离不开社区的支持，以下是为 Umo Editor 贡献过代码的贡献者名单，向他们致谢：

- [Umo Team](https://github.com/umodoc)：👨‍💻 核心开发者
- [Cassielxd](https://github.com/Cassielxd)：💪🏻 实现了分页和许多重要功能
- [china-wangxu](https://github.com/china-wangxu)：💪🏻 添加了许多重要功能
- [Na'aman Hirschfeld](https://github.com/Goldziher)：💪🏻 增强了 TypeScript 支持并添加测试
- [SevenDreamYang](https://github.com/SevenDreamYang)：🛠️ 增强 TypeScript 支持
- [ChenErik](https://github.com/ChenErik)：🛠️ 贡献了部分代码
- [SerRashin](https://github.com/SerRashin)：🛠️ 添加了俄语支持
- [Sunny Wisozk](https://github.com/SunnyWisozk)：🛠️ 贡献了部分代码
- [Sherman Xu](https://github.com/xuzhenjun130)：🛠️ 贡献了部分代码
- [vace](https://github.com/vace)：🛠️ 贡献了部分代码
- [Mikasa33](https://github.com/Mikasa33)：🛠️ 贡献了部分代码

我们欢迎任何形式的贡献，包括但不限于提交 Bug 报告、功能请求、代码贡献等。

## 联系我们

如果您有任何疑问或建议，请通过以下方式联系我们。在此之前，建议您详细阅读本文档，以便了解如何使用 Umo Editor。

- 反馈：[GitHub Issues](https://github.com/umodoc/editor/issues)
- 社区：[GitHub Discussions](https://github.com/umodoc/editor/discussions)
- 邮件：[contact@umodoc.com](mailto:contact@umodoc.com)

## 技术交流

- Umo Editor 技术交流 1 群(即将满员)：[994500039](https://qm.qq.com/q/gFsQShETqE)
- Umo Editor 技术交流 2 群：[455825557](https://qm.qq.com/q/rzgt2bUcAE)
- Discord：[Umo Editor](https://discord.gg/yBwBmm8e)

## 支持我们

如果您觉得 Umo Editor 有用，请考虑通过以下方式支持我们：

- ⭐ 给[Umo Editor 仓库](https://github.com/umodoc/editor)点个 Star，表示对项目的支持。
- 🔗 如果您在项目中使用了 Umo Editor，请添加一个链接到 https://github.com/umodoc/editor 。

## Umo Team 出品

- [Umo Editor](https://dev.umodoc.com/cn/docs/editor): 基于 Vue3 和 Tiptap 的本土化开源文档编辑器，专为国人用户设计。
- [Umo Viewer](https://dev.umodoc.com/cn/docs/viewer): PDF 文档查看器，基于 Vue3 和 PDF.js 实现，支持在浏览器中直接预览 PDF 文档，同时也支持预览 Umo Editor 文档内容。
- [Umo Editor Next](https://dev.umodoc.com/cn/docs/next): Umo Editor 的增强版，在包含最新版本的 Umo Editor 所有功能的基础上，重点增加或者增强了对多用户在线协作编辑、文档批注(评论)、文档历史版本管理、AI 创作、文档导入导出、表格等功能的支持，同时增强了工具栏和页边栏等区域的自定义能力。
- [Umo Editor Server](https://dev.umodoc.com/cn/docs/server): 为增强 Umo Editor 功能，如多用户在线协作编辑、文档批注(评论)、文档导入导出等功能而开发的配套服务器端软件。
- [Umo Office Viewer](https://dev.umodoc.com/cn/docs/office-viewer): Umo Office Viewer 是一款 Office 文档查看器，支持在 Web 页面中查看包括 WPS 文档在内的 40 余种主流的办公文档。
- [Umo Office Convert](https://dev.umodoc.com/cn/docs/office-convert): 将 Office、WPS 等 40 余种办公文档转换为可在线查看的文档格式，可与 Umo Office Viewer 结合使用实现办公文档的在线预览。

## 定制开发

如果您需要定制化开发，请联系我们，我们可以提供付费的定制化解决方案和商业支持。详细信息请访问[定制开发](https://www.umodoc.com/customization)。

## 开源协议

Umo Editor 采用 [MIT 许可证](https://gitee.com/umodoc/editor/raw/main/LICENSE)，您可以免费使用、修改和分发本软件，但这不代表您可以随意删除版权信息，请保留 Umo Editor 的版权信息和界面上的链接地址，否则视为侵权，请支持开源项目。

如果您不想保留版权信息，请联系我们或者购买商业版本 [Umo Editor Next](https://dev.umodoc.com/cn/docs/next)。

本文档采用[CC BY-NC-SA 4.0 DEED 许可证](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)发布。
