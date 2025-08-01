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
              <menus-toolbar-base-highlight v-if="!disableMenu('highlight')" />
            </div>
          </div>
          <div class="umo-virtual-group">
            <div class="umo-virtual-group-row">
              <menus-toolbar-base-ordered-list
                v-if="!disableMenu('ordered-list')"
              />
              <menus-toolbar-base-bullet-list
                v-if="!disableMenu('bullet-list')"
              />
              <menus-toolbar-base-task-list v-if="!disableMenu('task-list')" />
              <menus-toolbar-base-indent />
              <menus-toolbar-base-outdent />
              <menus-toolbar-base-line-height
                v-if="!disableMenu('line-height')"
              />
              <menus-toolbar-base-margin v-if="!disableMenu('margin')" />
            </div>
            <div class="umo-virtual-group-row">
              <menus-toolbar-base-align-left />
              <menus-toolbar-base-align-center />
              <menus-toolbar-base-align-right />
              <menus-toolbar-base-align-justify />
              <menus-toolbar-base-align-distributed />
              <menus-toolbar-base-quote v-if="!disableMenu('quote')" />
              <menus-toolbar-base-code v-if="!disableMenu('code')" />
              <menus-toolbar-base-select-all
                v-if="!disableMenu('select-all')"
              />
            </div>
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-base-heading />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-base-import-word
              v-if="!disableMenu('import-word')"
            />
            <menus-toolbar-base-markdown v-if="!disableMenu('markdown')" />
            <menus-toolbar-base-search-replace />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-base-print v-if="!disableMenu('print')" />
          </div>
          <div class="virtual-group is-slot">
            <slot name="toolbar_base" toolbar-mode="ribbon" />
          </div>
        </template>
        <template v-if="currentMenu === 'insert'">
          <div class="umo-virtual-group">
            <menus-toolbar-insert-link v-if="!disableMenu('link')" />
            <menus-toolbar-insert-image v-if="!disableMenu('image')" />
            <menus-toolbar-insert-video v-if="!disableMenu('video')" />
            <menus-toolbar-insert-audio v-if="!disableMenu('audio')" />
            <menus-toolbar-insert-file v-if="!disableMenu('file')" />
            <menus-toolbar-insert-code-block
              v-if="!disableMenu('code-block')"
            />
            <menus-toolbar-insert-symbol v-if="!disableMenu('symbol')" />
            <menus-toolbar-insert-chinese-date
              v-if="!disableMenu('chinese-date')"
            />
            <menus-toolbar-insert-emoji v-if="!disableMenu('emoji')" />
            <menus-toolbar-insert-math v-if="!disableMenu('math')" />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-insert-tag v-if="!disableMenu('tag')" />
            <menus-toolbar-insert-columns v-if="!disableMenu('columns')" />
            <menus-toolbar-insert-callout v-if="!disableMenu('callout')" />
            <menus-toolbar-insert-mention v-if="!disableMenu('mention')" />
            <menus-toolbar-insert-bookmark v-if="!disableMenu('bookmark')" />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-insert-hard-break
              v-if="!disableMenu('hard-break')"
            />
            <menus-toolbar-insert-hr v-if="!disableMenu('hr')" />
            <menus-toolbar-insert-toc v-if="!disableMenu('toc')" />
            <menus-toolbar-insert-text-box v-if="!disableMenu('text-box')" />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-insert-template v-if="!disableMenu('template')" />
            <menus-toolbar-insert-web-page v-if="!disableMenu('web-page')" />
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
            <menus-toolbar-tools-qrcode v-if="!disableMenu('qrcode')" />
            <menus-toolbar-tools-barcode v-if="!disableMenu('barcode')" />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-tools-signature v-if="!disableMenu('signature')" />
            <menus-toolbar-tools-seal v-if="!disableMenu('seal')" />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-tools-diagrams v-if="!disableMenu('diagrams')" />
            <menus-toolbar-tools-echarts v-if="!disableMenu('echarts')" />
            <!-- <menus-toolbar-tools-mind-map v-if="!disableMenu('mind-map')" /> -->
            <menus-toolbar-tools-mermaid v-if="!disableMenu('mermaid')" />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-tools-chinese-case
              v-if="!disableMenu('chinese-case')"
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
                  <menus-toolbar-page-size v-if="page.layout === 'page'" />
                </div>
                <div class="umo-virtual-group-row">
                  <menus-toolbar-page-orientation
                    v-if="page.layout === 'page'"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-page-break />
            <menus-toolbar-page-break-marks />
            <menus-toolbar-page-line-number />
            <menus-toolbar-page-watermark v-if="!disableMenu('watermark')" />
            <menus-toolbar-page-background v-if="!disableMenu('background')" />
          </div>
          <div class="umo-virtual-group">
            <menus-toolbar-page-preview v-if="!disableMenu('preview')" />
          </div>
          <div class="virtual-group is-slot">
            <slot name="toolbar_page" toolbar-mode="ribbon" />
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

const options = inject('options')
const page = inject('page')
const disableMenu = (name: string) => {
  return options.value.disableExtensions.includes(name)
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
