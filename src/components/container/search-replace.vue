<template>
  <modal
    :visible="searchReplace"
    icon="search-replace"
    title="查找替换"
    :footer="false"
    class="search-replace-dialog"
    width="420px"
    mode="modeless"
    :z-index="200"
    @close="searchReplace = false"
  >
    <div class="search-replace-container">
      <div class="search-text">
        <t-input
          v-model="searchText"
          placeholder="要查找的字符"
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
      <div class="replace-text">
        <t-input v-model="replaceText" placeholder="要替换的字符" clearable />
      </div>
      <div class="advanced-options">
        <t-checkbox v-model="caseSensitive">区分大小写(英文)</t-checkbox>
      </div>
      <div class="button-actions">
        <t-button
          :disabled="resultLength === 0"
          theme="default"
          variant="text"
          @click="replace"
        >
          替换
        </t-button>
        <t-button
          :disabled="resultLength === 0"
          theme="default"
          variant="text"
          @click="replaceAll"
        >
          全部替换
        </t-button>
        <t-button :disabled="resultLength === 0" theme="primary" @click="next"
          >查找</t-button
        >
      </div>
    </div>
  </modal>
</template>

<script setup>
const { editor, searchReplace } = useStore()

let searchText = $ref('')
let replaceText = $ref('')
let caseSensitive = $ref(false)
useHotkeys('ctrl+f, command+f', () => (searchReplace.value = true))

const resultLength = computed(
  () => editor.value?.storage?.searchAndReplace?.results.length || 0,
)

const clear = () => {
  searchText = ''
  replaceText = ''
  editor.value.commands.resetIndex()
}

const search = (clearIndex = false) => {
  if (!editor.value) return
  if (clearIndex) {
    editor.value.commands.resetIndex()
  }
  editor.value.commands.setSearchTerm(searchText)
  editor.value.commands.setReplaceTerm(replaceText)
  editor.value.commands.setCaseSensitive(caseSensitive)
}

const goToSelection = () => {
  if (!editor.value) return
  const { results, resultIndex } = editor.value.storage.searchAndReplace
  const position = results[resultIndex]
  if (!position) return
  editor.value.commands.setTextSelection(position)
  const { node } = editor.value.view.domAtPos(
    editor.value.state.selection.anchor,
  )
  node && node.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

watch(
  () => searchText.trim(),
  (val, oldVal) => {
    if (!val) clear()
    if (val !== oldVal) search(true)
  },
)
watch(
  () => replaceText.trim(),
  (val, oldVal) => (val === oldVal ? null : search()),
)

watch(
  () => caseSensitive,
  (val, oldVal) => (val === oldVal ? null : search(true)),
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
  () => clear(),
)
</script>

<style lang="less" scoped>
.search-text {
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
    .icon {
      font-size: 20px;
      &.icon-prev {
        transform: rotate(-180deg);
      }
    }
  }
}
.replace-text {
  margin-top: 12px;
}
.advanced-options {
  margin-top: 12px;
  :deep(.umo-checkbox) {
    margin-right: 15px;
  }
}
.button-actions {
  margin: 12px 0 -15px;
  text-align: right;
  :deep(.umo-button) {
    margin-left: 10px;
  }
}
</style>
<style lang="less">
.search-replace-dialog {
  .umo-dialog {
    position: absolute;
    right: 25px;
    top: 141px;
    user-select: none;
  }
}
.umo-editor-container.toolbar-classic {
  .search-replace-dialog {
    .umo-dialog {
      top: 75px;
    }
  }
}
</style>
