<template>
  <div class="umo-ribbon-menu">
    <div v-if="menus.length > 1" class="umo-ribbon-tabs">
      <div
        v-for="item in menus"
        :key="item.value"
        class="umo-ribbon-tabs-item"
        :class="{ active: currentMenu === item.value }"
        @click="changeMenu(item.value)"
      >
        {{ item.label }}
      </div>
    </div>
    <toolbar-scrollable ref="scrollableRef" class="umo-scrollable-container">
      <div class="umo-ribbon-container">
        <template v-if="currentMenu === 'base'">
          <div class="umo-virtual-group">
            <div class="umo-virtual-group-row">
              <menus-toolbar-base-undo />
              <menus-toolbar-base-redo />
            </div>
            <div class="umo-virtual-group-row">
              <menus-toolbar-base-format-painter />
              <menus-toolbar-base-clear-format />
            </div>
          </div>
          <div class="umo-virtual-group">
            <div class="umo-virtual-group-row">
              <menus-toolbar-base-font-family />
              <menus-toolbar-base-font-size />
            </div>
            <div class="umo-virtual-group-row">
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
          <div class="umo-virtual-group">
            <div class="umo-virtual-group-row">
              <menus-toolbar-base-ordered-list />
              <menus-toolbar-base-bullet-list />
              <menus-toolbar-base-task-list />
              <menus-toolbar-base-indent />
              <menus-toolbar-base-outdent />
              <menus-toolbar-base-line-height />
              <menus-toolbar-base-margin />
            </div>
            <div class="umo-virtual-group-row">
              <menus-toolbar-base-align-left />
              <menus-toolbar-base-align-center />
              <menus-toolbar-base-align-right />
              <menus-toolbar-base-align-justify />
              <menus-toolbar-base-align-distributed />
              <menus-toolbar-base-quote />
              <menus-toolbar-base-code v-if="!disableItem('code')" />
              <menus-toolbar-base-select-all />
            </div>
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-base-heading />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-base-import-word />
            <menus-toolbar-base-markdown />
            <menus-toolbar-base-search-replace />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-base-print v-if="!disableItem('print')" />
          </div>
          <div class="virtual-group is-slot">
            <slot name="toolbar_base" toolbar-mode="ribbon" />
          </div>
        </template>
        <template v-if="currentMenu === 'insert'">
          <div class="umo-virtual-group">
            <menus-toolbar-insert-link />
            <menus-toolbar-insert-image />
            <menus-toolbar-insert-video v-if="!disableItem('video')" />
            <menus-toolbar-insert-audio v-if="!disableItem('audio')" />
            <menus-toolbar-insert-file v-if="!disableItem('file')" />
            <menus-toolbar-insert-code-block
              v-if="!disableItem('code-block')"
            />
            <menus-toolbar-insert-symbol v-if="!disableItem('symbol')" />
            <menus-toolbar-insert-chinese-date
              v-if="!disableItem('chineseDate')"
            />
            <menus-toolbar-insert-emoji v-if="!disableItem('emoji')" />
            <menus-toolbar-insert-math v-if="!disableItem('math')" />
            <menus-toolbar-insert-bookmark v-if="!disableItem('bookmark')" />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-insert-hard-break />
            <menus-toolbar-insert-hr />
            <menus-toolbar-insert-toc />
            <menus-toolbar-insert-text-box v-if="!disableItem('textBox')" />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-insert-template />
            <menus-toolbar-insert-web-page v-if="!disableItem('webPage')" />
          </div>
          <div class="virtual-group is-slot">
            <slot name="toolbar_insert" toolbar-mode="ribbon" />
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
            <div class="umo-virtual-group-row">
              <menus-toolbar-table-add-row-before />
              <menus-toolbar-table-add-row-after />
              <menus-toolbar-table-delete-row />
            </div>
            <div class="umo-virtual-group-row">
              <menus-toolbar-table-add-column-before />
              <menus-toolbar-table-add-column-after />
              <menus-toolbar-table-delete-column />
            </div>
          </div>
          <div class="umo-virtual-group">
            <div class="umo-virtual-group-row">
              <menus-toolbar-table-merge-cells />
            </div>
            <div class="umo-virtual-group-row">
              <menus-toolbar-table-split-cell />
            </div>
          </div>
          <div class="umo-virtual-group">
            <div class="umo-virtual-group-row">
              <menus-toolbar-table-toggle-header-row />
              <menus-toolbar-table-toggle-header-column />
            </div>
            <div class="umo-virtual-group-row">
              <menus-toolbar-table-toggle-header-cell />
            </div>
          </div>
          <div class="umo-virtual-group">
            <div class="umo-virtual-group-row">
              <menus-toolbar-table-next-cell />
            </div>
            <div class="umo-virtual-group-row">
              <menus-toolbar-table-previous-cell />
            </div>
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-table-delete />
          </div>
          <div class="virtual-group is-slot">
            <slot name="toolbar_table" toolbar-mode="ribbon" />
          </div>
        </template>
        <template v-if="currentMenu === 'tools'">
          <div class="umo-virtual-group">
            <menus-toolbar-tools-qrcode />
            <menus-toolbar-tools-barcode />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-tools-signature v-if="!disableItem('signature')" />
            <menus-toolbar-tools-seal v-if="!disableItem('seal')" />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-tools-diagrams v-if="!disableItem('diagrams')" />
            <!-- <menus-toolbar-tools-mind-map v-if="!disableItem('mind-map')" /> -->
            <menus-toolbar-tools-mermaid v-if="!disableItem('mermaid')" />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-tools-chinese-case
              v-if="!disableItem('chineseCase')"
            />
          </div>
          <div class="umo-virtual-group">
            <slot name="toolbar_tools" toolbar-mode="ribbon" />
          </div>
        </template>
        <template v-if="currentMenu === 'page'">
          <div class="umo-virtual-group">
            <menus-toolbar-page-toggle-toc />
          </div>
          <div class="umo-virtual-group">
            <div class="umo-virtual-group-row">
              <menus-toolbar-page-margin />
              <div>
                <div class="umo-virtual-group-row">
                  <menus-toolbar-page-size />
                </div>
                <div class="umo-virtual-group-row">
                  <menus-toolbar-page-orientation />
                </div>
              </div>
            </div>
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-page-break />
            <menus-toolbar-page-break-marks />
            <menus-toolbar-page-line-number />
            <menus-toolbar-page-watermark />
            <menus-toolbar-page-background />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-page-preview />
          </div>
          <div class="virtual-group is-slot">
            <slot name="toolbar_page" toolbar-mode="ribbon" />
          </div>
        </template>
        <template v-if="currentMenu === 'export'">
          <div class="umo-virtual-group">
            <menus-toolbar-export-image />
            <menus-toolbar-export-pdf v-if="!disableItem('exportPDF')" />
            <menus-toolbar-export-text />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-export-share v-if="!disableItem('share')" />
            <menus-toolbar-export-embed v-if="!disableItem('embed')" />
          </div>
          <div class="virtual-group is-slot">
            <slot name="toolbar_export" toolbar-mode="ribbon" />
          </div>
        </template>
      </div>
    </toolbar-scrollable>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  menus: {
    value: string
    label: string
  }[]
  currentMenu: string
}>()
const emits = defineEmits(['menu-change'])

const { options } = useStore()
const disableItem = (name: string) => {
  return options.value.toolbar?.disableMenuItems.includes(name)
}

const scrollableRef = $ref<{ update: () => void }>()
const changeMenu = async (menu: string) => {
  emits('menu-change', menu)
  await nextTick()
  scrollableRef?.update()
}
</script>

<style lang="less" scoped>
.umo-ribbon-menu {
  width: 100%;
}
.umo-ribbon-tabs {
  padding: 10px 10px 0;
  display: flex;
  &-item {
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
.umo-scrollable-container {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.umo-ribbon-container {
  display: flex;
  height: 56px;
  flex-shrink: 0;
  .umo-virtual-group {
    padding: 0 20px;
    border-left: solid 1px var(--umo-border-color-light);
    flex-shrink: 0;
    &:empty {
      display: none;
    }
    &:first-child {
      padding-left: 0;
    }
    &:first-child,
    &.is-slot:empty {
      border-left: none;
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
