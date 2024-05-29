<template>
  <template v-if="editor?.isActive('image')">
    <template v-if="!editor?.getAttributes('image').error">
      <menus-toolbar-base-align-left />
      <menus-toolbar-base-align-center />
      <menus-toolbar-base-align-right />
      <div class="divider"></div>
      <menus-bubble-image-flip />
      <menus-bubble-image-proportion />
      <menus-bubble-image-draggable />
      <menus-bubble-image-reset />
      <div class="divider"></div>
      <menus-bubble-image-remove-background
        v-if="
          editor?.getAttributes('image')?.type === 'image' ||
          ['image/png', 'image/jpeg'].includes(
            editor?.getAttributes('image')?.type,
          )
        "
      />
      <menus-bubble-image-preview
        v-if="editor?.getAttributes('image')?.type === 'image'"
      />
      <menus-bubble-image-download />
      <div class="divider"></div>
      <menus-bubble-image-edit />
    </template>
    <menus-bubble-node-delete />
  </template>
  <template
    v-else-if="
      editor?.isActive('video') ||
      editor?.isActive('audio') ||
      editor?.isActive('file') ||
      editor?.isActive('iframe')
    "
  >
    <menus-toolbar-base-align-left />
    <menus-toolbar-base-align-center />
    <menus-toolbar-base-align-right />
    <div class="divider"></div>
    <menus-bubble-file-download
      v-if="
        editor?.isActive('file') ||
        editor?.isActive('video') ||
        editor?.isActive('audio')
      "
    />
    <menus-bubble-node-delete />
  </template>
  <template v-else-if="editor?.isActive('table')">
    <menus-toolbar-table-cells-align />
    <menus-toolbar-table-cells-background />
    <!-- <menus-toolbar-table-border-color  /> -->
    <div class="divider"></div>
    <menus-toolbar-table-add-row-before />
    <menus-toolbar-table-add-row-after />
    <menus-toolbar-table-add-column-before />
    <menus-toolbar-table-add-column-after />
    <div class="divider"></div>
    <menus-toolbar-table-delete-row />
    <menus-toolbar-table-delete-column />
    <div class="divider"></div>
    <menus-toolbar-table-merge-cells />
    <menus-toolbar-table-split-cell />
    <div class="divider"></div>
    <menus-bubble-node-delete />
  </template>
  <template v-else-if="editor?.isActive('codeBlock')">
    <menus-bubble-code-languages />
    <menus-bubble-code-themes />
    <div class="divider"></div>
    <menus-bubble-code-line-numbers />
    <menus-bubble-code-word-wrap />
    <div class="divider"></div>
    <menus-bubble-code-copy />
    <menus-bubble-node-delete />
  </template>
  <template
    v-else-if="
      editor?.isActive('toc') ||
      editor?.isActive('pageBreak') ||
      editor?.isActive('horizontalRule')
    "
  >
    <menus-bubble-node-delete />
  </template>
  <template v-else>
    <menus-toolbar-base-font-size :select="false" />
    <div class="divider"></div>
    <menus-toolbar-base-bold />
    <menus-toolbar-base-italic />
    <menus-toolbar-base-underline />
    <menus-toolbar-base-strike />
    <div class="divider"></div>
    <menus-toolbar-base-align-dropdown />
    <div class="divider"></div>
    <menus-toolbar-base-color />
    <menus-toolbar-base-background-color />
    <menus-toolbar-base-highlight />
  </template>
</template>

<script setup>
const { editor } = useStore()
</script>

<style lang="less" scoped>
.divider {
  width: 1;
  border-right: solid 1px var(--umo-border-color-light);
  height: 16px;
  margin: 0 10px 0 5px;
}
</style>
