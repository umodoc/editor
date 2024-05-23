<template>
  <template v-if="editor?.isActive('image')">
    <template v-if="!editor?.getAttributes('image').error">
      <editor-menus-base-align-left />
      <editor-menus-base-align-center />
      <editor-menus-base-align-right />
      <div class="divider"></div>
      <editor-menus-bubble-image-flip />
      <editor-menus-bubble-image-proportion />
      <editor-menus-bubble-image-draggable />
      <editor-menus-bubble-image-reset />
      <div class="divider"></div>
      <editor-menus-bubble-image-remove-background
        v-if="
          editor?.getAttributes('image')?.type === 'image' ||
          ['image/png', 'image/jpeg'].includes(
            editor?.getAttributes('image')?.type,
          )
        "
      />
      <editor-menus-bubble-image-preview
        v-if="editor?.getAttributes('image')?.type === 'image'"
      />
      <editor-menus-bubble-image-download />
      <div class="divider"></div>
      <editor-menus-bubble-image-edit />
    </template>
    <editor-menus-bubble-node-delete />
  </template>
  <template
    v-else-if="
      editor?.isActive('video') ||
      editor?.isActive('audio') ||
      editor?.isActive('file') ||
      editor?.isActive('iframe')
    "
  >
    <editor-menus-base-align-left />
    <editor-menus-base-align-center />
    <editor-menus-base-align-right />
    <div class="divider"></div>
    <editor-menus-bubble-file-download
      v-if="
        editor?.isActive('file') ||
        editor?.isActive('video') ||
        editor?.isActive('audio')
      "
    />
    <editor-menus-bubble-node-delete />
  </template>
  <template v-else-if="editor?.isActive('table')">
    <editor-menus-table-cells-align :huge-button="false" />
    <editor-menus-table-cells-background :huge-button="false" />
    <!-- <editor-menus-table-border-color :huge-button="false" /> -->
    <div class="divider"></div>
    <editor-menus-table-add-row-before />
    <editor-menus-table-add-row-after />
    <editor-menus-table-add-column-before />
    <editor-menus-table-add-column-after />
    <div class="divider"></div>
    <editor-menus-table-delete-row />
    <editor-menus-table-delete-column />
    <div class="divider"></div>
    <editor-menus-table-merge-cells />
    <editor-menus-table-split-cell />
    <div class="divider"></div>
    <editor-menus-bubble-node-delete />
  </template>
  <template v-else-if="editor?.isActive('codeBlock')">
    <editor-menus-bubble-code-languages />
    <editor-menus-bubble-code-themes />
    <div class="divider"></div>
    <editor-menus-bubble-code-line-numbers />
    <editor-menus-bubble-code-word-wrap />
    <div class="divider"></div>
    <editor-menus-bubble-code-copy />
    <editor-menus-bubble-node-delete />
  </template>
  <template
    v-else-if="
      editor?.isActive('toc') ||
      editor?.isActive('pageBreak') ||
      editor?.isActive('horizontalRule')
    "
  >
    <editor-menus-bubble-node-delete />
  </template>
  <template v-else>
    <editor-menus-base-font-size :select="false" />
    <div class="divider"></div>
    <editor-menus-base-bold />
    <editor-menus-base-italic />
    <editor-menus-base-underline />
    <editor-menus-base-strike />
    <div class="divider"></div>
    <editor-menus-base-align-dropdown />
    <div class="divider"></div>
    <editor-menus-base-color />
    <editor-menus-base-background-color />
    <editor-menus-base-highlight />
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
