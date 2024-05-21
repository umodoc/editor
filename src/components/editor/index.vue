<template>
  <editor-content
    :spellcheck="options.document.enableSpellcheck && $document.spellcheck"
    class="editor-container"
    :class="{
      'show-line-number': page.showLineNumber,
    }"
    :editor="editor"
  />
  <template
    v-if="
      options.document.enableBubbleMenu &&
      $document.bubbleMenu &&
      editor &&
      !editorDestroyed
    "
  >
    <bubble-menu
      class="umo-editor-bubble-menu"
      :editor="editor"
      :tippy-options="{
        appendTo: 'parent',
        maxWidth: 480,
        zIndex: 99,
      }"
    >
      <editor-menus-bubble />
    </bubble-menu>
  </template>
</template>

<script setup>
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

// 基本
import FontFamily from '@tiptap/extension-font-family'
import FontSize from './extensions/font-size'
import Bold from '@tiptap/extension-bold'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Color from '@tiptap/extension-color'
import TextColor from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import BulletList from './extensions/bullet-list'
import OrderedList from './extensions/ordered-list'
import Indent from './extensions/indent'
import TextAlign from './extensions/text-align'
import NodeAlign from './extensions/node-align'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import LineHeight from './extensions/line-height'
import SearchReplace from '@sereneinserenade/tiptap-search-and-replace'

// 插入
import Link from '@tiptap/extension-link'
import Image from './extensions/image'
import Video from './extensions/video'
import Audio from './extensions/audio'
import File from './extensions/file'
import CodeBlock from './extensions/code-block'
import TextBox from './extensions/text-box'
import HorizontalRule from './extensions/horizontal-rule'
import Iframe from './extensions/iframe'
import Mathematics from '@tiptap-pro/extension-mathematics'

// 表格
import Table from '@tiptap/extension-table'
import TableCell from './extensions/table-cell'
import TableHeader from './extensions/table-header'
import TableRow from '@tiptap/extension-table-row'

// 页面
import PageBreak from './extensions/page-break'
import Toc from './extensions/toc'
import InvisibleCharacters, {
  HardBreakNode,
  ParagraphNode,
} from '@tiptap-pro/extension-invisible-characters'
import InvisibleNode from './extensions/invisible-node'

// 其他
import Selection from './extensions/selection'
import {
  TableOfContents,
  getHierarchicalIndexes,
} from '@tiptap-pro/extension-table-of-contents'
import Typography from '@tiptap/extension-typography'
import CharacterCount from '@tiptap/extension-character-count'
import FileHandler from './extensions/file-handler'
import Dropcursor from '@tiptap/extension-dropcursor'

import generateId from '@/utils/generate-id'

const {
  container,
  options,
  page,
  editor,
  tableOfContents,
  setEditor,
  editorDestroyed,
} = useStore()
const $document = useState('document')

let enableRules = true
if (!options.value.document.enableMarkdown || !$document.value.markdown) {
  enableRules = [Image, Mathematics, Typography]
}

const content = `<img type="image" src="https://editor.umodoc.com/images/logo.svg" width="440.5970149253732" height="82" left="0" top="0" draggable="false" rotatable="false" equalproportion="true" flipx="false" flipy="false" uploaded="false" error="false"><pre code="body {
  background-color: var(--umo-container-background);
  padding: 25px;
  box-sizing: border-box;
  margin: 0;
}
body.loading {
  overflow: hidden;
  position: relative;
  height: 100vh;
  padding: 0;
}
body.loading:after {
  content: '正在加载中...';
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
  background-color: var(--umo-container-background);
  z-index: 9999;
}
body.printing {
  padding: 0;
}

.ProseMirror {
  position: relative;
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: 'liga' 0;
}

/* 文档节点 */
.page-break {
  margin: 0 !important;
  height: 0 !important;
  overflow: hidden;
}
.Tiptap-invisible-character {
  display: none !important;
}
.ProseMirror-selectednode {
  background: none !important;
}
.hover-shadow {
  box-shadow: none !important;
}
.select-outline {
  outline: none !important;
}
.node-view .select-outline.code-block,
.node-view .select-outline.iframe {
  outline: solid 1px var(--umo-content-node-border) !important;
}
.node-view .code-block .show-toolbar {
  display: none !important;
}
.node-view .uploading {
  display: none !important;
}

/* 打印样式 */
.pagedjs_pages {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
}

@page {
  box-shadow:
    rgba(0, 0, 0, 0.06) 0px 0px 10px 0px,
    rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;
  /* pointer-events: none; */
  @bottom-center {
    content: '第 ' counter(page) ' 页 / 共 ' counter(pages) ' 页';
    font-size: 12px;
    color: #999;
  }
}

body.printing .pagedjs_page {
  box-shadow: none !important;
}" language="css" theme="light" linenumbers="true" wordwrap="false"></pre><h2 style="text-align: start; line-height: 2" id="c8h7an" data-toc-id="c8h7an"><b>基本介绍</b></h2><p style="text-align: start; line-height: 1.75rem">Umo Editor 是一个基于 <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://tiptap.dev/">Tiptap 无头编辑器</a> 的 Vue3 适合于国人使用的本土化开源文档编辑器。Umo Editor 提供完善的文档编辑能力，支持 Markdown 语法，支持基础的富文本编辑功能，支持多种插入多种格式的节点类型、提供了多种类型的实用工具，并支持设置页面的样式，支持导出多种类型的格式。</p><img type="image" src="https://editor.umodoc.com/images/umo-editor@2x.png" width="553" height="353" left="0" top="0" draggable="false" rotatable="false" equalproportion="true" flipx="false" flipy="false" uploaded="false" error="false"><p style="text-align: start; line-height: 1.75rem">作为一个独立的 Vue3 插件，Umo Editor 可以零配置轻松集成到各类 Vue3 项目中。</p><p style="text-align: start; line-height: 1.75rem">对于非 Vue3 项目，您可以通过 Iframe 将 Umo Editor 嵌入到您的项目中。</p><p style="text-align: start; line-height: 1.75rem"><a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://editor.umodoc.com/docs">开发文档</a> | <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://demo.umodoc.com/editor">在线演示</a> | <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://github.com/umodoc/editor">GitHub</a> | <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://gitee.com/umodoc/editor">码云(国内镜像)</a> | <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://www.npmjs.com/package/@umoteam/editor">NPM</a></p><h2 style="text-align: start; line-height: 2" id="mjmlek" data-toc-id="mjmlek"><b>在线体验</b></h2><p style="text-align: start; line-height: 1.75rem">访问 <a target="_blank" rel="noopener noreferrer nofollow" href="https://demo.umodoc.com/editor?pane=no">https://demo.umodoc.com/editor?pane=no</a> 快速体验。</p><h2 style="text-align: start; line-height: 2" id="hge2ug" data-toc-id="hge2ug"><b>开发文档</b></h2><p style="text-align: start; line-height: 1.75rem">请访问 <a target="_blank" rel="noopener noreferrer nofollow" href="https://editor.umodoc.com/docs">https://editor.umodoc.com/docs</a> 。</p><h2 style="text-align: start; line-height: 2" id="bxg0mz" data-toc-id="bxg0mz"><b>设计理念</b></h2><p style="text-align: start; line-height: 1.75rem">Umo Editor 的诞生，旨在解决 Web 应用中文档编辑的复杂性，为 Web 项目提供开源免费的类似 Office Word 的强大编辑能力和协同能力，同时保持 Web 应用的便捷性。无论是政企信息管理系统、学术研究撰写、团队文档协作、知识库管理还是个人笔记整理，Umo Editor 都能成为您得力的助手。</p><h2 style="text-align: start; line-height: 2" id="fh5gnr" data-toc-id="fh5gnr"><b>开源优势</b></h2><p style="text-align: start; line-height: 1.75rem"><b>免费使用</b>：作为开源项目，Umo Editor 基于 <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://github.com/umo-editor/umo-editor/blob/main/LICENSE">MIT 许可证</a> 对所有开发者免费开放，无需担心版权问题。</p><p style="text-align: start; line-height: 1.75rem"><b>持续更新</b>：Umo Editor 将持续迭代，不断优化功能，提升用户体验。</p><p style="text-align: start; line-height: 1.75rem"><b>定制化开发</b>：开源意味着更大的灵活性，开发者可根据项目需求进行定制化开发，打造专属的文档编辑器。</p><h2 style="text-align: start; line-height: 2" id="mbivv2" data-toc-id="mbivv2"><b>核心特性</b></h2><p style="text-align: start; line-height: 1.75rem"><b>Markdown 支持</b>：轻松编写，快速预览，Umo Editor 完美兼容 Markdown 语法，让文档撰写更加高效，当然您也可以禁用 Markdown 语法。</p><p style="text-align: start; line-height: 1.75rem"><b>富文本编辑</b>：提供基础的富文本编辑功能，包含几乎所有的富文本编辑功能，如标题、段落、列表、待办事项等，满足日常编辑需求。</p><p style="text-align: start; line-height: 1.75rem"><b>多样化节点类型</b>：支持插入多种格式的节点类型，如图片、表格、代码块、富媒体、文件、特殊符号、Emoji、数学公式、文本框、模板、网页等等多种类型的内容节点类型。</p><p style="text-align: start; line-height: 1.75rem"><b>实用工具集成</b>：内置多种实用工具，如二维码、条形码、电子签名、电子签章、流程图、Mermaid 图表、中英文大小写转换、拼写检查、字数统计等，提升编辑效率。</p><p style="text-align: start; line-height: 1.75rem"><b>页面样式定制</b>：允许用户根据个人喜好和业务需求，自定义页面样式，满足个性化编辑环境。</p><p style="text-align: start; line-height: 1.75rem"><b>多格式导出</b>：支持将文档导出为多种格式，方便文档分享与存档。</p><h2 style="text-align: start; line-height: 2" id="cfca81" data-toc-id="cfca81"><b>浏览器支持</b></h2><table style="minWidth: 75px"><colgroup><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><b>浏览器</b></p></th><th colspan="1" rowspan="1" data-align="center-middle"><p><b>版本</b></p></th><th colspan="1" rowspan="1" data-align="center-middle"><p><b>支持情况</b></p></th></tr><tr><td colspan="1" rowspan="1"><p>Chrome</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>最新版</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>Firefox</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>最新版</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>Safari</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>最新版</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>Edge</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>最新版</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>360 极速浏览器</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>最新版</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>各类国产浏览器的极速模式</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>最新版</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>IE (Internet Explorer)</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>所有</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>❌ 不支持</p></td></tr></tbody></table><h2 style="text-align: start; line-height: 2" id="ub2huz" data-toc-id="ub2huz"><b>加入社区</b></h2><p style="text-align: start; line-height: 1.75rem">我们鼓励用户加入 Umo Editor 的开源社区，共同参与到产品的开发和改进中来。无论是提交 Bug 报告、功能请求还是代码贡献，都是我们社区宝贵的一部分。</p><p style="text-align: start; line-height: 1.75rem">您可以通过 <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/discussions">https://github.com/umodoc/editor/discussions</a> 提交问题或意见。</p><p style="text-align: start; line-height: 1.75rem">或通过 <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/issues">https://github.com/umodoc/editor/issues</a> 提交 Bug 报告。</p><h2 style="text-align: start; line-height: 2" id="82cgjs" data-toc-id="82cgjs"><b>贡献代码</b></h2><p style="text-align: start; line-height: 1.75rem">我们欢迎任何形式的贡献，包括但不限于提交 Bug 报告、功能请求、代码贡献等。</p><h2 style="text-align: start; line-height: 2" id="e2kkz8" data-toc-id="e2kkz8"><b>联系我们</b></h2><p style="text-align: start; line-height: 1.75rem">如果您有任何疑问或建议，请通过以下方式联系我们，在此之前，建议您详细阅读本文档，以便您了解如何使用 Umo Editor。</p><ul style="list-style-type: disc"><li><p>反馈：<a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/issues">https://github.com/umodoc/editor/issues</a> | <a target="_blank" rel="noopener noreferrer nofollow" href="https://gitee.com/umodoc/editor/issues">https://gitee.com/umodoc/editor/issues</a></p></li><li><p>社区：<a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/discussions">https://github.com/umodoc/editor/discussions</a></p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="mailto:邮件：contact@umoteam.com">邮件：contact@umoteam.com</a></p></li></ul><h2 style="text-align: start; line-height: 2" id="iuhmql" data-toc-id="iuhmql"><b>支持我们</b></h2><p style="text-align: start; line-height: 1.75rem">如果您觉得 Umo Editor 有用，请考虑通过以下方式支持我们：</p><ul style="list-style-type: disc"><li><p>⭐ 给 <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://github.com/umodoc/editor">Umo Editor 仓库</a> 点个 Star，表示对项目的支持。</p></li><li><p>🔗 如果您在项目中使用了 Umo Editor，请添加一个链接到 <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor">https://github.com/umodoc/editor</a> 。</p></li></ul><h2 style="text-align: start; line-height: 2" id="u3pc4d" data-toc-id="u3pc4d"><b>定制开发</b></h2><p style="text-align: start; line-height: 1.75rem">如果您需要定制化开发，请联系我们，我们可以提供付费的定制化解决方案。</p><h2 style="text-align: start; line-height: 2" id="uir4dw" data-toc-id="uir4dw"><b>开源协议</b></h2><p style="text-align: start; line-height: 1.75rem">Umo Editor 采用 <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://github.com/umodoc/editor/blob/main/LICENSE">MIT 许可证</a>，您可以免费使用、修改和使用本软件。</p><p style="text-align: start; line-height: 1.75rem">本文档采用 <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans">CC BY-NC-SA 4.0 DEED 许可证</a> 发布。</p><img type="image" src="https://editor.umodoc.com/images/logo.svg" width="440.5970149253732" height="82" left="0" top="0" draggable="false" rotatable="false" equalproportion="true" flipx="false" flipy="false" uploaded="false" error="false"><p></p><h2 style="text-align: start; line-height: 2" id="sudmfv" data-toc-id="sudmfv"><b>基本介绍</b></h2><p style="text-align: start; line-height: 1.75rem">Umo Editor 是一个基于 <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://tiptap.dev/">Tiptap 无头编辑器</a> 的 Vue3 适合于国人使用的本土化开源文档编辑器。Umo Editor 提供完善的文档编辑能力，支持 Markdown 语法，支持基础的富文本编辑功能，支持多种插入多种格式的节点类型、提供了多种类型的实用工具，并支持设置页面的样式，支持导出多种类型的格式。</p><img type="image" src="https://editor.umodoc.com/images/umo-editor@2x.png" width="553" height="353" left="0" top="0" draggable="false" rotatable="false" equalproportion="true" flipx="false" flipy="false" uploaded="false" error="false"><p style="text-align: start; line-height: 1.75rem">作为一个独立的 Vue3 插件，Umo Editor 可以零配置轻松集成到各类 Vue3 项目中。</p><p style="text-align: start; line-height: 1.75rem">对于非 Vue3 项目，您可以通过 Iframe 将 Umo Editor 嵌入到您的项目中。</p><p style="text-align: start; line-height: 1.75rem"><a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://editor.umodoc.com/docs">开发文档</a> | <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://demo.umodoc.com/editor">在线演示</a> | <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://github.com/umodoc/editor">GitHub</a> | <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://gitee.com/umodoc/editor">码云(国内镜像)</a> | <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://www.npmjs.com/package/@umoteam/editor">NPM</a></p><h2 style="text-align: start; line-height: 2" id="8eglea" data-toc-id="8eglea"><b>在线体验</b></h2><p style="text-align: start; line-height: 1.75rem">访问 <a target="_blank" rel="noopener noreferrer nofollow" href="https://demo.umodoc.com/editor?pane=no">https://demo.umodoc.com/editor?pane=no</a> 快速体验。</p><h2 style="text-align: start; line-height: 2" id="elcwuf" data-toc-id="elcwuf"><b>开发文档</b></h2><p style="text-align: start; line-height: 1.75rem">请访问 <a target="_blank" rel="noopener noreferrer nofollow" href="https://editor.umodoc.com/docs">https://editor.umodoc.com/docs</a> 。</p><h2 style="text-align: start; line-height: 2" id="4wx2b0" data-toc-id="4wx2b0"><b>设计理念</b></h2><p style="text-align: start; line-height: 1.75rem">Umo Editor 的诞生，旨在解决 Web 应用中文档编辑的复杂性，为 Web 项目提供开源免费的类似 Office Word 的强大编辑能力和协同能力，同时保持 Web 应用的便捷性。无论是政企信息管理系统、学术研究撰写、团队文档协作、知识库管理还是个人笔记整理，Umo Editor 都能成为您得力的助手。</p><h2 style="text-align: start; line-height: 2" id="tnjlz8" data-toc-id="tnjlz8"><b>开源优势</b></h2><p style="text-align: start; line-height: 1.75rem"><b>免费使用</b>：作为开源项目，Umo Editor 基于 <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://github.com/umo-editor/umo-editor/blob/main/LICENSE">MIT 许可证</a> 对所有开发者免费开放，无需担心版权问题。</p><p style="text-align: start; line-height: 1.75rem"><b>持续更新</b>：Umo Editor 将持续迭代，不断优化功能，提升用户体验。</p><p style="text-align: start; line-height: 1.75rem"><b>定制化开发</b>：开源意味着更大的灵活性，开发者可根据项目需求进行定制化开发，打造专属的文档编辑器。</p><h2 style="text-align: start; line-height: 2" id="9wsxw5" data-toc-id="9wsxw5"><b>核心特性</b></h2><p style="text-align: start; line-height: 1.75rem"><b>Markdown 支持</b>：轻松编写，快速预览，Umo Editor 完美兼容 Markdown 语法，让文档撰写更加高效，当然您也可以禁用 Markdown 语法。</p><p style="text-align: start; line-height: 1.75rem"><b>富文本编辑</b>：提供基础的富文本编辑功能，包含几乎所有的富文本编辑功能，如标题、段落、列表、待办事项等，满足日常编辑需求。</p><p style="text-align: start; line-height: 1.75rem"><b>多样化节点类型</b>：支持插入多种格式的节点类型，如图片、表格、代码块、富媒体、文件、特殊符号、Emoji、数学公式、文本框、模板、网页等等多种类型的内容节点类型。</p><p style="text-align: start; line-height: 1.75rem"><b>实用工具集成</b>：内置多种实用工具，如二维码、条形码、电子签名、电子签章、流程图、Mermaid 图表、中英文大小写转换、拼写检查、字数统计等，提升编辑效率。</p><p style="text-align: start; line-height: 1.75rem"><b>页面样式定制</b>：允许用户根据个人喜好和业务需求，自定义页面样式，满足个性化编辑环境。</p><p style="text-align: start; line-height: 1.75rem"><b>多格式导出</b>：支持将文档导出为多种格式，方便文档分享与存档。</p><h2 style="text-align: start; line-height: 2" id="vfrjlb" data-toc-id="vfrjlb"><b>浏览器支持</b></h2><table style="minWidth: 75px"><colgroup><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><b>浏览器</b></p></th><th colspan="1" rowspan="1" data-align="center-middle"><p><b>版本</b></p></th><th colspan="1" rowspan="1" data-align="center-middle"><p><b>支持情况</b></p></th></tr><tr><td colspan="1" rowspan="1"><p>Chrome</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>最新版</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>Firefox</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>最新版</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>Safari</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>最新版</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>Edge</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>最新版</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>360 极速浏览器</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>最新版</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>各类国产浏览器的极速模式</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>最新版</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>IE (Internet Explorer)</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>所有</p></td><td colspan="1" rowspan="1" data-align="center-middle"><p>❌ 不支持</p></td></tr></tbody></table><h2 style="text-align: start; line-height: 2" id="646vsr" data-toc-id="646vsr"><b>加入社区</b></h2><p style="text-align: start; line-height: 1.75rem">我们鼓励用户加入 Umo Editor 的开源社区，共同参与到产品的开发和改进中来。无论是提交 Bug 报告、功能请求还是代码贡献，都是我们社区宝贵的一部分。</p><p style="text-align: start; line-height: 1.75rem">您可以通过 <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/discussions">https://github.com/umodoc/editor/discussions</a> 提交问题或意见。</p><p style="text-align: start; line-height: 1.75rem">或通过 <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/issues">https://github.com/umodoc/editor/issues</a> 提交 Bug 报告。</p><h2 style="text-align: start; line-height: 2" id="tj5yhm" data-toc-id="tj5yhm"><b>贡献代码</b></h2><p style="text-align: start; line-height: 1.75rem">我们欢迎任何形式的贡献，包括但不限于提交 Bug 报告、功能请求、代码贡献等。</p><h2 style="text-align: start; line-height: 2" id="dxln4i" data-toc-id="dxln4i"><b>联系我们</b></h2><p style="text-align: start; line-height: 1.75rem">如果您有任何疑问或建议，请通过以下方式联系我们，在此之前，建议您详细阅读本文档，以便您了解如何使用 Umo Editor。</p><ul style="list-style-type: disc"><li><p>反馈：<a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/issues">https://github.com/umodoc/editor/issues</a> | <a target="_blank" rel="noopener noreferrer nofollow" href="https://gitee.com/umodoc/editor/issues">https://gitee.com/umodoc/editor/issues</a></p></li><li><p>社区：<a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/discussions">https://github.com/umodoc/editor/discussions</a></p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="mailto:邮件：contact@umoteam.com">邮件：contact@umoteam.com</a></p></li></ul><h2 style="text-align: start; line-height: 2" id="26h2uu" data-toc-id="26h2uu"><b>支持我们</b></h2><p style="text-align: start; line-height: 1.75rem">如果您觉得 Umo Editor 有用，请考虑通过以下方式支持我们：</p><ul style="list-style-type: disc"><li><p>⭐ 给 <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://github.com/umodoc/editor">Umo Editor 仓库</a> 点个 Star，表示对项目的支持。</p></li><li><p>🔗 如果您在项目中使用了 Umo Editor，请添加一个链接到 <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor">https://github.com/umodoc/editor</a> 。</p></li></ul><h2 style="text-align: start; line-height: 2" id="xx7azn" data-toc-id="xx7azn"><b>定制开发</b></h2><p style="text-align: start; line-height: 1.75rem">如果您需要定制化开发，请联系我们，我们可以提供付费的定制化解决方案。</p><h2 style="text-align: start; line-height: 2" id="u7rau7" data-toc-id="u7rau7"><b>开源协议</b></h2><p style="text-align: start; line-height: 1.75rem">Umo Editor 采用 <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://github.com/umodoc/editor/blob/main/LICENSE">MIT 许可证</a>，您可以免费使用、修改和使用本软件。</p><p style="text-align: start; line-height: 1.75rem">本文档采用 <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans">CC BY-NC-SA 4.0 DEED 许可证</a> 发布。</p>`

const editorInstance = new Editor({
  editable: !options.value.document.readOnly,
  autofocus: options.value.document.autofocus,
  // content: options.value.document.content,
  content: content,
  enableInputRules: enableRules,
  enablePasteRules: enableRules,
  editorProps: {
    attributes: {
      class: 'umo-editor',
    },
  },
  extensions: [
    StarterKit.configure({
      bold: false,
      bulletList: false,
      orderedList: false,
      codeBlock: false,
      horizontalRule: false,
      gapcursor: true,
      dropcursor: false,
    }),
    Placeholder.configure({
      considerAnyAsEmpty: true,
      placeholder: options.value.document.placeholder,
    }),
    FontFamily,
    FontSize,
    Bold.extend({
      renderHTML: ({ HTMLAttributes }) => ['b', HTMLAttributes, 0],
    }),
    Underline,
    Subscript,
    Superscript,
    Color,
    TextColor,
    Highlight.configure({
      multicolor: true,
    }),
    BulletList,
    OrderedList,
    Indent,
    TextAlign,
    NodeAlign,
    TaskItem.configure({ nested: true }),
    TaskList.configure({
      HTMLAttributes: {
        class: 'task-list',
      },
    }),
    LineHeight.configure({
      types: ['heading', 'paragraph'],
      defaultLineHeight: options.value.dicts.lineHeights.find(
        (item) => item.default,
      ).value,
    }),
    SearchReplace,

    Link,
    Image,
    Video,
    Audio,
    File,
    TextBox,
    CodeBlock,
    HorizontalRule,
    Iframe,
    Mathematics,

    // 表格
    Table.configure({
      resizable: true,
      allowTableNodeSelection: true,
    }),
    TableRow,
    TableHeader,
    TableCell,

    // 页面
    Toc,
    PageBreak,
    InvisibleCharacters.configure({
      visible: page.value.showBreakMarks,
      builders: [new HardBreakNode(), new ParagraphNode(), new InvisibleNode()],
    }),

    // 其他
    Selection,
    TableOfContents.configure({
      getIndex: getHierarchicalIndexes,
      onUpdate: (content) => (tableOfContents.value = content),
      scrollParent: document.querySelector(`${container} .toc-content`),
      getId: () => generateId(6),
    }),
    Typography.configure(options.value.document.typographyRules),
    CharacterCount.configure({
      limit:
        options.value.document.characterLimit !== 0
          ? options.value.document.characterLimit
          : undefined,
    }),
    FileHandler.configure({
      allowedMimeTypes: options.value.file.allowedMimeTypes,
      onPaste(editor, files, html) {
        files.forEach((file) =>
          editor.chain().focus().insertFile({ file }).run(),
        )
      },
      onDrop: (editor, files, pos) => {
        files.forEach((file) =>
          editor.chain().focus().insertFile({ file, pos }).run(),
        )
      },
    }),
    Dropcursor.configure({
      color: 'var(--umo-primary-color)',
    }),
  ],
  onUpdate({ editor }) {
    $document.value.content = editor.getHTML()
  },
})
setEditor(editorInstance)

// 销毁编辑器实例
onBeforeUnmount(() => editorInstance.destroy())
</script>

<style lang="less">
@import '@/assets/styles/editor.less';
@import '@/assets/styles/drager.less';

.umo-editor-bubble-menu {
  padding: 8px 10px;
  box-shadow: var(--umo-shadow);
  border: 0.5px solid var(--umo-border-color-dark);
  border-radius: var(--umo-radius);
  display: flex;
  align-items: center;
  background-color: var(--umo-color-white);
  flex-wrap: wrap;

  .button-text {
    display: none !important;
  }
}
</style>
