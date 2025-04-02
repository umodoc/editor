<template>
  <menus-button
    ico="date"
    :text="t('insert.date')"
    menu-type="dropdown"
    huge
    :select-options="options"
    @click="insertDate"
  />
</template>

<script setup lang="ts">
// 月份
const formDate = (format: string) => useDateFormat(useNow(), format).value

const formatDateToChinese = (dateStr: string) => {
  const replaceDigits = (num: string) => {
    const digits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    return num
      .toString()
      .split('')
      .map((n) => digits[Number(n)])
      .join('')
  }

  return dateStr.replace(/\d+/g, (match) => {
    if (match.length === 4) {
      // 年份
      return replaceDigits(match)
    }
    if (match.length === 1) {
      // 月份或日期
      return replaceDigits(match)
    }
    if (match.length === 2) {
      const num1 = match.charAt(0)
      const num2 = match.charAt(1)
      if (num1 === '0') {
        return `${replaceDigits(num1)}十`
      }
      if (num1 === '1') {
        return `十${replaceDigits(num2)}`
      }
      if (num2 === '0') {
        return `${replaceDigits(num1)}十`
      }
      return `${replaceDigits(num1)}十${replaceDigits(num2)}`
    }
    return match // 其他情况不处理
  })
}

const options = [
  { content: '自定义日期', format: 'YYYY-M-D', capitalize: false },
  {
    content: '自定义时间',
    value: 'withTime',
    format: 'YYYY-M-D HH:mm:ss',
    capitalize: false,
    divider: true,
  },
  {
    content: formDate('YYYY年M月D日'),
    format: 'YYYY年M月D日',
    capitalize: false,
  },
  { content: formDate('YYYY-M-D'), format: 'YYYY-M-D', capitalize: false },
  { content: formDate('YYYY/M/D'), format: 'YYYY/M/D', capitalize: false },
  { content: formDate('YYYY.M.D'), format: 'YYYY.M.D', capitalize: false },
  { content: formDate('YYYY年M月'), format: 'YYYY年M月', capitalize: false },
  {
    content: formDate('YYYY年M月D日 HH:mm:ss'),
    value: 'withTime',
    format: 'YYYY年M月D日 HH:mm:ss',
    capitalize: false,
    divider: true,
  },
  {
    content: formatDateToChinese(formDate('YYYY年M月D日')),
    format: 'YYYY年M月D日',
    capitalize: true,
  },
  {
    content: formatDateToChinese(formDate('YYYY年M月')),
    format: 'YYYY年M月',
    capitalize: true,
  },
]

const editor = inject('editor')

const insertDate = ({ content, format, capitalize, value }: any) => {
  if (!content) {
    return
  }
  editor.value
    ?.chain()
    .insertDatetime({
      text: content.includes('自定义') ? `[${content}]` : content,
      date: formDate(format), // formDate('YYYY-MM-DD HH:mm:ss'),
      withTime: value === 'withTime',
      format,
      capitalize,
    })
    .focus()
    .run()
}
</script>
