export default (timestamp) => {
  const messages = {
    justNow: '刚刚',
    past: (n) => (n.match(/\d/) ? `${n}前` : n),
    future: (n) => (n.match(/\d/) ? `未来 ${n}` : n),
    month: (n, past) =>
      n === 1 ? (past ? '上个月' : '下个月') : `${n}个月${n > 1 ? '' : ''}`,
    year: (n, past) =>
      n === 1 ? (past ? '去年' : '明年') : `${n}年${n > 1 ? '' : ''}`,
    day: (n, past) =>
      n === 1 ? (past ? '昨天' : '明天') : `${n}天${n > 1 ? '' : ''}`,
    week: (n, past) =>
      n === 1 ? (past ? '上一周' : '下一周') : `${n}周${n > 1 ? '' : ''}`,
    hour: (n) => `${n}小时${n > 1 ? '' : ''}`,
    minute: (n) => `${n}分钟${n > 1 ? '' : ''}`,
    second: (n) => `${n}秒${n > 1 ? '' : ''}`,
  }
  const time = useTimeAgo(new Date(timestamp), { messages })
  return time.value.replace(/"/gi, '')
}
