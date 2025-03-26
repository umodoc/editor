<template>
  <template
    v-if="
      editor?.isActive('toc') ||
      editor?.isActive('pageBreak') ||
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
        editor?.getAttributes('image')?.type.startsWith('image') ||
        ['image/png', 'image/jpeg'].includes(
          editor?.getAttributes('image')?.type,
        )
      "
    />
    <menus-bubble-image-preview
      v-if="
        editor?.getAttributes('image')?.type.startsWith('image') ||
        ['image/png', 'image/jpeg'].includes(
          editor?.getAttributes('image')?.type,
        )
      "
    />
    <menus-bubble-image-open />
    <div class="umo-bubble-menu-divider"></div>
    <menus-bubble-image-edit />
    <menus-bubble-node-duplicate
      v-if="
        editor?.isActive('image') && editor?.getAttributes('image').draggable
      "
    />
    <menus-bubble-node-tofile
      v-if="
        editor?.getAttributes('image').previewType !== null &&
        editor?.getAttributes('image').type.startsWith('image')
      "
    />
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
    <template v-if="editor?.isActive('iframe')">
      <menus-bubble-webpage-clickable />
      <menus-toolbar-insert-web-page
        v-if="!disableItem('webPage')"
        ico="edit"
        :page-type="editor?.getAttributes('iframe')?.type"
        :page-url="editor?.getAttributes('iframe')?.src"
      />
      <menus-bubble-webpage-open />
      <div class="umo-bubble-menu-divider"></div>
    </template>
    <menus-bubble-file-download
      v-if="
        editor?.isActive('file') ||
        editor?.isActive('video') ||
        editor?.isActive('audio')
      "
    />
    <menus-bubble-node-tofile
      v-if="editor?.isActive('video') || editor?.isActive('audio')"
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
  <template v-else-if="editor?.isActive('tag')">
    <menus-bubble-tag-input />
    <menus-bubble-tag-builtin />
    <div class="umo-bubble-menu-divider"></div>
    <menus-bubble-tag-color />
    <menus-bubble-tag-background />
    <div class="umo-bubble-menu-divider"></div>
    <menus-bubble-tag-delete />
  </template>
  <template v-else-if="editor?.isActive('echarts')">
    <menus-toolbar-base-align-left />
    <menus-toolbar-base-align-center />
    <menus-toolbar-base-align-right />
    <div class="umo-bubble-menu-divider"></div>
    <menus-toolbar-tools-echarts ico="setting" />
    <menus-bubble-node-delete />
  </template>
  <template v-else>
    <template v-if="options.assistant?.enabled">
      <menus-bubble-assistant />
      <div class="umo-bubble-menu-divider"></div>
    </template>
    <menus-toolbar-base-font-size :select="false" />
    <div
      v-if="
        !disableItem('font-size-increase') || !disableItem('font-size-decrease')
      "
      class="umo-bubble-menu-divider"
    ></div>
    <menus-toolbar-base-bold />
    <menus-toolbar-base-italic />
    <menus-toolbar-base-underline />
    <menus-toolbar-base-strike />
    <div class="umo-bubble-menu-divider"></div>
    <menus-toolbar-base-align-dropdown />
    <menus-toolbar-insert-link v-if="!disableItem('link')" />
    <div class="umo-bubble-menu-divider"></div>
    <menus-toolbar-base-color />
    <template v-if="!editor?.isActive('textBox')">
      <menus-toolbar-base-background-color />
      <menus-toolbar-base-highlight v-if="!disableItem('highlight')" />
    </template>
    <template v-else>
      <menus-bubble-text-box-border />
      <menus-bubble-text-box-background />
      <div class="umo-bubble-menu-divider"></div>
      <menus-bubble-node-delete />
    </template>
    <div class="umo-bubble-menu-divider"></div>
    <slot name="bubble_menu" />
  </template>
</template>

<script setup lang="ts">
const editor = inject('editor')
const options = inject('options')
const disableItem = (name: string) => {
  return options.value.toolbar?.disableMenuItems.includes(name)
}
</script>

<style lang="less">
.umo-bubble-menu-divider {
  width: 1px;
  border-right: solid 1px var(--umo-border-color-light);
  height: 16px;
  margin: 0 10px 0 5px;
  &:last-child:is(.umo-bubble-menu-divider) {
    display: none;
  }
}
</style>
