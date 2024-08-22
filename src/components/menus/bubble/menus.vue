<template>
  <template
    v-if="
      editor?.isActive('toc') ||
      editor?.isActive('pagination') ||
      editor?.isActive('horizontalRule') ||
      editor?.getAttributes('image').error
    "
  >
    <!-- <menus-bubble-node-delete /> -->
  </template>
  <template
    v-else-if="
      editor?.isActive('image') && !editor?.getAttributes('image').error
    "
  >
    <menus-toolbar-base-align-left />
    <menus-toolbar-base-align-center />
    <menus-toolbar-base-align-right />
    <div class="umo-bubble-menu-divider"></div>
    <menus-bubble-image-flip />
    <menus-bubble-image-proportion />
    <menus-bubble-image-draggable />
    <menus-bubble-image-reset />
    <div class="umo-bubble-menu-divider"></div>
    <menus-bubble-image-remove-background
      v-if="
        editor?.getAttributes('image')?.type === 'image' ||
        ['image/png', 'image/jpeg'].includes(
          editor?.getAttributes('image')?.type,
        )
      "
    />
    <menus-bubble-image-preview
      v-if="
        editor?.getAttributes('image')?.type === 'image' ||
        ['image/png', 'image/jpeg'].includes(
          editor?.getAttributes('image')?.type,
        )
      "
    />
    <menus-bubble-image-open />
    <div class="umo-bubble-menu-divider"></div>
    <menus-bubble-image-edit />
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
    <div class="umo-bubble-menu-divider"></div>
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
    <div class="umo-bubble-menu-divider"></div>
    <menus-toolbar-table-add-row-before />
    <menus-toolbar-table-add-row-after />
    <menus-toolbar-table-add-column-before />
    <menus-toolbar-table-add-column-after />
    <div class="umo-bubble-menu-divider"></div>
    <menus-toolbar-table-delete-row />
    <menus-toolbar-table-delete-column />
    <div class="umo-bubble-menu-divider"></div>
    <menus-toolbar-table-merge-cells />
    <menus-toolbar-table-split-cell />
  </template>
  <template v-else-if="editor?.isActive('codeBlock')">
    <menus-bubble-code-languages />
    <menus-bubble-code-themes />
    <div class="umo-bubble-menu-divider"></div>
    <menus-bubble-code-line-numbers />
    <menus-bubble-code-word-wrap />
    <div class="umo-bubble-menu-divider"></div>
    <menus-bubble-code-copy />
    <menus-bubble-node-delete />
  </template>
  <template v-else>
    <template v-if="options.assistant.enabled">
      <menus-bubble-assistant />
      <div class="umo-bubble-menu-divider"></div>
    </template>
    <menus-toolbar-base-font-size :select="false" />
    <div class="umo-bubble-menu-divider"></div>
    <menus-toolbar-base-bold />
    <menus-toolbar-base-italic />
    <menus-toolbar-base-underline />
    <menus-toolbar-base-strike />
    <div class="umo-bubble-menu-divider"></div>
    <menus-toolbar-base-align-dropdown />
    <div class="umo-bubble-menu-divider"></div>
    <menus-toolbar-base-color />
    <menus-toolbar-base-background-color />
    <menus-toolbar-base-highlight />
    <div class="umo-bubble-menu-divider"></div>
    <template v-if="options.document.enableComment">
      <menus-bubble-comment />
      <div class="umo-bubble-menu-divider"></div>
    </template>
    <slot name="bubble_menu" />
  </template>
</template>

<script setup>
const { options, editor } = useStore()
</script>

<style lang="less" scoped>
.umo-bubble-menu-divider {
  width: 1;
  border-right: solid 1px var(--umo-border-color-light);
  height: 16px;
  margin: 0 10px 0 5px;
  &:last-child:is(.umo-bubble-menu-divider) {
    display: none;
  }
}
</style>
