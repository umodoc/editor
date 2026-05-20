<template>
  <toolbar-scrollable ref="scrollableRef" class="umo-scrollable-container">
    <div class="umo-classic-menu">
      <div v-if="menus.length > 1" class="umo-virtual-group">
        <t-select
          v-if="selectVisible"
          v-model="currentMenu"
          :popup-props="{
            destroyOnClose: true,
            attach: container,
          }"
          size="small"
          auto-width
          borderless
          @change="toggoleMenu"
        >
          <template #prefixIcon>
            <icon name="menu" />
          </template>
          <t-option
            v-for="item in menus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </t-select>
      </div>
      <template v-if="currentMenu === 'base'">
        <div class="umo-virtual-group">
          <menus-toolbar-base-undo />
          <menus-toolbar-base-redo />
          <menus-toolbar-base-format-painter v-if="!disableMenu('format-painter')" />
          <menus-toolbar-base-clear-format />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-base-heading />
          <menus-toolbar-base-font-family v-if="!disableMenu('font-menu')" borderless />
          <menus-toolbar-base-font-size v-if="!disableMenu('font-menu')" borderless />
          <menus-toolbar-base-word-wrap v-if="!disableMenu('font-menu')" />
          <menus-toolbar-base-bold />
          <menus-toolbar-base-italic />
          <menus-toolbar-base-underline />
          <menus-toolbar-base-strike />
          <menus-toolbar-base-subscript />
          <menus-toolbar-base-superscript />
          <menus-toolbar-base-color />
          <menus-toolbar-base-background-color />
          <menus-toolbar-base-highlight v-if="!disableMenu('highlight')" />
          <menus-toolbar-base-letter-spacing v-if="!disableMenu('letter-spacing')" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-base-ordered-list />
          <menus-toolbar-base-bullet-list />
          <menus-toolbar-base-task-list v-if="!disableMenu('task-list')" />
          <menus-toolbar-base-indent v-if="!disableMenu('indents')" />
          <menus-toolbar-base-outdent v-if="!disableMenu('indents')" />
          <menus-toolbar-base-line-height v-if="!disableMenu('line-height')" />
          <menus-toolbar-base-margin v-if="!disableMenu('margin')" />
          <menus-toolbar-base-align-dropdown />
          <menus-toolbar-base-code v-if="!disableMenu('code')" />
          <menus-toolbar-base-quote v-if="!disableMenu('quote')" />
          <menus-toolbar-base-select-all v-if="!disableMenu('select-all')" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-base-markdown v-if="!disableMenu('markdown')" />
          <menus-toolbar-base-search-replace />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-base-print v-if="!disableMenu('print')" />
        </div>
        <div class="virtual-group is-slot">
          <slot name="toolbar_base" toolbar-mode="classic" />
        </div>
      </template>
      <template v-if="currentMenu === 'insert'">
        <div class="umo-virtual-group">
          <menus-toolbar-insert-link v-if="!disableMenu('link')" />
          <menus-toolbar-insert-image v-if="!disableMenu('image')" />
          <menus-toolbar-insert-video v-if="!disableMenu('video')" />
          <menus-toolbar-insert-audio v-if="!disableMenu('audio')" />
          <menus-toolbar-insert-file v-if="!disableMenu('file')" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-insert-emoji v-if="!disableMenu('emoji')" />
          <menus-toolbar-insert-text-box v-if="!disableMenu('text-box')" />
          <menus-toolbar-insert-details v-if="!disableMenu('details')" />
          <menus-toolbar-insert-code-block v-if="!disableMenu('code-block')" />
          <menus-toolbar-insert-symbol v-if="!disableMenu('symbol')" />
          <menus-toolbar-insert-tag v-if="!disableMenu('tag')" />
          <menus-toolbar-insert-columns v-if="!disableMenu('columns')" />
          <menus-toolbar-insert-callout v-if="!disableMenu('callout')" />
          <menus-toolbar-insert-mention v-if="!disableMenu('mention')" />
          <menus-toolbar-insert-option-box v-if="!disableMenu('option-box')" />
          <menus-toolbar-insert-hard-break v-if="!disableMenu('hard-break')" />
          <menus-toolbar-insert-hr v-if="!disableMenu('hr')" />
          <menus-toolbar-insert-bookmark v-if="!disableMenu('bookmark')" />
          <menus-toolbar-insert-footnote v-if="!disableMenu('footnote')" />
          <menus-toolbar-insert-toc v-if="!disableMenu('toc')" />
          <menus-toolbar-tools-math v-if="!disableMenu('math')" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-insert-template v-if="!disableMenu('template')" />
          <menus-toolbar-insert-web-page v-if="!disableMenu('web-page')" />
        </div>
        <div class="virtual-group is-slot">
          <slot name="toolbar_insert" toolbar-mode="classic" />
        </div>
      </template>
      <template v-if="currentMenu === 'table'">
        <div class="umo-virtual-group">
          <menus-toolbar-table-insert />
          <menus-toolbar-table-fix />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-table-cells-align />
          <menus-toolbar-table-cells-background />
          <!-- <menus-toolbar-table-border-color /> -->
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-table-add-row-before :huge="false" />
          <menus-toolbar-table-add-row-after :huge="false" />
          <menus-toolbar-table-add-column-before :huge="false" />
          <menus-toolbar-table-add-column-after :huge="false" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-table-delete-row :huge="false" />
          <menus-toolbar-table-delete-column :huge="false" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-table-merge-cells :huge="false" />
          <menus-toolbar-table-split-cell :huge="false" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-table-toggle-header-row :huge="false" />
          <menus-toolbar-table-toggle-header-column :huge="false" />
          <menus-toolbar-table-toggle-header-cell :huge="false" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-table-next-cell :huge="false" />
          <menus-toolbar-table-previous-cell :huge="false" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-table-delete />
        </div>
        <div class="virtual-group is-slot">
          <slot name="toolbar_table" toolbar-mode="classic" />
        </div>
      </template>
      <template v-if="currentMenu === 'tools'">
        <div class="umo-virtual-group">
          <!-- <menus-toolbar-tools-diagrams v-if="!disableMenu('diagrams')" /> -->
          <!-- <menus-toolbar-tools-echarts v-if="!disableMenu('echarts')" /> -->
          <!-- <menus-toolbar-tools-mind-map v-if="!disableMenu('mind-map')" /> -->
        </div>
        <div class="virtual-group is-slot">
          <slot name="toolbar_tools" toolbar-mode="classic" />
        </div>
      </template>
      <template v-if="currentMenu === 'page'">
        <div class="umo-virtual-group">
          <menus-toolbar-page-break />
          <menus-toolbar-page-break-marks />
          <menus-toolbar-page-line-number />
          <menus-toolbar-page-watermark v-if="!disableMenu('watermark')" />
        </div>
        <div class="virtual-group is-slot">
          <slot name="toolbar_page" toolbar-mode="classic" />
        </div>
      </template>
      <template v-if="currentMenu === 'export'">
        <div class="umo-virtual-group">
          <menus-toolbar-export-image v-if="!disableMenu('export-image')" />
          <menus-toolbar-export-pdf v-if="!disableMenu('export-pdf')" />
          <menus-toolbar-export-text v-if="!disableMenu('export-text')" />
        </div>
        <div class="umo-virtual-group">
          <menus-toolbar-export-share v-if="!disableMenu('share')" />
          <menus-toolbar-export-embed v-if="!disableMenu('embed')" />
        </div>
        <div class="virtual-group is-slot">
          <slot name="toolbar_export" toolbar-mode="classic" />
        </div>
      </template>
    </div>
  </toolbar-scrollable>
</template>

<script setup>
const props = defineProps({
  menus: {
    type: Array,
    default: () => [],
  },
  currentMenu: {
    type: String,
    default: '',
  },
})

const { selectVisible } = useSelect()

const emits = defineEmits(['menu-change'])

const container = inject('container')
const options = inject('options')
const disableMenu = (name) => {
  return options.value.disableExtensions.includes(name)
}

// eslint-disable-next-line vue/no-dupe-keys
let currentMenu = $ref('')
watch(
  () => props.currentMenu,
  async (val) => {
    currentMenu = val
    await nextTick()
    scrollableRef?.update()
  },
  { immediate: true },
)
const scrollableRef = $ref(null)
const toggoleMenu = async (menu) => {
  emits('menu-change', menu)
  await nextTick()
  scrollableRef?.update()
}
</script>

<style lang="scss" scoped>
.umo-scrollable-container {
  padding: 10px;
}
.umo-classic-menu {
  display: inline-flex;
  align-items: center;
  &:last-child {
    margin-right: 10px;
  }
  .umo-virtual-group {
    display: flex;
    align-items: center;
    &:empty {
      display: none;
    }
    &:not(:last-child),
    &.is-slot {
      &::before {
        content: '';
        display: block;
        height: 18px;
        width: 1px;
        background-color: var(--umo-border-color-light);
        margin: 0 10px;
      }
    }
    &:first-child::before {
      display: none;
    }
    :deep(.umo-menu-button .umo-button--shape-square) {
      .umo-icon {
        font-size: 14px;
      }
    }
    &-row {
      display: flex;
    }
  }
}
</style>
