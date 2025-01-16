<template>
  <menus-button
    ico="bookmark"
    :text="t('insert.bookmark.text')"
    huge
    @menu-click="dialogVisible = true"
  />
  <modal
    :visible="dialogVisible"
    icon="bookmark"
    :header="t('insert.bookmark.set')"
    width="420px"
    draggable
    destroy-on-close
    :confirm-btn="t('insert.bookmark.ok')"
    @confirm="insertbookmark"
    @close="dialogVisible = false"
  >
    <div class="umo-link-container">
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
          <t-checkbox v-model="bookmark">显示书签</t-checkbox>
        </t-form-item>
      </t-form>
    </div>
  </modal>
</template>
<script setup lang="ts">
import { TextSelection } from '@tiptap/pm/state'

import Tooltip from '@/components/tooltip.vue'
import { getSelectionText } from '@/extensions/selection'
import { shortId } from '@/utils/short-id'
const { editor, bookmark } = useStore()
//弹窗口显示隐藏 true显示 默认隐藏
let dialogVisible = $ref(false)
//书签名称
let bookmarkText = $ref('')
//书签数据
let bookmarkData = $ref([])
//书签表格显示列
const bookmarkColumns = [
  {
    colKey: 'bookmarkRowName',
    title: t('insert.bookmark.textName'), // '书签名称',
    ellipsis: false,
    align: 'left',
  },
  {
    colKey: 'operation',
    title: t('insert.bookmark.actions'), //'操作',
    width: 70,
    fixed: 'right',
    align: 'center',
  },
]

//书签插入
const insertbookmark = () => {
  //书签名称不为空时不处理
  if (bookmarkText !== null && bookmarkText !== '') {
    let existbmName = ''
    if (bookmarkData.length > 0) {
      for (const item of bookmarkData) {
        if (item.bookmarkRowName === bookmarkText) {
          existbmName = item.bookmarkRowName
          break
        }
      }
    }
    //存在-1
    if (existbmName === '') {
      editor.value?.commands.setBookmark({ bookmarkName: bookmarkText })
      const data = getSelectionText(editor.value)
      if (data === null || data === '') {
        //无选中值时，用书签名称
        editor.value?.chain().focus().insertContent(bookmarkText).run()
      }
      dialogVisible = false
    } else {
      //querySelector(`bookmark[bookmarkid="${bookmarkId}"]`)
      const element = editor.value?.view.dom.querySelector(
        `bookmark[bookmarkName="${existbmName}"]`,
      )
      if (element) {
        element.scrollIntoView()
        const pos = editor.value?.view.posAtDOM(element, 0)
        const { tr } = editor.value?.view.state ?? {}
        tr?.setSelection(new TextSelection(tr.doc.resolve(pos ?? 0)))
        if (tr) {
          editor.value?.view.dispatch(tr)
        }
      }
      dialogVisible = false
    }
  } else {
    const dialog = useAlert({
      theme: 'warning',
      header: t('insert.bookmark.text'),
      body: t('insert.bookmark.emptyError'), // "请输入书签名称！",//t('base.importWord.loadScript.message'),
      onConfirm() {
        dialog.destroy()
      },
    })
  }
}
const onActiveChange = (highlightRowKeys: any, ctx: any) => {
  //重置文档
  bookmarkText = ctx.currentRowData?.bookmarkRowName
}
const rowDelete = (row: any) => {
  const element = editor.value?.view.dom.querySelector(
    `bookmark[bookmarkName="${row.bookmarkRowName}"]`,
  )
  if (element) {
    const pos = editor.value?.view.posAtDOM(element, 0)
    const { tr } = editor.value?.view.state ?? {}
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
    bookmarkData = []
    bookmarkText = ''
    const alltext = editor.value?.getHTML()
    const parser = new DOMParser()
    const doc = parser.parseFromString(alltext, 'text/html')
    // 获取所有的 <bookmark> 元素
    const bookmarks = doc.body.querySelectorAll('bookmark')
    const keyNode: string[] = []
    Array.from(bookmarks).forEach((node) => {
      if (node !== null) {
        const bookName = node.getAttribute('bookmarkName')
        if (
          bookName !== null &&
          bookName !== '' &&
          !keyNode.includes(bookName)
        ) {
          keyNode.push(bookName)
          bookmarkData.push({
            bookmarkRowId: shortId(),
            bookmarkRowName: bookName,
          })
        }
      }
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

<style lang="less" scoped>
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
