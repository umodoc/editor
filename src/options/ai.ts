import type { AssistantOptions } from '@/types'

export const defaultAiOptions: {
  assistant: AssistantOptions
} = {
  assistant: {
    enabled: false,
    maxlength: 100,
    commands: [
      {
        label: { en_US: 'Continuation', zh_CN: '续写', ru_RU: 'Продолжение' },
        value: { en_US: 'Continuation', zh_CN: '续写', ru_RU: 'Продолжение' },
      },
      {
        label: { en_US: 'Rewrite', zh_CN: '重写', ru_RU: 'Переписать' },
        value: { en_US: 'Rewrite', zh_CN: '重写', ru_RU: 'Переписать' },
      },
      {
        label: { en_US: 'Abbreviation', zh_CN: '缩写', ru_RU: 'Аббревиатура' },
        value: { en_US: 'Abbreviation', zh_CN: '缩写', ru_RU: 'Аббревиатура' },
      },
      {
        label: { en_US: 'Expansion', zh_CN: '扩写', ru_RU: 'Расширение' },
        value: { en_US: 'Expansion', zh_CN: '扩写', ru_RU: 'Расширение' },
      },
      {
        label: { en_US: 'Polish', zh_CN: '润色', ru_RU: 'Полировать' },
        value: { en_US: 'Polish', zh_CN: '润色', ru_RU: 'Полировать' },
      },
      {
        label: { en_US: 'Proofread', zh_CN: '校阅', ru_RU: 'Корректура' },
        value: { en_US: 'Proofread', zh_CN: '校阅', ru_RU: 'Корректура' },
      },
      {
        label: { en_US: 'Translate', zh_CN: '翻译', ru_RU: 'Перевести' },
        value: {
          en_US: 'Translate to chinese',
          zh_CN: '翻译成英文',
          ru_RU: 'Перевести на китайский',
        },
        autoSend: false,
      },
    ],
    async onMessage() {
      return await new Promise((_, reject) => {
        reject(
          new Error(
            'Key "ai": Key "assistant": Key "onMessage": Please set the onMessage method',
          ),
        )
      })
    },
  },
}
