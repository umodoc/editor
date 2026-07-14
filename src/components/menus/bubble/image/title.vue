<template>
  <menus-button
    ico="text-2"
    :text="t('bubbleMenu.image.title')"
    :menu-active="image?.attrs?.showTitle !== false"
    @menu-click="toggleTitle"
  />
</template>

<script setup>
import { nextTick } from 'vue'

import { NodeSelection } from '@tiptap/pm/state'
import { getSelectionNode } from '@/utils/selection'

const editor = inject('editor')

const image = computed(() => {
  if (!editor.value) {
    return null
  }
  const node = getSelectionNode(editor.value)
  return node?.type?.name === 'image' ? node : null
})

const getSelectedImagePos = () => {
  const editorInstance = editor.value
  if (!editorInstance) {
    return null
  }
  const { selection } = editorInstance.state
  if (
    selection instanceof NodeSelection &&
    selection.node?.type?.name === 'image'
  ) {
    return selection.from
  }
  const { $from } = selection
  const { depth: maxDepth } = $from
  for (let depth = maxDepth; depth > 0; depth -= 1) {
    const node = $from.node(depth)
    if (node?.type?.name === 'image') {
      return $from.before(depth)
    }
  }
  return null
}

const focusImageTitle = async (imagePos) => {
  if (typeof imagePos !== 'number') {
    return
  }
  await nextTick()
  requestAnimationFrame(() => {
    editor.value?.commands.focus(imagePos + 1)
  })
}

const toggleTitle = async () => {
  const editorInstance = editor.value
  if (!image.value || !editorInstance) {
    return
  }
  const showTitle = image.value.attrs.showTitle === false
  const imagePos = showTitle ? getSelectedImagePos() : null
  editorInstance.commands.updateAttributes(image.value.type, {
    showTitle,
  })
  if (showTitle) {
    await focusImageTitle(imagePos)
  }
}
</script>
