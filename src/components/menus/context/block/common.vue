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
  editor.value.commands.setCurrentNodeSelection()
  const { $anchor, node } = editor.value.state.selection
  const selectionNode = $anchor.node(1) || node
  editor.value
    .chain()
    .insertContentAt(
      $anchor.pos + selectionNode.nodeSize - $anchor.depth,
      selectionNode.toJSON(),
    )
    .run()
}
const deleteNode = () => {
  editor.value?.chain().focus().deleteSelectionNode().run()
}
</script>

<style lang="less" scoped></style>
