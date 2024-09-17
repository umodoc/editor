<template>
  <t-dropdown
    :attach="`${container} .umo-page-container`"
    placement="bottom-right"
    overlay-class-name="umo-block-menu-dropdown"
    trigger="click"
    :destroy-on-close="false"
    :popup-props="popupProps"
  >
    <menus-button
      class="umo-block-menu-button"
      :menu-active="menuActive"
      ico="block-menu"
      hide-text
    />
    <t-dropdown-menu>
      <t-dropdown-item class="umo-block-menu-group-name" disabled>
        {{ t('blockMenu.common') }}
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-button
          ico="node-clear-format"
          :text="t('blockMenu.clearFormat')"
          :tooltip="false"
          @menu-click="clearTextFormatting"
        />
      </t-dropdown-item>
      <t-dropdown-item divider>
        <menus-button
          ico="node-duplicate"
          :text="t('blockMenu.duplicate')"
          :tooltip="false"
          @menu-click="duplicateNode"
        />
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-button
          ico="node-copy"
          :text="t('blockMenu.copy')"
          :tooltip="false"
          @menu-click="copyNodeToClipboard"
        />
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-button
          ico="node-cut"
          :text="t('blockMenu.cut')"
          :tooltip="false"
          @menu-click="cutNodeToClipboard"
        />
      </t-dropdown-item>
      <t-dropdown-item class="umo-delete-node">
        <menus-button
          ico="node-delete-2"
          :text="t('blockMenu.delete')"
          :tooltip="false"
          @menu-click="deleteNode"
        />
      </t-dropdown-item>
    </t-dropdown-menu>
  </t-dropdown>
</template>

<script setup lang="ts">
import type { Node } from '@tiptap/pm/model'

import { getSelectionNode } from '@/extensions/selection'
import { shortId } from '@/utils/short-id'

const { container, editor, blockMenu } = useStore()

let menuActive = $ref(false)

const popupProps = {
  onVisibleChange(visible: boolean) {
    editor.value.commands.focus()
    blockMenu.value = visible
    menuActive = visible
  },
}

const clearTextFormatting = () => {
  editor.value?.chain().focus().setCurrentNodeSelection().unsetAllMarks().run()
}
const copyNodeToClipboard = () => {
  editor.value?.commands.setCurrentNodeSelection()
  document.execCommand('copy')
}
const cutNodeToClipboard = () => {
  editor.value?.commands.setCurrentNodeSelection()
  document.execCommand('cut')
}
const duplicateNode = () => {
  const selectionNode = editor.value ? getSelectionNode(editor.value) : null
  const getPosition = () => {
    let point = 0
    editor.value?.state.doc.descendants((node: Node, pos: number) => {
      if (node === selectionNode) {
        point = pos + node.nodeSize // 返回节点结束位置
      }
    })
    return point
  }
  const copeNode = selectionNode?.type.create(
    {
      ...selectionNode.attrs,
      id: shortId(),
    },
    selectionNode.content,
    selectionNode.marks,
  )
  editor.value?.commands.insertContentAt(getPosition(), copeNode?.toJSON())
}
const deleteNode = () => {
  editor.value?.chain().focus().deleteSelectionNode().run()
}
</script>

<style lang="less" scoped></style>
