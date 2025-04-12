<template>
  <menus-button
    ico="chinese-case"
    :text="t('tools.chineseCase.text')"
    :tooltip="t('tools.chineseCase.tip')"
    :disabled="selectionText === ''"
    menu-type="dropdown"
    huge
    overlay-class-name="umo-chinese-case-dropdown"
  >
    <template #dropmenu>
      <t-dropdown-menu>
        <t-dropdown-item
          v-for="item in options"
          :key="item.value"
          :value="item.value"
          :divider="item.divider"
          @click="setChineseCase(item.func)"
        >
          <div class="label">{{ item.label }}</div>
          <div class="desc">{{ item.desc }}</div>
        </t-dropdown-item>
      </t-dropdown-menu>
    </template>
  </menus-button>
</template>

<script setup lang="ts">
import nzh from 'nzh/cn'

import { getSelectionText } from '@/extensions/selection'

const editor = inject('editor')
const container = inject('container')

const options: {
  label: string
  desc: string
  func: (text: string) => string
  divider?: boolean
  value?: string | number
}[] = [
  {
    label: '数字小写金额 → 中文大写金额',
    desc: '人民币伍佰肆拾叁元贰角壹分',
    func(text) {
      const number = text
        .toString()
        .replaceAll(',', '')
        .replaceAll('￥', '')
        .replaceAll(' ', '')
      return nzh.toMoney(number, { unOmitYuan: true, forceZheng: true })
    },
  },
  {
    label: '阿拉伯数字 → 中文小写',
    desc: '十万零一百一十一',
    func: (text) => nzh.encodeS(text),
  },
  {
    label: '科学记数法 → 中文小写',
    desc: '1.23456789e+21',
    func: (text) => nzh.encodeS(text),
    divider: true,
  },
  {
    label: '中文大写金额 → 数字小写金额',
    desc: '￥54,321.00',
    func(text) {
      const char = text
        .replaceAll('人民币', '')
        .replaceAll('元', '')
        .replaceAll('整', '')
      const amount = nzh.decodeB(char).toString()

      // 使用正则表达式添加千位分隔符
      const parts = amount.split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      // 如果有小数部分，保留两位小数
      if (parts.length === 2) {
        parts[1] = parts[1].padEnd(2, '0')
      } else {
        parts.push('00')
      }
      // 拼接为金额格式的字符串
      const result = parts.join('.')
      return `￥${result}`
    },
  },
  {
    label: '中文小写 → 阿拉伯数字',
    desc: '54321',
    func: (text) => nzh.decodeS(text),
  },
]

let selectionText = $ref('')
onMounted(() => {
  editor.value.on('selectionUpdate', () => {
    const throttleFn = useThrottleFn(() => {
      const text = getSelectionText(editor.value)
      selectionText = text
    }, 200)
    void throttleFn()
  })
})

const setChineseCase = (func: (text: string) => string) => {
  if (!editor.value) {
    return
  }
  if (selectionText === '') {
    return
  }
  let content = ''
  try {
    content = func(selectionText)
  } catch {
    useMessage('error', {
      attach: container,
      content: '大小写转化失败，请检查当前选中的文本。',
    })
  }
  if (!content) {
    throw new Error('转换失败')
  }
  editor.value.chain().focus().insertContent(content.toString()).run()
}
</script>

<style lang="less">
.umo-chinese-case-dropdown {
  .umo-dropdown__item {
    max-width: unset !important;
    &-text {
      padding: 5px;
      .label {
        font-size: 14px;
        color: var(--umo-text-color);
      }
      .desc {
        color: var(--umo-text-color-light);
        margin-top: -3px;
      }
    }
  }
}
</style>
