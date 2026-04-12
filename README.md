<p style="text-align: center; margin: 2rem 0;">
<a href="https://www.umodoc.com/en" target="_blank"><img src="https://unpkg.com/@umoteam/editor-external@latest/static/logo.svg" alt="umodoc.com" width="280" /></a>
</p>

<p style="text-align: center;">
<a href="https://github.com/umodoc/editor/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/@umoteam/editor" /></a>
<a href="https://www.npmjs.com/package/@umoteam/editor" target="_blank"><img src="https://img.shields.io/npm/v/@umoteam/editor" /></a>
<a href="https://www.npmjs.com/package/@umoteam/editor" target="_blank"><img src="https://img.shields.io/npm/dm/@umoteam/editor" /></a>
<a href="https://www.npmjs.com/package/@umoteam/editor" target="_blank"><img src="https://img.shields.io/npm/unpacked-size/@umoteam/editor" /></a>
<a href="https://github.com/umodoc/editor/commits" target="_blank"><img src="https://img.shields.io/github/commit-activity/m/umodoc/editor" /></a>
</p>

<p style="text-align: center;">English Documentation | <a href="https://dev.umodoc.com/cn/docs/editor">[中文文档]</a></p>

## 中文介绍

Umo Editor 是一个基于 Vue3 和 Tiptap3 的本土化开源文档编辑器，提供类似于 Microsoft Word 的在线编辑功能和浏览体验，专为国人用户设计。它提供了强大的文档编辑能力和 AI 创作功能，支持分页模式和普通 Web 模式、Markdown 语法、富文本编辑、多种格式的节点插入、页面样式设置、文档导出与打印等功能。

此外，Umo Editor 还支持自定义扩展、多语言设置和暗色主题。同时我们提供了单独的文本预览组件 [Umo Viewer](https://github.com/umodoc/viewer)，用户可以在项目中使用该组件来预览文档。

Umo Editor 最大的特点是代码完全开源且自主可控，支持私有部署，您可以内网环境中使用，而无需担心数据安全问题。同时 Umo Editor 基于 Vue3 和 Tiptap3，两者都有丰富的生态系统和社区支持，在遇到问题时可以迅速得到解决。

## Introduction

Umo Editor is an open-source document editor based on Vue3 and Tiptap3, providing an online editing experience similar to Microsoft Word. It provides powerful document editing capabilities and AI-assisted creation features. Umo Editor supports pagination and normal web layout, Markdown syntax, rich text editing, insertion of various node types, page style settings, document export, and printing. Additionally, it supports custom extensions, multi-language settings, and a dark theme. Umo Editor also supports web layout, and you can use it as a regular rich text editor.

Additionally, Umo Editor supports custom extensions, multi-language settings, and dark theme. We also provide a standalone text preview component, [Umo Viewer](https://github.com/umodoc/viewer), which users can integrate into their projects to preview documents.

Umo Editor's largest feature is that its code is completely open source and controllable. It supports private deployment, allowing you to use it in an intranet environment without worrying about data security issues. At the same time, Umo Editor is based on Vue3 and Tiptap3, both of which have rich ecosystems and communities, making it easy to solve problems when needed.

As an independent Vue3 plugin, Umo Editor can be easily integrated into various Vue3 projects with zero configuration. For non-Vue3 projects, you can embed Umo Editor into your project via an iframe. see [Use in Non-Vue3 Projects](https://dev.umodoc.com/en/docs/editor/getting-started#use-in-non-vue3-projects).

[Website](https://www.umodoc.com/en) | [Documentation](https://dev.umodoc.com/en/docs/editor) | [Playground](https://www.umodoc.com/en/demo) | [GitHub](https://github.com/umodoc/editor) | [NPM](https://www.npmjs.com/package/@umoteam/editor)

## Umo Editor Mobile

Umo Editor Mobile is a mobile document editor built with Vue3 and Tiptap3. It supports the complete "preview + edit + save" workflow and can be integrated directly into business systems as a standalone editor. Rather than being a simple trimmed-down version of Umo Editor, it is an independent product redesigned for touch-first scenarios, with its own save state machine, auto-save, back-navigation guards, history, internationalization, theming, and extension capabilities. At the same time, it keeps its configuration, events, and method naming as aligned with Umo Editor as possible, helping teams achieve a more unified multi-platform integration at lower cost.

If you plan to support both desktop and mobile, we recommend abstracting a unified editor adapter layer in your business application first, so you can reuse the document model, configuration semantics, and save flow while reducing long-term maintenance costs.

- Website: [https://mobile.umodoc.com](https://mobile.umodoc.com)
- Mobile Playground: Visit [https://em.umodoc.com](https://em.umodoc.com) in a mobile browser
- Documentation: [https://dev.umodoc.com/en/docs/mobile](https://dev.umodoc.com/en/docs/mobile)

## Screenshots

![umo editor](https://s2.umodoc.com/images/umo-editor1-en@2x.png)

![umo editor](https://s2.umodoc.com/images/umo-editor2-en@2x.png)

![umo editor](https://s2.umodoc.com/images/umo-editor3-en@2x.png)

## Online Experience

Visit [Playground](https://www.umodoc.com/en/demo?pane=hide) to try Umo Editor.

## Example Project

To help you get started quickly, we provide a demo project: https://github.com/umodoc/demo. You can view and run Umo Editor sample code in this project.

You can also preview and run it online with StackBlitz, CodeSandbox, or Github Pages:

- View and run on [StackBlitz](https://stackblitz.com/~/github.com/umodoc/demo?file=src/app.vue)
- View and run on [CodeSandbox](https://codesandbox.io/p/github/umodoc/demo/main?import=true)
- View and run on [Github Pages](https://umodoc.github.io/demo/)

## Documentation

Please visit [Documentation](https://dev.umodoc.com/en/docs/editor) for detailed instructions.

## Design Philosophy

Umo Editor aims to simplify document editing in web applications by providing Microsoft Word-like powerful editing capabilities and pagination mode while maintaining the convenience of web applications. Whether for government and enterprise information management systems, academic research writing, team document collaboration, knowledge base management, or personal note organization, Umo Editor is your reliable assistant.

## Open Source Advantages

- **Free to Use**: Umo Editor is free for all developers under the [MIT License](https://github.com/umo-editor/umo-editor/blob/main/LICENSE), with no copyright concerns.
- **Continuous Updates**: Umo Editor is continuously iterated to optimize features and enhance user experience.
- **Custom Development**: Open source allows developers to customize Umo Editor to meet project-specific needs.

## Key Features

- Support for Intranet Deployment
- Zero configuration, ready to use
- Pagination mode similar to Microsoft Word
- Lightweight
- Full WYSIWYG editing
- Rich text editing
- Markdown syntax support
- Integrated practical tools
- Presentation mode
- Document export and sharing
- Page settings
- Print and print preview support
- Custom extensions support
- Shortcut key support
- Theme customization
- Multilingual settings
- Dark mode
- Support for Web layout
- Standalone document preview component [Umo Viewer](https://github.com/umodoc/viewer)

For more details, see [Features](https://dev.umodoc.com/en/docs/editor/features).

## Browser Support

| Browser                | Version | Support |
| ---------------------- | ------- | :-----: |
| Google Chrome          | Latest  |   ✅    |
| Firefox                | Latest  |   ✅    |
| Safari                 | Latest  |   ✅    |
| Microsoft Edge         | Latest  |   ✅    |
| Internet Explorer (IE) | All     |   ❌    |

## Environment Support

- **Node.js** (>=v18.x)
- **Vue** (>=v3.x)
- **Tiptap** (>=v3.x)

## Join the Community

We encourage users to join the Umo Editor open-source community and participate in the development and improvement of the product. Whether it's submitting bug reports, feature requests, or code contributions, your involvement is invaluable to our community.

Submit issues or suggestions via [GitHub Discussions](https://github.com/umodoc/editor/discussions).

Report bugs via [GitHub Issues](https://github.com/umodoc/editor/issues).

## Contribute Code

The development of Umo Editor relies on community support. Below is a list of contributors who have contributed code to Umo Editor. We thank them for their efforts:

- [Umo Team](https://github.com/umodoc): 👨‍💻 Core developers
- [china-wangxu](https://github.com/china-wangxu): 💪🏻 Added many important features
- [Cassielxd](https://github.com/Cassielxd): 💪🏻 Added many important features
- [Na'aman Hirschfeld](https://github.com/Goldziher): 🛠️ Contributed code
- [SevenDreamYang](https://github.com/SevenDreamYang):🛠️ Contributed code
- [ChenErik](https://github.com/ChenErik): 🛠️ Contributed code
- [SerRashin](https://github.com/SerRashin): 🛠️ Added Russian language support
- [Sunny Wisozk](https://github.com/SunnyWisozk): 🛠️ Contributed code
- [Sherman Xu](https://github.com/xuzhenjun130): 🛠️ Contributed code
- [vace](https://github.com/vace)：🛠️ Contributed code
- [Mikasa33](https://github.com/Mikasa33)：🛠️ Contributed code

We welcome all forms of contributions, including but not limited to submitting bug reports, feature requests, and code contributions.

## Contact Us

If you have any questions or suggestions, please contact us through the following channels. Before doing so, we recommend reading this documentation thoroughly to understand how to use Umo Editor.

- Feedback: [GitHub Issues](https://github.com/umodoc/editor/issues)
- Community: [GitHub Discussions](https://github.com/umodoc/editor/discussions)
- Email: [contact@umodoc.com](mailto:contact@umodoc.com)

## Technical Exchange

- Discord：[Umo Editor](https://discord.gg/k8GjuBBhXD)

## Support Us

If you find Umo Editor useful, please consider supporting us in the following ways:

- ⭐ Star the [Umo Editor repository](https://github.com/umodoc/editor) to show your support.
- 🔗 If you use Umo Editor in your project, add a link to https://github.com/umodoc/editor.

## Products from Umo Team

- [Umo Editor](https://dev.umodoc.com/en/docs/editor): A localized open-source document editor based on Vue3 and Tiptap3.
- [Umo Viewer](https://dev.umodoc.com/en/docs/viewer): An open-source, lightweight document viewer for Umo Editor.
- [Umo Editor Mobile](https://mobile.umodoc.com): A mobile document editor for enterprise business scenarios, designed for standalone integration as well as collaboration with Umo Editor and Umo Editor Next.
- [Umo Editor Next](https://dev.umodoc.com/en/docs/next): An enhanced version of Umo Editor that includes all features of the latest Umo Editor while adding or improving support for multi-user real-time collaborative editing, document annotations (comments), document version history, AI-assisted creation, document import/export, tables, and more. It also enhances customization of toolbars and sidebars.
- [Umo Editor Server](https://dev.umodoc.com/en/docs/server): A companion server-side software developed to extend Umo Editor capabilities such as multi-user collaborative editing, document annotations, and document import/export.
- [Umo Office Viewer](https://dev.umodoc.com/en/docs/office-viewer): An Office document viewer that supports previewing over 40 mainstream office document in web pages.
- [Umo Office Convert](https://dev.umodoc.com/en/docs/office-convert): Converts over 40 office formats into web-viewable formats, ready to pair with Umo Office Viewer for seamless online document preview.

## Open Source License

Umo Editor is licensed under the [MIT License](https://github.com/umodoc/editor/raw/main/LICENSE). You are free to use, modify, and distribute this software, but this does **not** mean you are allowed to remove the copyright information at will. Please retain the Umo Editor copyright notice and the link displayed in the interface. Removal of these will be considered an infringement. We encourage you to support open-source projects.

If you do not wish to retain the copyright information, please contact us or consider purchasing the commercial version: [Umo Editor Next](https://dev.umodoc.com/en/docs/next).

This documentation is published under the [CC BY-NC-SA 4.0 DEED License](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en).
