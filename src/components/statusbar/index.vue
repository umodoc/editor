<template>
  <div class="umo-status-bar">
    <div class="umo-status-bar-left">
      <tooltip :content="t('shortcut.title')">
        <t-button
          class="umo-status-bar-button"
          variant="text"
          size="small"
          @click="showShortcut = true"
        >
          <icon name="shortcut" />
        </t-button>
      </tooltip>
      <div class="umo-status-bar-split"></div>
      <t-popup
        v-if="editor"
        v-model="showWordCount"
        trigger="click"
        placement="top-left"
      >
        <t-button
          class="umo-status-bar-button auto-width word-count"
          variant="text"
          size="small"
        >
          <span v-if="selectionCharacters > 0">
            {{ selectionCharacters }}/
          </span>
          <span class="umo-word-count">{{ totalCharacters }}</span>
          {{ t('wordCount.characters') }}
          <icon
            name="arrow-down"
            :style="{ transform: `rotate(${showWordCount ? '180deg' : 0})` }"
          />
        </t-button>
        <template #content>
          <div v-if="showWordCount" class="umo-word-count-detail">
            <div class="umo-word-count-title">{{ t('wordCount.title') }}</div>
            <ul>
              <li>
                {{ t('wordCount.input') }}
                <span>
                  {{ totalCharacters }}
                </span>
              </li>
              <li>
                {{ t('wordCount.selection') }}
                <span>{{ selectionCharacters }}</span>
              </li>
              <li v-if="options.document?.characterLimit > 0">
                {{ t('wordCount.limit') }}
                <span>
                  {{ options.document?.characterLimit }}
                </span>
              </li>
            </ul>
          </div>
        </template>
      </t-popup>
    </div>
  </div>
  <t-drawer
    v-model:visible="showShortcut"
    :attach="container"
    size="320px"
    :footer="false"
    :close-btn="true"
    destroy-on-close
    show-in-attached-element
  >
    <template #header>
      <div class="umo-shortcuts-drawer-header">
        <icon name="shortcut" />
        {{ t('shortcut.title') }}
      </div>
    </template>
    <statusbar-shortcuts />
  </t-drawer>
</template>

<script setup>
const container = inject('container')
const editor = inject('editor')
const options = inject('options')

const showShortcut = $ref(false)

const showWordCount = $ref(false)
let totalCharacters = $ref(0)
let selectionCharacters = $ref(0)
const updateTotalCharacters = () => {
  if (!editor.value) {
    totalCharacters = 0
    return
  }
  const count = editor.value.storage?.characterCount?.characters?.()
  totalCharacters = typeof count === 'number' ? count : 0
}
const updateSelectionCharacters = () => {
  if (!editor.value) {
    selectionCharacters = 0
    return
  }
  const { selection } = editor.value.state
  const text = editor.value.state.doc.textBetween(
    selection.from,
    selection.to,
    '',
  )
  selectionCharacters = text.length
}
const updateTotalCharactersDebounced = useDebounceFn(updateTotalCharacters, 200)
const updateSelectionCharactersDebounced = useDebounceFn(
  updateSelectionCharacters,
  120,
)
const handleEditorCreate = () => {
  updateTotalCharacters()
  updateSelectionCharacters()
}
watch(
  () => editor.value,
  (nextEditor, prevEditor) => {
    if (prevEditor) {
      prevEditor.off('update', updateTotalCharactersDebounced)
      prevEditor.off('selectionUpdate', updateSelectionCharactersDebounced)
      prevEditor.off('create', handleEditorCreate)
    }
    if (nextEditor) {
      nextEditor.on('update', updateTotalCharactersDebounced)
      nextEditor.on('selectionUpdate', updateSelectionCharactersDebounced)
      nextEditor.on('create', handleEditorCreate)
      updateTotalCharacters()
      updateSelectionCharacters()
    }
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.umo-status-bar {
  padding: 6px;
  display: flex;
  justify-content: space-between;
  font-size: var(--umo-font-size-small);
  border-top: solid 1px var(--umo-border-color);

  @media screen and (max-width: 640px) {
    overflow-x: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .umo-status-bar-split {
    height: 16px;
    width: 1px;
    background-color: var(--umo-border-color);
    margin: 0 10px;
  }
  .umo-status-bar-button {
    --td-comp-size-xs: 18px;
    --td-comp-paddingLR-l: 8px;
    --td-radius-default: 2px;
    font-size: 14px;
    margin: 0 4px;
    color: var(--umo-text-color);
    &:not(.auto-width) {
      width: var(--td-comp-size-xs);
    }
    &.auto-width {
      --td-comp-paddingLR-s: 0;
      width: auto;
      :deep(.umo-button__text) {
        display: flex;
        align-items: center;
        gap: 3px;
        font-size: 12px;
        .umo-icon {
          font-size: 14px;
        }
      }
    }
    &.word-count {
      padding-left: 2px;
      padding-right: 0;
      :deep(.umo-button__text) {
        display: flex;
        align-items: center;
        .umo-icon {
          margin-left: 3px;
          transform: rotate(180deg);
        }
      }
    }
    :deep(.umo-button__text) {
      padding: 0 5px;
    }
  }
  &-left {
    display: flex;
    align-items: center;
  }
}
</style>

<style lang="scss">
.umo-shortcuts-drawer-header {
  display: flex;
  align-items: center;
  font-weight: 400;
  color: var(--umo-text-color);
  .umo-icon {
    font-size: 20px;
    margin-right: 6px;
  }
}
.umo-drawer__close-btn {
  margin-right: 3px;
}

.umo-word-count {
  margin-right: 0.25em;
  &-detail {
    padding: 10px 0 8px;
    width: 160px;
    font-size: 12px;
    color: var(--umo-text-color-light);
    ul {
      padding: 0;
      margin: 0;
    }
    li {
      list-style: none;
      cursor: default;
      padding: 0 12px;
      display: flex;
      justify-content: space-between;
      line-height: 28px;
      color: var(--umo-text-color);
      &:hover {
        background-color: var(--td-bg-color-container-hover);
      }
    }
  }
  &-title {
    padding: 0 12px;
    margin-bottom: 3px;
  }
}
</style>
