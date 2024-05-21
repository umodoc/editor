<template>
  <div class="keyboard-shortcuts">
    <template v-for="(group, index) in shortcuts" :key="index">
      <div class="keyboard-shortcuts-title">{{ group.title }}</div>
      <ul class="keyboard-shortcuts">
        <li v-for="(item, i) in group.items" :key="i">
          <span
            :class="item.className ? 'keyboard-shortcut-' + item.className : ''"
          >
            <icon v-if="item.icon" :name="item.icon" />
            <span v-else-if="item.html" class="icon" v-html="item.html"> </span>
            <component v-if="item.tag" :is="item.tag">{{
              item.label
            }}</component>
            <span v-else :class="item.className || ''">{{ item.label }}</span>
          </span>
          <div class="keyboard-shortcut">
            <template v-for="key in item.keys" :key="key">
              <kbd v-if="key !== 'TEXT'">{{ getShortcut(key) }}</kbd>
              <span v-else>文字</span>
            </template>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup>
// https://ckeditor.com/docs/ckeditor5/latest/features/keyboard-support.html#related-productivity-features
import getShortcut from '@/utils/shortcut'

const $document = useState('document')

const shortcuts = $ref([
  {
    title: '常用快捷键',
    items: [
      { label: '复制', keys: ['Ctrl', 'C'] },
      { label: '粘贴', keys: ['Ctrl', 'V'] },
      { label: '粘贴纯文本', keys: ['Ctrl', 'Shift', 'V'] },
      { label: '撤销', keys: ['Ctrl', 'Z'] },
      { label: '重做', keys: ['Ctrl', 'Y'] },
      { label: '全选', keys: ['Ctrl', 'A'] },
      { label: '查找 / 替换', keys: ['Ctrl', 'F'] },
      { label: '插入新段落', keys: ['Enter'] },
      { label: '换行', keys: ['Shift', 'Enter'] },
      { label: '保存', keys: ['Ctrl', 'S'] },
      { label: '打印', keys: ['Ctrl', 'P'] },
    ],
  },
  {
    title: '文字格式',
    items: [
      { icon: 'bold', tag: 'b', label: '粗体', keys: ['Ctrl', 'B'] },
      { icon: 'italic', tag: 'i', label: '斜体', keys: ['Ctrl', 'I'] },
      { icon: 'underline', tag: 'u', label: '下划线', keys: ['Ctrl', 'U'] },
      {
        icon: 'strike',
        tag: 's',
        label: '删除线',
        keys: ['Ctrl', 'Shift', 'X'],
      },
      { icon: 'indent', label: '减少缩进', keys: ['Shift', 'Tab'] },
      { icon: 'outdent', label: '增加缩进', keys: ['Tab'] },
    ],
  },
  {
    title: '页面显示',
    items: [
      { label: '插入分页', keys: ['Ctrl', 'Enter'] },
      { label: '页面放大', keys: ['Ctrl', '+'] },
      { label: '页面缩小', keys: ['Ctrl', '-'] },
      { label: '缩放到初始比例', keys: ['Ctrl', '1'] },
      { label: '缩放到最佳比例', keys: ['Ctrl', '0'] },
      { label: '演示模式', keys: ['F5'] },
      { label: '全屏模式', keys: ['F11'] },
    ],
  },
])

if ($document.value.markdown) {
  shortcuts.push({
    title: 'Markdown 格式',
    items: [
      {
        html: 'H<sub>1</sub>',
        tag: 'b',
        className: 'heading1',
        label: '标题1',
        keys: ['#', '⎵'],
      },
      {
        html: 'H<sub>2</sub>',
        tag: 'b',
        className: 'heading2',
        label: '标题2',
        keys: ['##', '⎵'],
      },
      {
        html: 'H<sub>3</sub>',
        tag: 'b',
        className: 'heading3',
        label: '标题3',
        keys: ['###', '⎵'],
      },
      {
        html: 'H<sub>4</sub>',
        tag: 'b',
        className: 'heading4',
        label: '标题4',
        keys: ['####', '⎵'],
      },
      {
        html: 'H<sub>5</sub>',
        tag: 'b',
        className: 'heading5',
        label: '标题5',
        keys: ['#####', '⎵'],
      },
      {
        html: 'H<sub>6</sub>',
        tag: 'b',
        className: 'heading6',
        label: '标题6',
        keys: ['######', '⎵'],
      },
      { icon: 'bold', tag: 'b', label: '粗体', keys: ['**', 'TEXT', '**'] },
      { icon: 'italic', tag: 'i', label: '斜体', keys: ['*', 'TEXT', '*'] },
      {
        icon: 'strike',
        tag: 's',
        label: '删除线',
        keys: ['~~', 'TEXT', '~~'],
      },
      {
        icon: 'subscript',
        tag: 'sub',
        label: '下标',
        keys: ['~', 'TEXT', '~'],
      },
      {
        icon: 'superscript',
        tag: 'sup',
        label: '上标',
        keys: ['^', 'TEXT', '^'],
      },
      { icon: 'bullet-list', label: '· 无序列表', keys: ['*', '⎵'] },
      { icon: 'ordered-list', label: '1. 有序列表', keys: ['1.', '⎵'] },
      { icon: 'task', label: '待办事项', keys: ['[ ]', '⎵'] },
      { icon: 'quote', tag: 'blockquote', label: '引用', keys: ['>', '⎵'] },
      { icon: 'code', tag: 'code', label: '代码', keys: ['`', 'TEXT', '`'] },
      {
        icon: 'mathematics',
        label: '数学公式',
        keys: ['$', 'TEXT', '$'],
      },
      {
        icon: 'highlight',
        tag: 'mark',
        label: '文本高亮',
        keys: ['==', 'TEXT', '=='],
      },
      { icon: 'horizontal-line', label: '分割线', keys: ['---', 'Enter'] },
    ],
  })
}
</script>

<style lang="less" scoped>
.keyboard-shortcuts-title {
  margin: 0 0 10px 0;
  font-size: 12px;
  &:not(:first-child) {
    margin-top: 20px;
  }
}
.keyboard-shortcuts {
  li {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    font-size: 12px;
    color: var(--umo-text-color);
    &:not(:last-child) {
      border-bottom: solid 1px var(--umo-border-color);
    }
    line-height: 1.4;
    span {
      display: flex;
      align-items: center;
      .icon {
        margin: 0 10px 0 -2px;
      }
      sub {
        transform: translateY(3px);
      }
      sup {
        transform: translateY(-3px);
      }
      span.icon {
        font-weight: 700;
        margin-right: 8px;
        :deep(sub) {
          font-size: 6px;
          margin-top: 4px;
          color: var(--umo-primary-color);
        }
      }
    }
    .keyboard-shortcut {
      display: flex;
      align-items: center;
      kbd {
        border: solid 1px var(--umo-border-color);
        padding: 0 5px;
        border-radius: 3px;
        color: var(--umo-text-color);
        background-color: var(--umo-button-hover-background);
        margin: 0 3px;
        border-bottom-width: 2px;
      }
      &-heading1 b {
        font-size: 20px;
      }
      &-heading2 b {
        font-size: 18px;
      }
      &-heading3 b {
        font-size: 16px;
      }
      &-heading4 b {
        font-size: 14px;
      }
      &-heading5 b {
        font-size: 12px;
      }
      &-heading6 b {
        font-size: 10px;
      }
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.01);
      .keyboard-shortcut kbd {
        border-color: var(--umo-text-color);
      }
    }
  }
  blockquote {
    padding-left: 10px;
    border-left: solid 3px var(--umo-border-color);
  }
  code {
    border: solid 1px var(--umo-border-color);
    border-radius: 3px;
    background-color: var(--umo-button-hover-background);
    padding: 0 5px;
    display: inline;
  }
}
</style>
