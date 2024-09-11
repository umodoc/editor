export function timeAgo(timestamp: string | number | Date) {
  const messages = {
    justNow: t('time.justNow'),
    past: (n: string | number | Date) =>
      n.toString().match(/\d/) ? t('time.past', { n }) : n,
    day: (n: Date | number | string) =>
      n === 1 ? t('time.yesterday') : t('time.day', { n }),
    hour: (n: string | number | Date) => t('time.hour', { n }),
    minute: (n: string | number | Date) => t('time.minute', { n }),
    second: (n: string | number | Date) => t('time.second', { n }),
    future: (n: string | number | Date) => t('time.future', { n }),
    invalid: t('time.invalid'),
  }
  const time = useTimeAgo(new Date(timestamp), { messages })
  return time.value.replace(/"/gi, '')
}
