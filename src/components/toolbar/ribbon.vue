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
              <menus-toolbar-base-undo />
              <menus-toolbar-base-redo />
            </div>
            <div class="virtual-group-row">
              <menus-toolbar-base-select-all />
              <menus-toolbar-base-clear-format />
            </div>
          </div>
          <div class="virtual-group">
            <div class="virtual-group-row">
              <menus-toolbar-base-font-family />
              <menus-toolbar-base-font-size />
            </div>
            <div class="virtual-group-row">
              <menus-toolbar-base-bold />
              <menus-toolbar-base-italic />
              <menus-toolbar-base-underline />
              <menus-toolbar-base-strike />
              <menus-toolbar-base-subscript />
              <menus-toolbar-base-superscript />
              <menus-toolbar-base-color />
              <menus-toolbar-base-background-color />
              <menus-toolbar-base-highlight />
            </div>
          </div>
          <div class="virtual-group">
            <div class="virtual-group-row">
              <menus-toolbar-base-ordered-list />
              <menus-toolbar-base-bullet-list />
              <menus-toolbar-base-task-list />
              <menus-toolbar-base-outdent />
              <menus-toolbar-base-indent />
              <menus-toolbar-base-line-height />
            </div>
            <div class="virtual-group-row">
              <menus-toolbar-base-align-left />
              <menus-toolbar-base-align-center />
              <menus-toolbar-base-align-right />
              <menus-toolbar-base-align-justify />
              <menus-toolbar-base-align-distributed />
              <menus-toolbar-base-quote />
              <menus-toolbar-base-code v-if="!disableItem('code')" />
            </div>
          </div>
          <div class="virtual-group">
            <menus-toolbar-base-heading />
          </div>
          <div class="virtual-group">
            <menus-toolbar-base-markdown />
            <menus-toolbar-base-search-replace />
          </div>
          <div class="virtual-group">
            <menus-toolbar-base-print v-if="!disableItem('print')" />
          </div>
        </template>
        <template v-if="currentMenu === 'insert'">
          <div class="virtual-group">
            <menus-toolbar-insert-link />
            <menus-toolbar-insert-image />
            <menus-toolbar-insert-video v-if="!disableItem('video')" />
            <menus-toolbar-insert-audio v-if="!disableItem('audio')" />
            <menus-toolbar-insert-file v-if="!disableItem('file')" />
            <menus-toolbar-insert-code-block
              v-if="!disableItem('code-block')"
            />
            <menus-toolbar-insert-special-characters />
            <menus-toolbar-insert-date />
            <menus-toolbar-insert-emoji v-if="!disableItem('emoji')" />
            <menus-toolbar-insert-mathematics
              v-if="!disableItem('mathematics')"
            />
          </div>
          <div class="virtual-group">
            <menus-toolbar-insert-hard-break />
            <menus-toolbar-insert-horizontal-line />
            <menus-toolbar-insert-toc />
            <menus-toolbar-insert-text-box />
          </div>
          <div class="virtual-group">
            <menus-toolbar-insert-template />
            <menus-toolbar-insert-web-page />
          </div>
        </template>
        <template v-if="currentMenu === 'table'">
          <div class="virtual-group">
            <menus-toolbar-table-insert />
            <menus-toolbar-table-fix />
          </div>
          <div class="virtual-group">
            <menus-toolbar-table-cells-align />
            <menus-toolbar-table-cells-background />
            <!-- <menus-toolbar-table-border-color /> -->
          </div>
          <div class="virtual-group">
            <div class="virtual-group-row">
              <menus-toolbar-table-add-row-before />
              <menus-toolbar-table-add-row-after />
              <menus-toolbar-table-delete-row />
            </div>
            <div class="virtual-group-row">
              <menus-toolbar-table-add-column-before />
              <menus-toolbar-table-add-column-after />
              <menus-toolbar-table-delete-column />
            </div>
          </div>
          <div class="virtual-group">
            <div class="virtual-group-row">
              <menus-toolbar-table-merge-cells />
            </div>
            <div class="virtual-group-row">
              <menus-toolbar-table-split-cell />
            </div>
          </div>
          <div class="virtual-group">
            <div class="virtual-group-row">
              <menus-toolbar-table-toggle-header-row />
              <menus-toolbar-table-toggle-header-column />
            </div>
            <div class="virtual-group-row">
              <menus-toolbar-table-toggle-header-cell />
            </div>
          </div>
          <div class="virtual-group">
            <div class="virtual-group-row">
              <menus-toolbar-table-next-cell />
            </div>
            <div class="virtual-group-row">
              <menus-toolbar-table-previous-cell />
            </div>
          </div>
          <div class="virtual-group">
            <menus-toolbar-table-delete />
          </div>
        </template>
        <template v-if="currentMenu === 'tools'">
          <div class="virtual-group">
            <menus-toolbar-tools-qrcode />
            <menus-toolbar-tools-barcode />
          </div>
          <div class="virtual-group">
            <menus-toolbar-tools-signature v-if="!disableItem('signature')" />
            <menus-toolbar-tools-seal v-if="!disableItem('seal')" />
          </div>
          <div class="virtual-group">
            <menus-toolbar-tools-diagrams v-if="!disableItem('diagrams')" />
            <!-- <menus-toolbar-tools-mind-map v-if="!disableItem('mind-map')" /> -->
            <menus-toolbar-tools-mermaid v-if="!disableItem('mermaid')" />
          </div>
          <div class="virtual-group">
            <menus-toolbar-tools-chinese-case />
          </div>
        </template>
        <template v-if="currentMenu === 'page'">
          <div class="virtual-group">
            <menus-toolbar-page-toggle-toc />
          </div>
          <div class="virtual-group">
            <div class="virtual-group-row">
              <menus-toolbar-page-margin />
              <div>
                <div class="virtual-group-row">
                  <menus-toolbar-page-size />
                </div>
                <div class="virtual-group-row">
                  <menus-toolbar-page-orientation />
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="virtual-group">
            <menus-toolbar-page-header />
            <menus-toolbar-page-footer />
          </div> -->
          <div class="virtual-group">
            <menus-toolbar-page-break />
            <menus-toolbar-page-break-marks />
            <menus-toolbar-page-line-number />
            <menus-toolbar-page-watermark />
            <menus-toolbar-page-background />
          </div>
          <div class="virtual-group">
            <menus-toolbar-page-preview />
          </div>
        </template>
        <template v-if="currentMenu === 'export'">
          <div class="virtual-group">
            <menus-toolbar-export-image />
            <!-- <menus-toolbar-export-pdf /> -->
            <menus-toolbar-export-html />
            <menus-toolbar-export-text />
          </div>
          <div class="virtual-group">
            <menus-toolbar-export-share v-if="!disableItem('share')" />
            <menus-toolbar-export-embed v-if="!disableItem('embed')" />
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
