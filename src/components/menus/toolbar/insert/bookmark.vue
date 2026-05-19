<template>
  <menus-button
    ico="bookmark"
    :text="t('insert.bookmark.text')"
    huge
    @menu-click="dialogVisible = true"
  />
  <modal
    :visible="dialogVisible"
    width="420px"
    draggable
    destroy-on-close
    :confirm-btn="t('insert.bookmark.ok')"
    @confirm="insertBookmark"
    @close="dialogVisible = false"
  >
    <template #header>
      <icon name="bookmark" />
      {{ t('insert.bookmark.set') }}
    </template>
    <div class="umo-bookmark-container">
      <t-form label-align="top" colon>
        <t-form-item
          :label="t('insert.bookmark.textName')"
          style="margin-bottom: 10px"
        >
          <t-input
            v-model.trim="bookmarkText"
            status="default"
            :maxcharacter="30"
            :placeholder="t('insert.bookmark.placeholder')"
            clearable
          />
        </t-form-item>
        <t-form-item class="bookmark-list">
          <t-table
            row-key="bookmarkRowId"
            height="250"
            :data="bookmarkData"
            :columns="bookmarkColumns"
            :active-row-type="'single'"
            lazy-load
            @active-change="onActiveChange"
          >
            <template #operation="{ row }">
              <tooltip :content="t('insert.bookmark.delete')">
                <t-button
                  size="small"
                  shape="square"
                  variant="text"
                  @click="rowDelete(row)"
                  ><icon name="node-delete"
                /></t-button>
              </tooltip>
            </template>
          </t-table>
        </t-form-item>
        <t-form-item>
          <t-checkbox v-model="page.showBookmark">{{
            t('insert.bookmark.show')
          }}</t-checkbox>
        </t-form-item>
      </t-form>
    </div>
  </modal>
</template>
<script setup>
const container = inject('container')
const editor = inject('editor')
const page = inject('page')

let dialogVisible = $ref(false)
let bookmarkText = $ref('')
let bookmarkData = []
const bookmarkColumns = [
  {
    colKey: 'bookmarkRowName',
    title: t('insert.bookmark.textName'),
    ellipsis: false,
    align: 'left',
  },
  {
    colKey: 'operation',
    title: t('insert.bookmark.actions'),
    width: 70,
    fixed: 'right',
    align: 'center',
  },
]

const insertBookmark = () => {
  if (bookmarkText) {
    let existbmName = ''
    if (bookmarkData.length > 0) {
      for (const item of bookmarkData) {
        if (item.bookmarkRowName === bookmarkText) {
          existbmName = item.bookmarkRowName
          break
        }
      }
    }
    if (!existbmName) {
      if (editor.value?.commands.setBookmark({ bookmarkName: bookmarkText })) {
        dialogVisible = false
      }
    } else {
      if (editor.value?.commands.focusBookmark(existbmName)) {
        dialogVisible = false
      }
    }
  } else {
    const dialog = useAlert({
      attach: container,
      theme: 'warning',
      header: t('insert.bookmark.text'),
      body: t('insert.bookmark.emptyError'),
      onConfirm() {
        dialog.destroy()
      },
    })
  }
}
const onActiveChange = (highlightRowKeys, ctx) => {
  bookmarkText = ctx.currentRowData?.bookmarkRowName
}
const rowDelete = (row) => {
  const element = editor.value?.view.dom.querySelector(
    `bookmark[bookmarkName="${row.bookmarkRowName}"]`,
  )
  if (element) {
    const pos = editor.value?.view.posAtDOM(element, 0)
    const { tr } = editor.value?.view.state || {}
    if (tr) {
      const marks = editor.value?.view.state.doc.resolve(pos + 1)?.marks()
      if (marks !== null && marks.length > 0) {
        for (const mark of marks) {
          if (mark.type.name === 'bookmark') {
            editor.value?.view.dispatch(
              tr.removeMark(pos, pos + element.outerText.length, mark),
            )
          }
        }
      } else {
        editor.value?.view.dispatch(
          tr.removeMark(pos, pos + element.outerText.length),
        )
      }
      dialogVisible = false
    }
  }
}
const getCurWordAllBookmark = () => {
  try {
    bookmarkText = ''
    editor.value?.commands.getAllBookmarks((data) => {
      bookmarkData = data
    })
  } catch (e) {
    dialogVisible = false
  }
}
watch(
  () => dialogVisible,
  () => {
    if (dialogVisible) {
      getCurWordAllBookmark()
    }
  },
)
</script>

<style lang="scss" scoped>
.bookmark-list {
  border: solid 1px var(--umo-border-color-dark);
  border-radius: var(--umo-radius);
  margin-bottom: 5px;
  overflow: hidden;
  :deep(table) {
    th,
    td,
    tr {
      border: none !important;
      padding: 4px 10px;
    }
    th {
      border-bottom: solid 1px var(--umo-border-color) !important;
    }
  }
}
</style>
