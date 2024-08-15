<template>
  <t-dropdown
    :attach="`${container} .page-container`"
    placement="bottom-right"
    overlay-class-name="block-menu-dropdown"
    trigger="click"
    :destroy-on-close="false"
    :popup-props="{
      onVisibleChange(visible) {
        editor.commands.focus()
        blockMenu = visible
        menuActive = visible
      },
    }"
  >
    <menus-button
      class="block-menu-button"
      :menu-active="menuActive"
      ico="block-menu"
      hide-text
    />
    <t-dropdown-menu>
      <t-dropdown-item class="block-menu-group-name" disabled>
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
      <t-dropdown-item class="delete-node">
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

<script setup>
import getId from '@/utils/short-id'

const { container, editor, blockMenu } = useStore()

let menuActive = $ref(false)

const clearTextFormatting = () => {
  editor.value.chain().focus().setCurrentNodeSelection().unsetAllMarks().run()
}
const copyNodeToClipboard = () => {
  editor.value.commands.setCurrentNodeSelection()
  document.execCommand('copy')
}
const cutNodeToClipboard = () => {
  editor.value.commands.setCurrentNodeSelection()
  document.execCommand('cut')
}
const duplicateNode = () => {
  const selectionNode = editor.value.commands.getSelectionNode()
  const getPosition = () => {
    let point = 0
    editor.value.state.doc.descendants((node, pos) => {
      if (node == selectionNode) {
        point = pos + node.nodeSize // 返回节点结束位置
      }
    })
    return point
  }
  const copeNode = selectionNode.type.create(
    {
      ...selectionNode.attrs,
      id: getId(),
    },
    selectionNode.content,
    selectionNode.marks,
  )
  if (selectionNode.type.name == 'image') {
    editor.value.commands.autoPaging(false)
  }
  editor.value.commands.insertContentAt(getPosition(), copeNode.toJSON())
}
const deleteNode = () => {
  editor.value?.chain().focus().deleteSelectionNode().run()
}
</script>

<style lang="less" scoped></style>
