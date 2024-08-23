export default (timestamp: string) => {
  const messages = {
    justNow: t('time.justNow'),
    past: (n: any) => (n.match(/\d/) ? t('time.past', { n }) : n),
    day: (n: any) => (n === 1 ? t('time.yesterday') : t('time.day', { n })),
    hour: (n: any) => t('time.hour', { n }),
    minute: (n: any) => t('time.minute', { n }),
    second: (n: any) => t('time.second', { n }),
  }
  //@ts-ignore
  const time = useTimeAgo(new Date(timestamp), { messages })
  return time.value.replace(/"/gi, '')
}
