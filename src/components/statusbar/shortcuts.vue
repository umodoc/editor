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
            <span
              v-else-if="item.html"
              class="shortcut-icon"
              v-html="item.html"
            >
            </span>
            <component :is="item.tag" v-if="item.tag">{{
              item.label
            }}</component>
            <span v-else :class="item.className || ''">{{ item.label }}</span>
          </span>
          <div class="keyboard-shortcut">
            <template v-for="key in item.keys" :key="key">
              <kbd v-if="key !== 'TEXT'">{{ getShortcut(key) }}</kbd>
              <span v-else v-text="t('shortcut.text')"></span>
            </template>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getShortcut } from '@/utils/shortcut'

const options = inject('options')
const $document = useState('document', options)

const shortcuts = $ref<
  {
    title: string
    items: {
      icon?: string
      html?: string
      tag?: string
      className?: string
      label: string
      keys: string[]
    }[]
  }[]
>([
  {
    title: t('shortcut.commonlyUsed'),
    items: [
      { label: t('shortcut.copy'), keys: ['Ctrl', 'C'] },
      { label: t('shortcut.paste'), keys: ['Ctrl', 'V'] },
      { label: t('shortcut.pasteAsText'), keys: ['Ctrl', 'Shift', 'V'] },
      { label: t('base.undo'), keys: ['Ctrl', 'Z'] },
      { label: t('base.redo'), keys: ['Ctrl', 'Y'] },
      { label: t('base.selectAll'), keys: ['Ctrl', 'A'] },
      { label: t('search.text'), keys: ['Ctrl', 'F'] },
      { label: t('shortcut.paragraph'), keys: ['Enter'] },
      { label: t('shortcut.hardBreak'), keys: ['Shift', 'Enter'] },
      { label: t('save.text'), keys: ['Ctrl', 'S'] },
      { label: t('print.text'), keys: ['Ctrl', 'P'] },
    ],
  },
  {
    title: t('shortcut.format'),
    items: [
      { icon: 'bold', tag: 'b', label: t('base.bold'), keys: ['Ctrl', 'B'] },
      {
        icon: 'italic',
        tag: 'i',
        label: t('base.italic'),
        keys: ['Ctrl', 'I'],
      },
      {
        icon: 'underline',
        tag: 'u',
        label: t('base.underline'),
        keys: ['Ctrl', 'U'],
      },
      {
        icon: 'strike',
        tag: 's',
        label: t('base.strike'),
        keys: ['Ctrl', 'Shift', 'X'],
      },
      { icon: 'indent', label: t('base.indent'), keys: ['Tab'] },
      { icon: 'outdent', label: t('base.outdent'), keys: ['Shift', 'Tab'] },
    ],
  },
  {
    title: t('shortcut.page'),
    items: [
      { label: t('page.break'), keys: ['Ctrl', 'Enter'] },
      { label: t('shortcut.pageZoomIn'), keys: ['Ctrl', '+'] },
      { label: t('shortcut.pageZoomOut'), keys: ['Ctrl', '-'] },
      { label: t('shortcut.pageZoomReset'), keys: ['Ctrl', '1'] },
      { label: t('shortcut.pageAutoWidth'), keys: ['Ctrl', '0'] },
      { label: t('fullscreen.title'), keys: ['Ctrl', 'F11'] },
    ],
  },
])

if ($document.value.enableMarkdown) {
  shortcuts.push({
    title: t('shortcut.markdown'),
    items: [
      {
        html: 'H<sub>1</sub>',
        tag: 'b',
        className: 'heading1',
        label: t('base.heading.text', { level: 1 }),
        keys: ['#', '⎵'],
      },
      {
        html: 'H<sub>2</sub>',
        tag: 'b',
        className: 'heading2',
        label: t('base.heading.text', { level: 2 }),
        keys: ['##', '⎵'],
      },
      {
        html: 'H<sub>3</sub>',
        tag: 'b',
        className: 'heading3',
        label: t('base.heading.text', { level: 3 }),
        keys: ['###', '⎵'],
      },
      {
        html: 'H<sub>4</sub>',
        tag: 'b',
        className: 'heading4',
        label: t('base.heading.text', { level: 4 }),
        keys: ['####', '⎵'],
      },
      {
        html: 'H<sub>5</sub>',
        tag: 'b',
        className: 'heading5',
        label: t('base.heading.text', { level: 5 }),
        keys: ['#####', '⎵'],
      },
      {
        html: 'H<sub>6</sub>',
        tag: 'b',
        className: 'heading6',
        label: t('base.heading.text', { level: 6 }),
        keys: ['######', '⎵'],
      },
      {
        icon: 'bold',
        tag: 'b',
        label: t('base.bold'),
        keys: ['**', 'TEXT', '**'],
      },
      {
        icon: 'italic',
        tag: 'i',
        label: t('base.italic'),
        keys: ['*', 'TEXT', '*'],
      },
      {
        icon: 'strike',
        tag: 's',
        label: t('base.strike'),
        keys: ['~~', 'TEXT', '~~'],
      },
      {
        icon: 'subscript',
        tag: 'sub',
        label: t('base.subscript'),
        keys: ['~', 'TEXT', '~'],
      },
      {
        icon: 'superscript',
        tag: 'sup',
        label: t('base.superscript'),
        keys: ['^', 'TEXT', '^'],
      },
      {
        icon: 'bullet-list',
        label: `· ${t('list.bullet.text')}`,
        keys: ['*', '⎵'],
      },
      {
        icon: 'ordered-list',
        label: `1. ${t('list.ordered.text')}`,
        keys: ['1.', '⎵'],
      },
      { icon: 'task-list', label: t('list.task.text'), keys: ['[ ]', '⎵'] },
      {
        icon: 'quote',
        tag: 'blockquote',
        label: t('base.quote'),
        keys: ['>', '⎵'],
      },
      {
        icon: 'code',
        tag: 'code',
        label: t('base.code'),
        keys: ['`', 'TEXT', '`'],
      },
      {
        icon: 'math',
        label: t('insert.math'),
        keys: ['$', 'TEXT', '$'],
      },
      {
        icon: 'highlight',
        tag: 'mark',
        label: t('base.highlight.text'),
        keys: ['==', 'TEXT', '=='],
      },
      {
        icon: 'hr',
        label: t('insert.hr.text'),
        keys: ['---', 'Enter'],
      },
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
      .umo-icon,
      .shortcut-icon {
        margin: 0 10px 0 -2px;
      }
      sub {
        transform: translateY(3px);
      }
      sup {
        transform: translateY(-3px);
      }
      span.umo-icon {
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
