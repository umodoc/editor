<template>
  <div class="box">
    <umo-editor ref="editorRef" v-bind="options" />
  </div>
</template>

<script setup lang="ts">
import { shortId } from '@/utils/short-id'

// import { UmoEditor } from '../dist/umo-editor'

const editorRef = $ref(null)
const templates = [
  {
    title: '工作任务',
    description: '工作任务模板',
    content:
      '<h1>工作任务</h1><h3>任务名称：</h3><p>[任务的简短描述]</p><h3>负责人：</h3><p>[执行任务的个人姓名]</p><h3>截止日期：</h3><p>[任务需要完成的日期]</p><h3>任务详情：</h3><ol><li>[任务步骤1]</li><li>[任务步骤2]</li><li>[任务步骤3]...</li></ol><h3>目标：</h3><p>[任务需要达成的具体目标或结果]</p><h3>备注：</h3><p>[任何额外信息或注意事项]</p>',
  },
  {
    title: '工作周报',
    description: '工作周报模板',
    content:
      '<h1>工作周报</h1><h2>本周工作总结</h2><hr /><h3>已完成工作：</h3><ul><li>[任务1名称]：[简要描述任务内容及完成情况]</li><li>[任务2名称]：[简要描述任务内容及完成情况]</li><li>...</li></ul><h3>进行中工作：</h3><ul><li>[任务1名称]：[简要描述任务当前进度和下一步计划]</li><li>[任务2名称]：[简要描述任务当前进度和下一步计划]</li><li>...</li></ul><h3>问题与挑战：</h3><ul><li>[问题1]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>[问题2]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>...</li></ul><hr /><h2>下周工作计划</h2><h3>计划开展工作：</h3><ul><li>[任务1名称]：[简要描述下周计划开始的任务内容]</li><li>[任务2名称]：[简要描述下周计划开始的任务内容]</li><li>...</li></ul><h3>需要支持与资源：</h3><ul><li>[资源1]：[描述需要的资源或支持]</li><li>[资源2]：[描述需要的资源或支持]</li><li>...</li></ul>',
  },
]
const options = $ref({
  toolbar: {
    // defaultMode: 'classic',
    // menus: ['base'],
    enableSourceEditor: true,
  },
  document: {
    // title: '测试文档',
    content:
      '<img style="margin-top: 30px;margin-bottom: 30px;" id="oztu348e" extend="false" vnode="true" type="image" src="https://editor.umodoc.com/images/logo.svg" width="381" height="71" left="0" top="0" draggable="false" rotatable="false" equalproportion="true" flipx="false" flipy="false" uploaded="false" error="false"><h2 style="line-height: 2" id="85l9io" data-toc-id="85l9io"><b>基本介绍</b></h2><p style="line-height: 1.75rem">Umo Editor 是一个基于 Vue3 和 Tiptap 的适合于国人使用的本土化开源文档编辑器。Umo Editor 提供完善的文档编辑能力和 AI 创作能力，支持分页，支持 Markdown 语法，支持基础的富文本编辑功能，支持多种插入多种格式的节点类型、提供了多种类型的实用工具，并支持设置页面的样式，支持导出多种类型的格式，支持打印和打印预览，支持文档块编辑，支持添加自定义扩展，支持多语言设置，支持暗色主题。</p><img type="image" src="https://editor.umodoc.com/images/umo-editor@2x.png" width="553" height="421" left="0" top="0" draggable="false" rotatable="false" equalproportion="true" flipx="false" flipy="false" uploaded="false" error="false"><p style="line-height: 1.75rem">作为一个独立的 Vue3 插件，Umo Editor 可以零配置轻松集成到各类 Vue3 项目中，对于非 Vue3 项目，您可以通过 Iframe 将 Umo Editor 嵌入到您的项目中。</p><p style="line-height: 1.75rem"><a target="_blank" rel="noreferrer" href="https://editor.umodoc.com/docs">开发文档</a> | <a target="_blank" rel="noreferrer" href="https://demo.umodoc.com/editor">在线演示</a> | <a target="_blank" rel="noreferrer" href="https://github.com/umodoc/editor">GitHub</a> | <a target="_blank" rel="noreferrer" href="https://gitee.com/umodoc/editor">码云(国内镜像)</a> | <a target="_blank" rel="noreferrer" href="https://www.npmjs.com/package/@umoteam/editor">NPM</a></p><h2 style="line-height: 2" id="51iw3u" data-toc-id="51iw3u"><b>在线体验</b></h2><p style="line-height: 1.75rem">访问 <a target="_blank" rel="noopener noreferrer nofollow" href="https://demo.umodoc.com/editor?pane=hide">https://demo.umodoc.com/editor?pane=hide</a> 快速体验。</p><h2 style="line-height: 2" id="3t5soy" data-toc-id="3t5soy"><b>开发文档</b></h2><p style="line-height: 1.75rem">请访问 <a target="_blank" rel="noopener noreferrer nofollow" href="https://editor.umodoc.com/docs">https://editor.umodoc.com/docs</a> 。</p><h2 style="line-height: 2" id="fgb3fr" data-toc-id="fgb3fr"><b>设计理念</b></h2><p style="line-height: 1.75rem">Umo Editor 的诞生，旨在解决 Web 应用中文档编辑的复杂性，为 Web 项目提供开源免费的类似 Microsoft Word 的强大编辑能力和分页模式，同时保持 Web 应用的便捷性。无论是政企信息管理系统、学术研究撰写、团队文档协作、知识库管理还是个人笔记整理，Umo Editor 都能成为您得力的助手。</p><h2 style="line-height: 2" id="wv3owd" data-toc-id="wv3owd"><b>开源优势</b></h2><ul style="list-style-type: disc"><li><p style="line-height: 1.75rem"><b>免费使用</b>：作为开源项目，Umo Editor 基于 <a target="_blank" rel="noreferrer" href="https://github.com/umo-editor/umo-editor/blob/main/LICENSE">MIT 许可证</a> 对所有开发者免费开放，无需担心版权问题。</p></li><li><p style="line-height: 1.75rem"><b>持续更新</b>：Umo Editor 将持续迭代，不断优化功能，提升用户体验。</p></li><li><p style="line-height: 1.75rem"><b>定制化开发</b>：开源意味着更大的灵活性，开发者可根据项目需求进行定制化开发，打造专属的文档编辑器。</p></li></ul><h2 style="line-height: 2" id="enrnmz" data-toc-id="enrnmz"><b>核心特性</b></h2><ul style="list-style-type: disc"><li><p>零配置开箱即用</p></li><li><p>类似于与 Microsoft Word 的分页模式</p></li><li><p>轻量级</p></li><li><p>支持自定义扩展</p></li><li><p>全过程所见即所得</p></li><li><p>富文本编辑功能</p></li><li><p>Markdown 语法支持</p></li><li><p>实用工具集成</p></li><li><p>演示模式</p></li><li><p>文档导出与分享</p></li><li><p>页面设置</p></li><li><p>AI 文档助手</p></li><li><p>支持打印及打印预览</p></li><li><p>气泡菜单与块级菜单</p></li><li><p>快捷键支持</p></li><li><p>主题定制</p></li><li><p>多语言支持</p></li><li><p>暗色主题</p></li></ul><p style="line-height: 1.75rem">更多详细介绍见 <a target="_blank" rel="noopener noreferrer nofollow" href="https://editor.umodoc.com/docs/features">核心特性</a>。</p><h2 style="line-height: 2" id="f5b8vq" data-toc-id="f5b8vq"><b>浏览器支持</b></h2><table style="minWidth: 75px"><colgroup><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><b>浏览器</b></p></th><th colspan="1" rowspan="1"><p><b>版本</b></p></th><th colspan="1" rowspan="1"><p><b>支持情况</b></p></th></tr><tr><td colspan="1" rowspan="1"><p>Google Chrome</p></td><td colspan="1" rowspan="1"><p>最新版</p></td><td colspan="1" rowspan="1"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>Firefox</p></td><td colspan="1" rowspan="1"><p>最新版</p></td><td colspan="1" rowspan="1"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>Safari</p></td><td colspan="1" rowspan="1"><p>最新版</p></td><td colspan="1" rowspan="1"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>Microsoft Edge</p></td><td colspan="1" rowspan="1"><p>最新版</p></td><td colspan="1" rowspan="1"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>360 极速浏览器</p></td><td colspan="1" rowspan="1"><p>最新版</p></td><td colspan="1" rowspan="1"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>各类国产浏览器的极速模式</p></td><td colspan="1" rowspan="1"><p>最新版</p></td><td colspan="1" rowspan="1"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>Internet Explorer (IE)</p></td><td colspan="1" rowspan="1"><p>所有</p></td><td colspan="1" rowspan="1"><p>❌ 不支持</p></td></tr></tbody></table><h2 style="line-height: 2" id="bhgzg4" data-toc-id="bhgzg4"><b>Nodejs 版本支持</b></h2><p style="line-height: 1.75rem">Nodejs 18.0.0 及以上版本。</p><h2 style="line-height: 2" id="2eky6x" data-toc-id="2eky6x"><b>加入社区</b></h2><p style="line-height: 1.75rem">我们鼓励用户加入 Umo Editor 的开源社区，共同参与到产品的开发和改进中来。无论是提交 Bug 报告、功能请求还是代码贡献，都是我们社区宝贵的一部分。</p><p style="line-height: 1.75rem">您可以通过 <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/discussions">https://github.com/umodoc/editor/discussions</a> 提交问题或意见。</p><p style="line-height: 1.75rem">或通过 <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/issues">https://github.com/umodoc/editor/issues</a> 提交 Bug 报告。</p><h2 style="line-height: 2" id="c3nctg" data-toc-id="c3nctg"><b>贡献代码</b></h2><p style="line-height: 1.75rem">Umo Editor 的发展，离不开社区的支持，以下是为 Umo Editor 贡献过代码的贡献者名单，向他们致谢：</p><ul style="list-style-type: disc"><li><p><a href="https://github.com/umodoc" target="_blank">Umo Team</a>: 👨‍💻 核心开发者</p></li><li><p><a href="https://github.com/Cassielxd" target="_blank">Cassielxd</a>: 💪🏻 为 Umo Editor 实现了分页和很多重要的功能</p></li><li><p><a href="https://github.com/xuzhenjun130" target="_blank">Sherman Xu</a>: 🛠️ 为 Umo Editor 贡献了部分代码</p></li></ul><p style="line-height: 1.75rem">我们欢迎任何形式的贡献，包括但不限于提交 Bug 报告、功能请求、代码贡献等。</p><h2 style="line-height: 2" id="sxtgyp" data-toc-id="sxtgyp"><b>联系我们</b></h2><p style="line-height: 1.75rem">如果您有任何疑问或建议，请通过以下方式联系我们，在此之前，建议您详细阅读本文档，以便您了解如何使用 Umo Editor。</p><ul style="list-style-type: disc"><li><p>反馈：<a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/issues">https://github.com/umodoc/editor/issues</a> | <a target="_blank" rel="noopener noreferrer nofollow" href="https://gitee.com/umodoc/editor/issues">https://gitee.com/umodoc/editor/issues</a></p></li><li><p>社区：<a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/discussions">https://github.com/umodoc/editor/discussions</a></p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="mailto:邮件：contact@umoteam.com">邮件：contact@umoteam.com</a></p></li></ul><h2 style="line-height: 2" id="i78zf1" data-toc-id="i78zf1"><b>支持我们</b></h2><p style="line-height: 1.75rem">如果您觉得 Umo Editor 有用，请考虑通过以下方式支持我们：</p><ul style="list-style-type: disc"><li><p>⭐ 给 <a target="_blank" rel="noreferrer" href="https://github.com/umodoc/editor">Umo Editor 仓库</a> 点个 Star，表示对项目的支持。</p></li><li><p>🔗 如果您在项目中使用了 Umo Editor，请添加一个链接到 <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor">https://github.com/umodoc/editor</a> 。</p></li></ul><h2 style="line-height: 2" id="55qdrs" data-toc-id="55qdrs"><b>定制开发</b></h2><p style="line-height: 1.75rem">如果您需要定制化开发，请联系我们，我们可以提供付费的定制化解决方案。</p><h2 style="line-height: 2" id="i5k15f" data-toc-id="i5k15f"><b>开源协议</b></h2><p style="line-height: 1.75rem">Umo Editor 采用 <a target="_blank" rel="noreferrer" href="https://github.com/umodoc/editor/blob/main/LICENSE">MIT 许可证</a>，您可以免费使用、修改和使用本软件。</p><p style="line-height: 1.75rem">本文档采用 <a target="_blank" rel="noreferrer" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans">CC BY-NC-SA 4.0 DEED 许可证</a> 发布。</p>',
  },
  templates,
  cdnUrl: 'https://cdn.umodoc.com',
  shareUrl: 'https://umodoc.com',
  file: {
    // allowedMimeTypes: [
    //   'application/pdf',
    //   'image/svg+xml',
    //   'video/mp4',
    //   'audio/*',
    // ],
  },
  assistant: {
    enabled: true,
  },
  user: {
    userId: 'umoeditor',
    nickName: 'Umo Editor',
    avatarUrl: 'https://tdesign.gtimg.com/site/avatar.jpg',
  },
  async onSave(content: string, page: number, document: { content: string }) {
    localStorage.setItem('document.content', document.content)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = true
        if (success) {
          console.log('onSave', { content, page, document })
          resolve('操作成功')
        } else {
          reject(new Error('操作失败'))
        }
      }, 2000)
    })
  },
  async onFileUpload(file: File & { url?: string }) {
    if (!file) {
      throw new Error('没有找到要上传的文件')
    }
    console.log('onUpload', file)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return {
      id: shortId(),
      url: file.url ?? URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
    }
  },
  async onAssistant() {
    return await Promise.resolve('<p>AI助手测试</p>')
  },
  async onCustomImportWordMethod() {
    return await Promise.resolve({
      value: '<p>测试导入word</p>',
    })
  },
})
</script>

<style>
.box {
  margin: 20px;
  height: calc(100vh - 40px);
  border: solid 1px #ddd;
  box-sizing: border-box;
  position: relative;
}

html,
body {
  height: 100vh;
  overflow: hidden;
}
</style>
