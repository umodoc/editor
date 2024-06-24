export default (timestamp) => {
  const messages = {
    justNow: t('time.justNow'),
    past: (n) => (n.match(/\d/) ? t('time.past', { n }) : n),
    day: (n) => (n === 1 ? t('time.yesterday') : t('time.day', { n })),
    hour: (n) => t('time.hour', { n }),
    minute: (n) => t('time.minute', { n }),
    second: (n) => t('time.second', { n }),
  }
  const time = useTimeAgo(new Date(timestamp), { messages })
  return time.value.replace(/"/gi, '')
}
