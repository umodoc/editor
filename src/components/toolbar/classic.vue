<template>
  <toolbar-scrollable ref="scrollableRef" class="scrollable-container">
    <div class="classic-menu">
      <div v-if="menus.length > 1" class="virtual-group">
        <t-select
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
        <div class="virtual-group">
          <editor-menus-base-undo />
          <editor-menus-base-redo />
          <editor-menus-base-select-all />
          <editor-menus-base-clear-format />
        </div>
        <div class="virtual-group">
          <editor-menus-base-heading />
          <editor-menus-base-font-family borderless />
          <editor-menus-base-font-size borderless />
          <editor-menus-base-bold />
          <editor-menus-base-italic />
          <editor-menus-base-underline />
          <editor-menus-base-strike />
          <editor-menus-base-subscript />
          <editor-menus-base-superscript />
          <editor-menus-base-color />
          <editor-menus-base-background-color />
          <editor-menus-base-highlight />
        </div>
        <div class="virtual-group">
          <editor-menus-base-bullet-list />
          <editor-menus-base-ordered-list />
          <editor-menus-base-task />
          <editor-menus-base-outdent />
          <editor-menus-base-indent />
          <editor-menus-base-line-height />
          <editor-menus-base-align-dropdown />
          <editor-menus-base-quote />
          <editor-menus-base-code v-if="!disableItem('code')" />
        </div>
        <div class="virtual-group">
          <editor-menus-base-markdown />
          <editor-menus-base-search-replace />
        </div>
        <!-- <div class="virtual-group">
          <editor-menus-base-print />
        </div> -->
      </template>
      <template v-if="currentMenu === 'insert'">
        <div class="virtual-group">
          <editor-menus-insert-link />
          <editor-menus-insert-image />
          <editor-menus-insert-video v-if="!disableItem('video')" />
          <editor-menus-insert-audio v-if="!disableItem('audio')" />
          <editor-menus-insert-file v-if="!disableItem('file')" />
          <editor-menus-insert-code-block v-if="!disableItem('code')" />
          <editor-menus-insert-special-characters />
          <editor-menus-insert-date />
          <editor-menus-insert-emoji v-if="!disableItem('emoji')" />
          <editor-menus-insert-mathematics v-if="!disableItem('mathematics')" />
        </div>
        <div class="virtual-group">
          <editor-menus-insert-hard-break />
          <editor-menus-insert-horizontal-line />
          <editor-menus-insert-toc />
          <editor-menus-insert-text-box />
        </div>
        <div class="virtual-group">
          <editor-menus-insert-template />
          <editor-menus-insert-web-page />
        </div>
      </template>
      <template v-if="currentMenu === 'table'">
        <div class="virtual-group">
          <editor-menus-table-insert />
          <editor-menus-table-fix />
        </div>
        <div class="virtual-group">
          <editor-menus-table-cells-align />
          <editor-menus-table-cells-background />
          <!-- <editor-menus-table-border-color /> -->
        </div>
        <div class="virtual-group">
          <editor-menus-table-add-row-before :huge-button="false" />
          <editor-menus-table-add-row-after :huge-button="false" />
          <editor-menus-table-add-column-before :huge-button="false" />
          <editor-menus-table-add-column-after :huge-button="false" />
        </div>
        <div class="virtual-group">
          <editor-menus-table-delete-row :huge-button="false" />
          <editor-menus-table-delete-column :huge-button="false" />
        </div>
        <div class="virtual-group">
          <editor-menus-table-merge-cells :huge-button="false" />
          <editor-menus-table-split-cell :huge-button="false" />
        </div>
        <div class="virtual-group">
          <editor-menus-table-toggle-header-row :huge-button="false" />
          <editor-menus-table-toggle-header-column :huge-button="false" />
          <editor-menus-table-toggle-header-cell :huge-button="false" />
        </div>
        <div class="virtual-group">
          <editor-menus-table-next-cell :huge-button="false" />
          <editor-menus-table-previous-cell :huge-button="false" />
        </div>
        <div class="virtual-group">
          <editor-menus-table-delete />
        </div>
      </template>
      <template v-if="currentMenu === 'tools'">
        <div class="virtual-group">
          <editor-menus-tools-qrcode />
          <editor-menus-tools-barcode />
        </div>
        <div class="virtual-group">
          <editor-menus-tools-signature v-if="!disableItem('signature')" />
          <editor-menus-tools-seal v-if="!disableItem('seal')" />
        </div>
        <div class="virtual-group">
          <editor-menus-tools-diagrams v-if="!disableItem('diagrams')" />
          <!-- <editor-menus-tools-mind-map v-if="!disableItem('mind-map')" /> -->
          <editor-menus-tools-mermaid v-if="!disableItem('mermaid')" />
        </div>
        <div class="virtual-group">
          <editor-menus-tools-chinese-case />
        </div>
      </template>
      <template v-if="currentMenu === 'page'">
        <div class="virtual-group">
          <editor-menus-page-toggle-toc />
        </div>
        <div class="virtual-group">
          <div class="virtual-group-row">
            <editor-menus-page-margin />
            <editor-menus-page-size />
            <editor-menus-page-orientation />
          </div>
        </div>
        <!-- <div class="virtual-group">
          <editor-menus-page-header />
          <editor-menus-page-footer />
        </div> -->
        <div class="virtual-group">
          <editor-menus-page-break />
          <editor-menus-page-break-marks />
          <editor-menus-page-line-number />
          <editor-menus-page-watermark />
          <editor-menus-page-background />
        </div>
        <div class="virtual-group">
          <editor-menus-page-preview />
        </div>
      </template>
      <template v-if="currentMenu === 'export'">
        <div class="virtual-group">
          <editor-menus-export-image />
          <!-- <editor-menus-export-pdf /> -->
          <editor-menus-export-html />
          <editor-menus-export-text />
        </div>
        <div class="virtual-group">
          <editor-menus-export-share v-if="!disableItem('share')" />
          <editor-menus-export-embed v-if="!disableItem('embed')" />
        </div>
      </template>
    </div>
  </toolbar-scrollable>
</template>

<script setup>
const props = defineProps({
  menus: {
    type: Array,
    required: true,
  },
  currentMenu: {
    type: String,
    required: true,
  },
})
const emits = defineEmits(['menu-change'])

const { container, options } = useStore()
const disableItem = (name) => {
  return options.value.toolbar.disableMenuItems.includes(name)
}

// eslint-disable-next-line vue/no-dupe-keys
let currentMenu = $ref('')
watch(
  () => props.currentMenu,
  async (val) => {
    currentMenu = val
    await nextTick()
    try {
      scrollableRef.update()
    } catch {}
  },
  { immediate: true },
)
const scrollableRef = $ref()
const toggoleMenu = async (menu) => {
  emits('menu-change', menu)
  await nextTick()
  scrollableRef.update()
}
</script>

<style lang="less" scoped>
.scrollable-container {
  padding: 10px;
}
.classic-menu {
  display: flex;
  align-items: center;
  flex: 1;
  .virtual-group {
    display: flex;
    align-items: center;
    &:empty {
      display: none;
    }
    &:not(:last-child)::after {
      content: '';
      display: block;
      height: 18px;
      width: 1px;
      background-color: var(--umo-border-color-light);
      margin: 0 10px;
    }
    :deep(.menu-button .umo-button--shape-square) {
      .icon {
        font-size: 14px;
      }
    }
    &-row {
      display: flex;
    }
  }
}
</style>
