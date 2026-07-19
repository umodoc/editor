<template>
  <node-view-wrapper
    as="li"
    ref="wrapperRef"
    class="umo-list-item"
    :class="wrapperClass"
    :data-checked="isTaskChecked || null"
    data-list-item=""
  >
    <t-dropdown
      v-if="isOrderedList"
      trigger="click"
      overlay-class-name="umo-list-item-popup"
      :visible="editor?.isEditable && markerMenuVisible"
      size="small"
      :popup-props="popupProps"
    >
      <span
        class="umo-list-item-marker is-ordered-list-marker"
        contenteditable="false"
        data-list-marker=""
        @mousedown.prevent
        @click.stop="focusListItem"
      >
        <span class="umo-list-item-marker-text">{{ markerText }}</span>
      </span>
      <template #dropdown>
        <t-dropdown-menu>
          <t-dropdown-item
            class="umo-list-item-menu-item"
            :disabled="menuState.continuePreviousDisabled"
            @click="continueNumbering"
          >
            <icon name="continued-outlined" />
            <span>{{ t('list.ordered.continuePrevious') }}</span>
          </t-dropdown-item>
          <t-dropdown-item
            class="umo-list-item-menu-item"
            :disabled="menuState.startNewDisabled"
            @click="startNewList"
          >
            <icon name="new-outlined" />
            <span>{{ t('list.ordered.startNew') }}</span>
          </t-dropdown-item>
          <t-dropdown-item
            divider
            class="umo-list-item-menu-item"
            :disabled="menuState.changeStartDisabled"
            @click="openStartDialog"
          >
            <icon name="reset-outlined" />
            <span>{{ t('list.ordered.changeStart') }}</span>
          </t-dropdown-item>
          <t-dropdown-item class="umo-list-item-menu-item">
            <t-dropdown
              class="umo-list-item-menu-item"
              trigger="click"
              placement="right-top"
              :popup-props="submenuPopupProps"
            >
              <div class="umo-list-item-submenu-trigger" @click.stop>
                <icon name="ordered-list" />
                <span>{{ t('list.ordered.numberType') }}</span>
              </div>
              <template #dropdown>
                <t-dropdown-menu>
                  <t-dropdown-item
                    v-for="item in orderedListTypeOptions"
                    :key="item.value"
                    class="umo-list-item-menu-item"
                    :class="{ 'is-active': orderedListType === item.value }"
                    @click="changeOrderedListType(item.value)"
                  >
                    {{ item.label }}
                  </t-dropdown-item>
                </t-dropdown-menu>
              </template>
            </t-dropdown>
          </t-dropdown-item>
        </t-dropdown-menu>
      </template>
    </t-dropdown>
    <t-dropdown
      v-else-if="isBulletList"
      trigger="click"
      overlay-class-name="umo-list-item-popup"
      :visible="editor?.isEditable && markerMenuVisible"
      size="small"
      :popup-props="popupProps"
    >
      <span
        class="umo-list-item-marker is-bullet-list-marker"
        contenteditable="false"
        data-list-marker=""
        @mousedown.prevent
        @click.stop="focusListItem"
      >
        <span class="umo-list-item-marker-text">{{ markerText }}</span>
      </span>
      <template #dropdown>
        <t-dropdown-menu>
          <t-dropdown-item
            v-for="item in bulletListTypeOptions"
            :key="item.value"
            class="umo-list-item-menu-item"
            :class="{ 'is-active': bulletListType === item.value }"
            @click="changeBulletListType(item.value)"
          >
            <span class="umo-list-item-submenu-marker">{{ item.marker }}</span>
            <span>{{ item.label }}</span>
          </t-dropdown-item>
        </t-dropdown-menu>
      </template>
    </t-dropdown>
    <label
      v-else-if="isTaskItem"
      class="umo-list-item-task-marker"
      contenteditable="false"
      @mousedown.prevent
    >
      <input
        class="umo-list-item-task-checkbox"
        type="checkbox"
        :checked="isTaskChecked"
        :disabled="!editor?.isEditable"
        @change.stop="toggleTaskItemChecked"
      />
    </label>
    <modal
      :visible="startDialogVisible"
      width="360px"
      :header="t('list.ordered.changeStart')"
      :confirm-btn="t('list.ordered.apply')"
      destroy-on-close
      @close="closeStartDialog"
      @confirm="applyStartValue"
    >
      <div class="umo-list-item-start-dialog">
        <t-input-number
          v-model="pendingStart"
          :min="1"
          theme="column"
          autofocus
        >
          <template #label>
            <span>{{ t('list.ordered.startValue') }}</span>
          </template>
        </t-input-number>
      </div>
    </modal>
    <node-view-content
      as="div"
      class="umo-list-item-content"
      data-list-item-content=""
    />
  </node-view-wrapper>
</template>

<script setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

import {
  getListItemContext,
  isContinueOrderedListNumberingUnchanged,
  normalizeOrderedListStart,
  observeListItemMetricResize,
  unobserveListItemMetricResize,
} from './utils'

const BULLET_MARKERS = {
  disc: '•',
  circle: '◦',
  square: '▪',
}

const props = defineProps(nodeViewProps)

const container = inject('container')
const editor = inject('editor')
const listItemState = $computed(() => editor?.storage?.listItem?.state)

let wrapperRef = $ref(null)
let markerMenuVisible = $ref(false)
let startDialogVisible = $ref(false)
let pendingStart = $ref(1)
let syncFrame = $ref(0)
let menuState = $ref({
  continuePreviousDisabled: true,
  startNewDisabled: true,
  changeStartDisabled: true,
})
let stopMetricObservationWatch = null
let stopMetricSyncWatch = null
let observedContentElement = null

const getWrapperElement = () => wrapperRef?.$el || wrapperRef || null

const getContentElement = () =>
  getWrapperElement()?.querySelector('[data-list-item-content]') || null

const clearMarkerMetricVars = (wrapperElement) => {
  if (!wrapperElement) {
    return
  }

  wrapperElement.style.removeProperty('--umo-list-marker-font-size')
  wrapperElement.style.removeProperty('--umo-list-marker-offset-y')
}

const getMarkerSourceElement = (contentElement) => {
  if (!contentElement) {
    return null
  }

  return contentElement.firstElementChild || contentElement
}

const getTextNodesWalker = (element) =>
  document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      return node.textContent?.trim()
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP
    },
  })

const getMarkerTextMetrics = (element) => {
  if (!element) {
    return null
  }

  const walker = getTextNodesWalker(element)
  let currentTextNode = walker.nextNode()
  const lineGroups = []
  const styleCache = new WeakMap()
  let maxFontSize = 0

  while (currentTextNode) {
    const styleTarget = currentTextNode.parentElement || element
    let fontSize = styleCache.get(styleTarget)
    if (!fontSize) {
      ;({ fontSize } = window.getComputedStyle(styleTarget))
      styleCache.set(styleTarget, fontSize)
    }
    const parsedFontSize = Number.parseFloat(fontSize)
    if (Number.isFinite(parsedFontSize) && parsedFontSize > maxFontSize) {
      maxFontSize = parsedFontSize
    }

    const range = document.createRange()
    range.selectNodeContents(currentTextNode)
    const textRects = Array.from(range.getClientRects()).filter(
      (rect) => rect.height > 0,
    )
    range.detach?.()

    textRects.forEach((rect) => {
      const lineGroup = lineGroups.find(
        (group) => Math.abs(group.top - rect.top) < 1,
      )
      if (lineGroup) {
        lineGroup.top = Math.min(lineGroup.top, rect.top)
        lineGroup.bottom = Math.max(lineGroup.bottom, rect.bottom)
        lineGroup.height = Math.max(lineGroup.height, rect.height)
        return
      }

      lineGroups.push({
        top: rect.top,
        bottom: rect.bottom,
        height: rect.height,
      })
    })

    currentTextNode = walker.nextNode()
  }

  if (!lineGroups.length) {
    return {
      fontSize: maxFontSize > 0 ? maxFontSize : null,
      firstLineTop: null,
      firstLineHeight: null,
    }
  }

  lineGroups.sort((a, b) => a.top - b.top)
  const [firstLine] = lineGroups

  return {
    fontSize: maxFontSize > 0 ? maxFontSize : null,
    firstLineTop: firstLine.top,
    firstLineHeight: Math.max(
      firstLine.height,
      firstLine.bottom - firstLine.top,
    ),
  }
}

const syncMarkerMetrics = () => {
  const wrapperElement = getWrapperElement()
  if (!wrapperElement || !listItemContext) {
    clearMarkerMetricVars(wrapperElement)
    return
  }

  const contentElement = getContentElement()
  const sourceElement = getMarkerSourceElement(contentElement)
  if (!sourceElement) {
    clearMarkerMetricVars(wrapperElement)
    return
  }

  const styles = window.getComputedStyle(sourceElement)
  const { fontSize, lineHeight } = styles
  const textMetrics = getMarkerTextMetrics(sourceElement)
  const parsedFontSize = textMetrics?.fontSize || Number.parseFloat(fontSize)
  const sourceRect = sourceElement.getBoundingClientRect()
  const firstLineTop = textMetrics?.firstLineTop
  const firstLineHeight = textMetrics?.firstLineHeight
  const parsedLineHeight = Number.parseFloat(lineHeight)
  const markerLineHeight =
    Number.isFinite(firstLineHeight) && firstLineHeight > 0
      ? firstLineHeight
      : parsedLineHeight
  const markerLineTop =
    Number.isFinite(firstLineTop) &&
    Number.isFinite(sourceRect.top) &&
    firstLineTop >= sourceRect.top
      ? firstLineTop - sourceRect.top
      : 0
  const markerOffsetY =
    markerLineTop +
    (Number.isFinite(markerLineHeight) &&
    Number.isFinite(parsedFontSize) &&
    markerLineHeight > parsedFontSize
      ? (markerLineHeight - parsedFontSize) / 2
      : 0)
  wrapperElement.style.setProperty(
    '--umo-list-marker-font-size',
    Number.isFinite(parsedFontSize) && parsedFontSize > 0
      ? `${parsedFontSize}px`
      : fontSize,
  )
  wrapperElement.style.setProperty(
    '--umo-list-marker-offset-y',
    `${markerOffsetY}px`,
  )
}

const scheduleMarkerMetricsSync = () => {
  if (syncFrame) {
    cancelAnimationFrame(syncFrame)
  }

  syncFrame = requestAnimationFrame(() => {
    syncFrame = 0
    syncMarkerMetrics()
  })
}

const syncMetricObservation = () => {
  const nextContentElement = shouldObserveMetrics ? getContentElement() : null
  if (observedContentElement === nextContentElement) {
    return
  }

  if (observedContentElement) {
    unobserveListItemMetricResize(observedContentElement)
  }

  observedContentElement = nextContentElement

  if (observedContentElement) {
    observeListItemMetricResize(
      observedContentElement,
      scheduleMarkerMetricsSync,
    )
  }
}

const listItemContext = $computed(() => {
  listItemState?.structureVersion
  const { getPos } = props
  const state = editor.value?.state
  const listItemPos = typeof getPos === 'function' ? getPos() : null
  return getListItemContext(state, listItemPos)
})
const orderedContext = $computed(() =>
  listItemContext?.listTypeName === 'orderedList' ? listItemContext : null,
)
const orderedListTypeOptions = $computed(() => [
  { label: `1. ${t('list.ordered.decimal')}`, value: 'decimal' },
  {
    label: `01. ${t('list.ordered.decimalLeadingZero')}`,
    value: 'decimal-leading-zero',
  },
  { label: `i. ${t('list.ordered.lowerRoman')}`, value: 'lower-roman' },
  { label: `I. ${t('list.ordered.upperRoman')}`, value: 'upper-roman' },
  { label: `a. ${t('list.ordered.lowerLatin')}`, value: 'lower-latin' },
  { label: `A. ${t('list.ordered.upperLatin')}`, value: 'upper-latin' },
  {
    label: `一.${t('list.ordered.tradChineseInformal')}`,
    value: 'trad-chinese-informal',
  },
  {
    label: `壹.${t('list.ordered.simpChineseFormal')}`,
    value: 'simp-chinese-formal',
  },
])
const bulletListTypeOptions = $computed(() => [
  { label: t('list.bullet.disc'), marker: BULLET_MARKERS.disc, value: 'disc' },
  {
    label: t('list.bullet.circle'),
    marker: BULLET_MARKERS.circle,
    value: 'circle',
  },
  {
    label: t('list.bullet.square'),
    marker: BULLET_MARKERS.square,
    value: 'square',
  },
])

const listTypeName = $computed(() => listItemContext?.listTypeName || '')
const itemTypeName = $computed(() => listItemContext?.itemTypeName || '')
const isOrderedList = $computed(() => listTypeName === 'orderedList')
const isBulletList = $computed(() => listTypeName === 'bulletList')
const isTaskItem = $computed(() => itemTypeName === 'taskItem')
const isTaskChecked = $computed(() => listItemContext?.checked === true)
const markerText = $computed(() => listItemContext?.markerText || '')
const currentNumber = $computed(() => orderedContext?.currentNumber || 1)
const orderedListType = $computed(
  () => orderedContext?.orderedListNode?.attrs?.listType || 'decimal',
)
const bulletListType = $computed(() => listItemContext?.listType || 'disc')
const activeListItemPos = $computed(
  () => listItemState?.activeListItemPos ?? null,
)
const isCurrentItem = $computed(() => {
  if (!isOrderedList) {
    return false
  }
  const listItemPos = props.getPos?.()
  return (
    typeof activeListItemPos === 'number' && activeListItemPos === listItemPos
  )
})
const shouldObserveMetrics = $computed(
  () =>
    !!listItemContext && (!isOrderedList || isCurrentItem || markerMenuVisible),
)
const markerStateVersion = $computed(() =>
  isTaskItem ? Number(isTaskChecked) : markerText,
)
const metricContextVersion = $computed(() => {
  return [listTypeName, itemTypeName, markerStateVersion].join(':')
})
const wrapperClass = $computed(() => ({
  'is-ordered-list': isOrderedList,
  'is-bullet-list': isBulletList,
  'is-task-checked': isTaskChecked,
  'is-selected': isOrderedList && props.selected,
  'is-current-item': isCurrentItem,
  'is-marker-menu-active': isOrderedList && markerMenuVisible,
}))

const focusListItem = () => {
  const pos = props.getPos?.()
  if (typeof pos !== 'number') {
    return null
  }
  editor.value
    ?.chain()
    .focus()
    .setTextSelection(pos + 2)
    .run()
  return pos
}

const popupProps = $computed(() => ({
  attach: `${container} .umo-zoomable-container`,
  overlayClassName: 'umo-list-item-overlay',
  destroyOnClose: false,
  onVisibleChange: handleMarkerMenuVisibleChange,
}))

const refreshMenuState = () => {
  const context = orderedContext
  if (!context) {
    menuState = {
      continuePreviousDisabled: true,
      startNewDisabled: true,
      changeStartDisabled: true,
    }
    return
  }

  menuState = {
    continuePreviousDisabled: isContinueOrderedListNumberingUnchanged(context),
    startNewDisabled:
      context.listItemIndex === 0 && context.orderedListStart === 1,
    changeStartDisabled: false,
  }
}

const closeMarkerMenu = () => {
  markerMenuVisible = false
}

const handleMarkerMenuVisibleChange = (visible) => {
  if (visible) {
    if (!editor.value?.isEditable) {
      markerMenuVisible = false
      return
    }
    focusListItem()
    refreshMenuState()
  }
  markerMenuVisible = visible
}

const openStartDialog = () => {
  if (menuState.changeStartDisabled) {
    return
  }
  pendingStart = currentNumber
  closeMarkerMenu()
  startDialogVisible = true
}

const closeStartDialog = () => {
  startDialogVisible = false
  pendingStart = currentNumber
}

const applyStartValue = () => {
  const nextStart = normalizeOrderedListStart(pendingStart)
  runOrderedListCommand('setOrderedListStartAtItem', {
    start: nextStart,
  })
  startDialogVisible = false
}

const runOrderedListCommand = (command, options = {}) => {
  const pos = focusListItem()
  if (typeof pos !== 'number') {
    return
  }
  editor.value
    ?.chain()
    .focus()
    [command]({ ...options, listItemPos: pos })
    .run()
  closeMarkerMenu()
}

const continueNumbering = () => {
  if (menuState.continuePreviousDisabled) {
    return
  }
  runOrderedListCommand('continueOrderedListNumberingAtItem')
}

const startNewList = () => {
  if (menuState.startNewDisabled) {
    return
  }
  runOrderedListCommand('startNewOrderedListAtItem')
}

const changeOrderedListType = (listType) => {
  if (orderedListType === listType) {
    closeMarkerMenu()
    return
  }

  const pos = focusListItem()
  if (typeof pos !== 'number') {
    return
  }

  editor.value
    ?.chain()
    .focus()
    .updateAttributes('orderedList', { listType })
    .run()
  closeMarkerMenu()
}

const changeBulletListType = (listType) => {
  if (bulletListType === listType) {
    closeMarkerMenu()
    return
  }

  const pos = focusListItem()
  if (typeof pos !== 'number') {
    return
  }

  editor.value
    ?.chain()
    .focus()
    .updateAttributes('bulletList', { listType })
    .run()
  closeMarkerMenu()
}

const toggleTaskItemChecked = (event) => {
  const { target } = event
  if (!editor?.isEditable) {
    target.checked = isTaskChecked
    return
  }

  const { checked } = target
  const pos = props.getPos?.()
  if (typeof pos !== 'number') {
    target.checked = isTaskChecked
    return
  }

  editor
    ?.chain()
    .focus(undefined, { scrollIntoView: false })
    .command(({ tr }) => {
      const currentNode = tr.doc.nodeAt(pos)
      tr.setNodeMarkup(pos, undefined, {
        ...currentNode?.attrs,
        checked,
      })
      return true
    })
    .run()
}

onMounted(() => {
  stopMetricObservationWatch = watch(
    () => shouldObserveMetrics,
    async () => {
      await nextTick()
      syncMetricObservation()
      scheduleMarkerMetricsSync()
    },
    { immediate: true },
  )

  stopMetricSyncWatch = watch(
    () => metricContextVersion,
    async () => {
      await nextTick()
      scheduleMarkerMetricsSync()
    },
    { immediate: true },
  )
})

onBeforeUnmount(() => {
  stopMetricObservationWatch?.()
  stopMetricSyncWatch?.()
  if (syncFrame) {
    cancelAnimationFrame(syncFrame)
  }
  if (observedContentElement) {
    unobserveListItemMetricResize(observedContentElement)
  }
})
</script>

<style lang="less">
ul,
ol {
  list-style-type: none;
}

.umo-list-item-popup {
  .umo-popup__content {
    min-width: 180px;
  }
}

.umo-list-item-menu-item {
  .umo-dropdown__item-text {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .umo-icon {
    font-size: 16px;
  }

  &.is-active {
    .umo-dropdown__item-text {
      color: var(--umo-primary-color);
    }
  }
}

.umo-list-item-submenu-marker {
  display: inline-flex;
  align-items: center;
  font-size: 18px;
  line-height: 1;
}

.umo-list-item {
  --offset-y: var(--umo-list-marker-offset-y, 0);
  --font-size: var(--umo-list-marker-font-size, inherit);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.5em;
  min-width: 0;
  word-break: break-all;
  list-style-type: none;
  line-height: inherit;
  font-size: inherit;
  padding: 0.25em 0;

  .umo-list-item-marker {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    font-size: var(--font-size);
    line-height: 1;
    color: var(--umo-text-color);
    border-radius: 0.125em;
    white-space: nowrap;
    user-select: none;
    transform: translateY(var(--offset-y));
    &.is-ordered-list-marker {
      padding: 0 0.25em;
      margin-left: -0.1em;
      cursor: pointer;

      &:hover {
        background-color: var(--umo-content-table-selected-background);
      }
    }

    &.is-bullet-list-marker {
      padding: 0 0.25em;
      margin-left: -0.1em;
      cursor: pointer;

      &:hover {
        background-color: var(--umo-content-table-selected-background);
      }
    }
  }

  .umo-list-item-marker-text {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
  }

  .umo-list-item-task-marker {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transform: translateY(var(--offset-y));
  }

  .umo-list-item-task-checkbox {
    appearance: none;
    cursor: pointer;
    width: var(--font-size);
    height: var(--font-size);
    border: 1px solid #999;
    background-color: white;
    position: relative;
    margin: 0;
    opacity: 0.8;
    border-radius: calc(var(--font-size) * 0.125);

    &:hover {
      border-color: var(--umo-primary-color);
    }

    &:checked {
      background-color: var(--umo-primary-color);
      border-color: var(--umo-primary-color);

      &::after {
        content: '';
        width: 60%;
        height: 35%;
        border: 2px solid #fff;
        border-top: 0;
        border-right: 0;
        position: absolute;
        top: 42%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }

    &:disabled {
      cursor: default;
    }
  }

  &.is-ordered-list {
    &.is-current-item,
    &.is-selected,
    &.is-marker-menu-active {
      .umo-list-item-marker {
        background-color: var(--umo-content-table-selected-background);
      }
    }
  }

  &.is-task-checked {
    .umo-list-item-content > p {
      opacity: 0.5;
      text-decoration: line-through;
      margin: 0;

      &:has([style]) {
        text-decoration: inherit;
      }

      * {
        text-decoration: line-through;
      }
    }
  }
  &-overlay {
    .umo-popup__content {
      min-width: unset;
      .umo-dropdown__item-text {
        padding-right: 30px;
      }
    }
  }
  &-submenu-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    flex: 1;
  }
}

.umo-list-item-start-dialog {
  padding-top: 8px;

  .umo-input-number {
    width: 100%;
  }
}
</style>
