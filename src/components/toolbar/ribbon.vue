<template>
  <div class="ribbon-menu">
    <div v-if="menus.length > 1" class="ribbon-tabs">
      <div
        class="tabs-item"
        :class="{ active: currentMenu === item.value }"
        v-for="item in menus"
        :key="item.value"
        @click="changeMenu(item.value)"
      >
        {{ item.label }}
      </div>
    </div>
    <toolbar-scrollable ref="scrollableRef" class="scrollable-container">
      <div class="ribbon-container">
        <template v-if="currentMenu === 'base'">
          <div class="virtual-group">
            <div class="virtual-group-row">
              <editor-menus-base-undo />
              <editor-menus-base-redo />
            </div>
            <div class="virtual-group-row">
              <editor-menus-base-select-all />
              <editor-menus-base-clear-format />
            </div>
          </div>
          <div class="virtual-group">
            <div class="virtual-group-row">
              <editor-menus-base-font-family />
              <editor-menus-base-font-size />
            </div>
            <div class="virtual-group-row">
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
          </div>
          <div class="virtual-group">
            <div class="virtual-group-row">
              <editor-menus-base-bullet-list />
              <editor-menus-base-ordered-list />
              <editor-menus-base-task />
              <editor-menus-base-outdent />
              <editor-menus-base-indent />
              <editor-menus-base-line-height />
            </div>
            <div class="virtual-group-row">
              <editor-menus-base-align-left />
              <editor-menus-base-align-center />
              <editor-menus-base-align-right />
              <editor-menus-base-align-justify />
              <editor-menus-base-align-distributed />
              <editor-menus-base-quote />
              <editor-menus-base-code v-if="!disableItem('code')" />
            </div>
          </div>
          <div class="virtual-group">
            <editor-menus-base-heading />
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
            <editor-menus-insert-code-block v-if="!disableItem('code-block')" />
            <editor-menus-insert-special-characters />
            <editor-menus-insert-date />
            <editor-menus-insert-emoji v-if="!disableItem('emoji')" />
            <editor-menus-insert-mathematics
              v-if="!disableItem('mathematics')"
            />
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
            <div class="virtual-group-row">
              <editor-menus-table-add-row-before />
              <editor-menus-table-add-row-after />
              <editor-menus-table-delete-row />
            </div>
            <div class="virtual-group-row">
              <editor-menus-table-add-column-before />
              <editor-menus-table-add-column-after />
              <editor-menus-table-delete-column />
            </div>
          </div>
          <div class="virtual-group">
            <div class="virtual-group-row">
              <editor-menus-table-merge-cells />
            </div>
            <div class="virtual-group-row">
              <editor-menus-table-split-cell />
            </div>
          </div>
          <div class="virtual-group">
            <div class="virtual-group-row">
              <editor-menus-table-toggle-header-row />
              <editor-menus-table-toggle-header-column />
            </div>
            <div class="virtual-group-row">
              <editor-menus-table-toggle-header-cell />
            </div>
          </div>
          <div class="virtual-group">
            <div class="virtual-group-row">
              <editor-menus-table-next-cell />
            </div>
            <div class="virtual-group-row">
              <editor-menus-table-previous-cell />
            </div>
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
              <div>
                <div class="virtual-group-row">
                  <editor-menus-page-size />
                </div>
                <div class="virtual-group-row">
                  <editor-menus-page-orientation />
                </div>
              </div>
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
  </div>
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

const disableItem = (name) => {
  const { options } = useStore()
  return options.value.toolbar.disableMenuItems.includes(name)
}

const scrollableRef = $ref()
const changeMenu = async (menu) => {
  emits('menu-change', menu)
  await nextTick()
  scrollableRef.update()
}
</script>

<style lang="less" scoped>
.ribbon-menu {
  width: 100%;
}
.ribbon-tabs {
  padding: 10px 10px 0;
  display: flex;
  .tabs-item {
    font-size: var(--umo-font-size-small);
    margin-right: 25px;
    cursor: pointer;
    display: flex;
    align-items: center;
    flex-direction: column;
    &:hover {
      font-weight: 600;
      &::after {
        display: block;
        content: '';
        height: 3px;
        width: 100%;
        margin-top: 5px;
        background-color: var(--umo-border-color);
      }
    }
    &.active {
      color: var(--umo-primary-color);
      font-weight: 600;
      &::after {
        display: block;
        content: '';
        height: 3px;
        width: 100%;
        margin-top: 5px;
        background-color: var(--umo-primary-color);
        transition: width 0.3s;
      }
      &:hover::after {
        width: 120%;
      }
    }
    @media screen and (max-width: 640px) {
      margin-right: 10px;
    }
  }
}
.scrollable-container {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.ribbon-container {
  display: flex;
  height: 56px;
  flex-shrink: 0;
  .virtual-group {
    padding: 0 20px;
    border-right: solid 1px var(--umo-border-color-light);
    flex-shrink: 0;
    &:empty {
      display: none;
    }
    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      border-right: none;
    }
    &-row {
      display: flex;
      align-items: center;
      :deep(> *:not(:last-child)) {
        margin-right: 5px;
      }
      &:not(:last-child) {
        margin-bottom: 5px;
      }
    }
  }
}
</style>
