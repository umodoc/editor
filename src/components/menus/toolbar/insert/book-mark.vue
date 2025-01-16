<template>
  <menus-button ico="bookmark" :text="t('insert.bookmark.text')" huge @menu-click="dialogVisible = true" />
  <modal :visible="dialogVisible" icon="bookmark" :header="t('insert.bookmark.set')" width="420px" draggable
    destroy-on-close :confirm-btn="t('insert.bookmark.ok')" @confirm="insertbookmark" @close="dialogVisible = false">
    <div class="umo-link-container">
      <t-form label-align="top">
        <t-form-item :label="t('insert.bookmark.textName')" style="margin-bottom: 5px;">
          <t-input v-model.trim="bookMarktext" :status="'default'" :maxcharacter="30"
            :placeholder="t('insert.bookmark.placeholder')" clearable />
        </t-form-item>
        <t-form-item class="bookmarkClass">
          <t-table row-key="bmColId" :data="bookMarkData" :columns="bookMarkColumns" :height="'250'"
            :active-row-type="'single'" @active-change="onActiveChange" lazyLoad>
            <template #operation="{ row }">
              <t-button shape="circle" variant="text" @click="rowDelete(row)">{{t('insert.bookmark.delete')}}</t-button>
            </template>
          </t-table>
        </t-form-item>
      </t-form>
    </div>
  </modal>
</template>
<script setup lang="ts">
  import { getSelectionText } from '@/extensions/selection'
  import { TextSelection } from '@tiptap/pm/state'
  import { shortId } from '@/utils/short-id';
  const { editor } = useStore()
  //弹窗口显示隐藏 true显示 默认隐藏
  let dialogVisible = $ref(false)
  //书签名称
  let bookMarktext = $ref('')
  //书签数据
  let bookMarkData = $ref([])
  //书签表格显示列
  let bookMarkColumns = [{
    colKey: 'bmColName',
    title:t('insert.bookmark.textName'),// '书签名称',
    ellipsis: false,
    align: "left"
  },
  {
    colKey: 'operation',
    title: t('insert.bookmark.proName'),//'操作',
    width: 60,
    fixed: 'right',
    align: "center"
  }
  ]

  //书签插入
  const insertbookmark = () => {
    //书签名称不为空时不处理
    if (bookMarktext != null && bookMarktext != "") {
      let existbmName = ""
      if (bookMarkData.length > 0) {
        for (let i = 0; i < bookMarkData.length; i++) {
          if (bookMarkData[i].bmColName === bookMarktext) {
            existbmName = bookMarkData[i].bmColName
            break
          }
        }
      }
      //存在-1
      if (existbmName == "") {
        editor.value?.commands.setBookMark({ bookMarkName: bookMarktext })
        let data = getSelectionText(editor.value)
        if (data == null || data == "") {//无选中值时，用书签名称
          editor.value?.chain().focus().insertContent(bookMarktext).run()
        }
        dialogVisible = false
      }
      else {
        //querySelector(`bookmark[bookmarkid="${bookmarkId}"]`) 
        const element = editor.value?.view.dom.querySelector(`bookmark[bookMarkName="${existbmName}"]`)
        if (element) {
          element.scrollIntoView()
          const pos = editor.value?.view.posAtDOM(element, 0)
          const { tr } = editor.value?.view.state ?? {}
          tr?.setSelection(new TextSelection(tr.doc.resolve(pos ?? 0)))
          if (tr) {
            editor.value?.view.dispatch(tr)
            editor.value?.view.focus()
          }
        }
        dialogVisible = false
      }
    }
    else {
      const dialog = useAlert({
        theme: 'warning',
        header: t('insert.bookmark.text'),
        body: t('insert.bookmark.inputnmName'),// "请输入书签名称！",//t('base.importWord.loadScript.message'),
        onConfirm() {
          dialog.destroy()
        },
      })
    }
  }
  const onActiveChange = (highlightRowKeys: any, ctx: any) => {
    //重置文档
    bookMarktext = ctx.currentRowData?.bmColName
  }
  const rowDelete = (row: any) => {
    const element = editor.value?.view.dom.querySelector(`bookmark[bookMarkName="${row.bmColName}"]`)
    if (element) {
      const pos = editor.value?.view.posAtDOM(element, 0)
      const { tr } = editor.value?.view.state ?? {}
      if (tr) {
        const marks = editor.value?.view.state.doc.resolve(pos + 1)?.marks()
        if (marks != null && marks.length > 0) {
          for (let i = 0; i < marks.length; i++) {
            if (marks[i].type.name == "bookMark") {
              editor.value?.view.dispatch(tr.removeMark(pos, pos + element.outerText.length, marks[i]));
            }
          }
        }
        else {
          editor.value?.view.dispatch(tr.removeMark(pos, pos + element.outerText.length));
        }
        dialogVisible = false;
      }
    }

  }
  const getCurWordAllBookMark = () => {
    try {
      bookMarkData = []
      bookMarktext = ""
      const alltext = editor.value?.getHTML()
      const parser = new DOMParser();
      const doc = parser.parseFromString(alltext, 'text/html');
      // 获取所有的 <bookmark> 元素
      const bookmarks = doc.body.querySelectorAll("bookMark")
      let keyNode: String[] = [];
      Array.from(bookmarks).forEach(node => {
        if (node != null) {
          let bookName = node.getAttribute("bookMarkName")
          if (bookName != null && bookName != "" && keyNode.indexOf(bookName) == -1) {
            keyNode.push(bookName)
            bookMarkData.push({ bmColId: shortId(), bmColName: bookName })
          }
        }
      })
    }
    catch (e) {
      dialogVisible = false;
    }
  }
  watch(
    () => dialogVisible,
    () => {
      if (dialogVisible) {
        getCurWordAllBookMark()
      }
    }
  )
</script>

<style lang="less" scoped>
  /* 使用 :deep() 穿透到子组件 */
  .bookmarkClass :deep(table),
  .bookmarkClass :deep(th),
  .bookmarkClass :deep(td),
  .bookmarkClass :deep(tr) {
    border: none !important;
    padding: 4px;
  }
</style>