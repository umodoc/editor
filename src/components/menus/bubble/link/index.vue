<template>
  <div ref="linkBubbleRef" class="umo-editor-bubble-menu">
    <menus-bubble-link-open @hide-bubble="hideBubble" />
    <div class="umo-bubble-menu-divider"></div>
    <menus-bubble-link-edit
      ico="edit"
      @show-bubble="showBubble"
      @hide-bubble="hideBubble"
    />
    <menus-bubble-link-copy @hide-bubble="hideBubble" />
    <menus-bubble-link-unlink @hide-bubble="hideBubble" />
  </div>
</template>

<script setup lang="ts">
import tippy from 'tippy.js'

import MenusBubbleLinkCopy from './copy.vue'

const linkBubbleRef = $ref(null)
const container = inject('container')
const editor = inject('editor')
let tippyInstance: any = null

onMounted(() => {
  const { meta } = editor.value.storage.link
  const pageContainer = document.querySelector(
    `${container} .umo-zoomable-container`,
  )
  tippyInstance = tippy(meta.target, {
    trigger: 'click',
    placement: 'top-start',
    content: linkBubbleRef,
    interactive: true,
    allowHTML: true,
    zIndex: 110,
    appendTo: pageContainer!,
    onHide() {
      editor.value.storage.link.edit = false
      editor.value.storage.link.meta = {}
    },
  })
  tippyInstance.show()
})

const showBubble = () => {
  if (tippyInstance && !tippyInstance.state.isVisible) {
    tippyInstance.show()
  }
}

const hideBubble = () => {
  if (tippyInstance?.state.isVisible) {
    tippyInstance.hide()
  }
}

onUnmounted(() => {
  if (tippyInstance) {
    tippyInstance?.destroy()
    tippyInstance = null
    editor.value.storage.link.edit = false
    editor.value.storage.link.meta = {}
  }
})
</script>

<style lang="scss" scoped></style>
