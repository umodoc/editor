<template>
  <menus-button
    ico="date"
    :text="t('insert.date')"
    menu-type="dropdown"
    huge
    :select-options="options"
    @click="setDate"
  />
</template>

<script setup lang="ts">
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
  { content: formDate('YYYY年M月D日') },
  { content: formDate('YYYY-M-D') },
  { content: formDate('YYYY/M/D') },
  { content: formDate('YYYY.M.D') },
  { content: formDate('YYYY年M月') },
  { content: formDate('YYYY年M月D日 dddd'), divider: true },
  { content: formatDateToChinese(formDate('YYYY年M月D日')) },
  { content: formatDateToChinese(formDate('YYYY年M月')) },
  { content: formatDateToChinese(formDate('YYYY年M月D日 dddd')) },
]

const { editor } = useStore()

const setDate = ({ content }: { content: string }) => {
  if (!content) {
    return
  }
  editor.value?.chain().focus().insertContent(content).run()
}
</script>
