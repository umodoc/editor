import type { AssistantOptions } from '@/types'

export const defaultAiOptions: {
  assistant: AssistantOptions
} = {
  assistant: {
    enabled: false,
    maxlength: 100,
    commands: [
      {
        label: { en_US: 'Continuation', zh_CN: '续写' },
        value: { en_US: 'Continuation', zh_CN: '续写' },
      },
      {
        label: { en_US: 'Rewrite', zh_CN: '重写' },
        value: { en_US: 'Rewrite', zh_CN: '重写' },
      },
      {
        label: { en_US: 'Abbreviation', zh_CN: '缩写' },
        value: { en_US: 'Abbreviation', zh_CN: '缩写' },
      },
      {
        label: { en_US: 'Expansion', zh_CN: '扩写' },
        value: { en_US: 'Expansion', zh_CN: '扩写' },
      },
      {
        label: { en_US: 'Polish', zh_CN: '润色' },
        value: { en_US: 'Polish', zh_CN: '润色' },
      },
      {
        label: { en_US: 'Proofread', zh_CN: '校阅' },
        value: { en_US: 'Proofread', zh_CN: '校阅' },
      },
      {
        label: { en_US: 'Translate', zh_CN: '翻译' },
        value: {
          en_US: 'Translate to chinese',
          zh_CN: '翻译成英文',
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
