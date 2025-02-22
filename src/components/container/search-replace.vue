<template>
  <modal
    :visible="searchReplace"
    icon="search-replace"
    :header="t('search.title')"
    :footer="false"
    class="umo-search-replace-dialog"
    width="420px"
    mode="modeless"
    :z-index="200"
    @close="searchReplace = false"
  >
    <div class="umo-search-replace-container">
      <div class="umo-search-text">
        <t-input
          v-model="searchText"
          :placeholder="t('search.searchText')"
          clearable
          autofocus
          @enter="next"
        >
          <template #suffix>
            {{
              searchText !== '' && resultLength !== 0
                ? editor?.storage?.searchAndReplace?.resultIndex + 1
                : 0
            }}
            /
            {{ resultLength }}
          </template>
        </t-input>
        <t-button
          :disabled="resultLength === 0"
          shape="square"
          variant="text"
          @click="next"
        >
          <icon name="arrow-down" class="icon-next" />
        </t-button>
        <t-button
          :disabled="resultLength === 0"
          shape="square"
          variant="text"
          @click="previous"
        >
          <icon name="arrow-down" class="icon-prev" />
        </t-button>
      </div>
      <div class="umo-replace-text">
        <t-input
          v-model="replaceText"
          :placeholder="t('search.replaceText')"
          clearable
        />
      </div>
      <div class="umo-advanced-options">
        <t-checkbox v-model="caseSensitive">
          {{ t('search.caseSensitive') }}
        </t-checkbox>
      </div>
      <div class="umo-button-actions">
        <t-button
          :disabled="resultLength === 0"
          theme="default"
          variant="text"
          @click="replace"
          v-text="t('search.replace')"
        >
        </t-button>
        <t-button
          :disabled="resultLength === 0"
          theme="default"
          variant="text"
          @click="replaceAll"
          v-text="t('search.replaceAll')"
        >
        </t-button>
        <t-button
          :disabled="resultLength === 0"
          theme="primary"
          @click="next"
          v-text="t('search.search')"
        ></t-button>
      </div>
    </div>
  </modal>
</template>

<script setup lang="ts">
import { getSelectionText } from '@/extensions/selection'

const editor = inject('editor')
const searchReplace = inject('searchReplace')

let searchText = $ref<string>('')
let replaceText = $ref<string>('')
const caseSensitive = $ref<boolean>(false)

const resultLength = computed(
  () => editor.value?.storage.searchAndReplace?.results.length || 0,
)

const clear = () => {
  searchText = ''
  replaceText = ''
  editor.value?.commands.resetIndex()
}

const search = (clearIndex = false) => {
  if (!editor.value) {
    return
  }
  if (clearIndex) {
    editor.value.commands.resetIndex()
  }
  editor.value.commands.setSearchTerm(searchText)
  editor.value.commands.setReplaceTerm(replaceText)
  editor.value.commands.setCaseSensitive(caseSensitive)
}

const goToSelection = () => {
  if (!editor.value) {
    return
  }
  const { results, resultIndex } = editor.value.storage.searchAndReplace
  const position = results[resultIndex]
  if (!position) {
    return
  }
  editor.value.commands.setTextSelection(position)
  const { node } = editor.value.view.domAtPos(
    editor.value.state.selection.anchor,
  )
  ;(node as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
}

watch(
  () => searchText.trim(),
  (val: string, oldVal: string) => {
    if (!val) {
      clear()
    }
    if (val !== oldVal) {
      search(true)
    }
  },
)
watch(
  () => replaceText.trim(),
  (val: string, oldVal: string) => (val === oldVal ? null : search()),
)

watch(
  () => caseSensitive,
  (val: boolean, oldVal: boolean) => {
    if (val !== oldVal) {
      search(true)
    }
  },
)

const next = () => {
  editor.value?.commands.nextSearchResult()
  goToSelection()
}

const previous = () => {
  editor.value?.commands.previousSearchResult()
  goToSelection()
}

const replace = () => {
  editor.value?.commands.replace()
  goToSelection()
}

const replaceAll = () => editor.value?.commands.replaceAll()

watch(
  () => searchReplace.value,
  (visible: boolean) => {
    searchText = visible ? getSelectionText(editor.value) : ''
  },
)
</script>

<style lang="less" scoped>
.umo-search-text {
  margin-top: 5px;
  display: flex;
  :deep(.umo-input__wrap) {
    width: 300px;
    margin-right: 10px;
    .umo-input__suffix {
      font-size: 12px;
      opacity: 0.6;
    }
  }
  :deep(.umo-button) {
    .umo-icon {
      font-size: 20px;
      &.icon-prev {
        transform: rotate(-180deg);
      }
    }
  }
}
.umo-replace-text {
  margin-top: 12px;
}
.umo-advanced-options {
  margin-top: 12px;
  :deep(.umo-checkbox) {
    margin-right: 15px;
  }
}
.umo-button-actions {
  margin: 12px 0 -15px;
  text-align: right;
  :deep(.umo-button) {
    margin-left: 10px;
  }
}
</style>
<style lang="less">
.umo-search-replace-dialog {
  .umo-dialog {
    position: absolute;
    right: 25px;
    top: 131px;
    user-select: none;
  }
}
.umo-editor-container.toolbar-classic {
  .umo-search-replace-dialog {
    .umo-dialog {
      top: 65px;
    }
  }
}
</style>
