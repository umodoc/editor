import { ObjectSchema } from '@eslint/object-schema'
import {
  type AsyncFunction,
  isAsyncFunction,
  isFunction,
  isNumber,
  isRecord,
  isString,
} from '@tool-belt/type-predicates'

import type {
  Emoji,
  GraphicSymbol,
  LineHeight,
  LocaleLabel,
  PageSize,
  Template,
  UmoEditorOptions,
  WebPageItem,
} from '@/types'

import { defaultDicts } from './dicts'
import { defaultWebPages } from './web-pages'

// 默认配置
const defaultOptions: UmoEditorOptions = {
  editorKey: 'default',
  locale: 'zh-CN',
  theme: 'light',
  height: '100%',
  fullscreenZIndex: 10,
  dicts: defaultDicts,
  toolbar: {
    defaultMode: 'ribbon',
    menus: ['base', 'insert', 'table', 'tools', 'page', 'export'],
    disableMenuItems: [],
    importWord: {
      enabled: true,
      options: {},
      useCustomMethod: false,
    },
  },
  page: {
    defaultMargin: {
      left: 3.18,
      right: 3.18,
      top: 2.54,
      bottom: 2.54,
    },
    defaultOrientation: 'portrait',
    defaultBackground: '#fff',
    showBreakMarks: true,
    showBookmark: false,
    watermark: {
      type: 'compact',
      alpha: 0.2,
      fontColor: '#000',
      fontSize: 16,
      fontFamily: 'SimSun',
      fontWeight: 'normal',
      text: '',
    },
  },
  document: {
    title: '',
    content: '',
    placeholder: {
      en_US: 'Please enter the document content...',
      zh_CN: '请输入文档内容...',
      ru_RU: 'Пожалуйста, введите содержимое документа...',
    },
    enableSpellcheck: true,
    enableMarkdown: true,
    enableBubbleMenu: true,
    enableBlockMenu: true,
    readOnly: false,
    autofocus: true,
    characterLimit: 0,
    typographyRules: {},
    // https://prosemirror.net/docs/ref/#view.EditorProps
    editorProps: {},
    // https://prosemirror.net/docs/ref/#model.ParseOptions
    parseOptions: {
      preserveWhitespace: 'full',
    },
    autoSave: {
      enabled: true,
      interval: 300000,
    },
  },
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
  },
  echarts: {
    mode: 1,
    renderImage: false,
  },
  webPages: defaultWebPages,
  templates: [],
  cdnUrl: 'https://unpkg.com/@umoteam/editor-external@latest',
  shareUrl: location.href || '',
  diagrams: {
    domain: 'https://embed.diagrams.net',
    // https://www.drawio.com/doc/faq/supported-url-parameters
    params: {},
  },
  file: {
    allowedMimeTypes: [],
    maxSize: 1024 * 1024 * 100, // 100M
    preview: [
      { extensions: ['pdf'], url: '{url}' },
      {
        extensions: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
        url: 'https://view.officeapps.live.com/op/embed.aspx?src={{url}}&amp;wdStartOn=1&amp;wdPrint=0&amp;wdEmbedCode=0',
      },
    ],
  },
  user: {},
  users: [],
  extensions: [],
  translations: {
    en_US: {},
    zh_CN: {},
    ru_RU: {},
  },
  async onSave() {
    return await new Promise((_, reject) => {
      reject(new Error('Key "onSave": Please set the save method'))
    })
  },
  async onFileUpload(file: File) {
    return await new Promise((_, reject) => {
      if (!file) {
        reject(new Error('File not found'))
        return
      }
      reject(new Error('Key "onFileUpload": Please set the upload method'))
    })
  },
  onFileDelete() {
    console.error(
      'The file has been deleted. Please configure the onFileDelete to completely delete the file from the server.',
    )
  },
  async onAssistant() {
    return await new Promise((_, reject) => {
      reject(new Error('Key "onAssistant": Please set the onAssistant method'))
    })
  },
  onCustomEChartSettings() {
    console.error(
      'Custom chart settings are required, please configure onCustomEChartSettings.',
    )
  },
  async onCustomImportWordMethod() {
    return await new Promise((_, reject) => {
      reject(
        new Error(
          'Key "onCustomImportWordMethod": Please set the onAssistant method',
        ),
      )
    })
  },
}

// 组件 props 所需格式
const propsOptions = Object.keys(defaultOptions)

const isLocale = (value: unknown) => {
  if (isString(value) && value.length > 0) {
    return true
  }
  if (isRecord(value)) {
    for (const key of Object.keys(value)) {
      if (!['en_US', 'zh_CN', 'ru_RU'].includes(key)) {
        return false
      }
    }
    return true
  }
  return false
}

const ojbectSchema = new ObjectSchema({
  editorKey: {
    merge: 'replace',
    validate: 'string!',
    required: false,
  },
  locale: {
    merge: 'replace',
    validate(value) {
      if (value && !['en-US', 'zh-CN', 'ru-RU'].includes(value)) {
        throw new Error(
          'Key "locale": must be one of "en-US", "zh-CN" or "ru-RU".',
        )
      }
    },
    required: false,
  },
  theme: {
    merge: 'replace',
    validate(value) {
      if (value && !['dark', 'light', 'auto'].includes(value)) {
        throw new Error(
          'Key "theme": must be one of "dark", "light" or "auto".',
        )
      }
    },
    required: false,
  },
  height: {
    merge: 'replace',
    validate: 'string!',
    required: false,
  },
  fullscreenZIndex: {
    merge: 'replace',
    validate: 'number',
    required: false,
  },
  dicts: {
    required: false,
    merge: 'replace',
    validate: 'object',
    schema: {
      fonts: {
        merge: 'replace',
        validate(value) {
          if (value && !Array.isArray(value)) {
            throw new Error('Key "dicts": Key "fonts" must be a array.')
          }
          for (const item of value) {
            if (!item.label || (!item.value && item.value !== null)) {
              throw new Error(
                'Key "dicts": Key "fonts" must be a array of objects with "label" and "value" properties.',
              )
            }
          }
        },
        required: false,
      },
      colors: {
        merge: 'replace',
        validate: 'array',
        required: false,
      },
      lineHeights: {
        merge: 'replace',
        validate(value: LineHeight[]) {
          if (!Array.isArray(value)) {
            throw new Error('Key "dicts": Key "lineHeights": must be a array.')
          }
          if (!value.find((item) => item.default)) {
            throw new Error(
              'Key "dicts": Key "lineHeights": please set a default value.',
            )
          }
          value.forEach((item, index) => {
            if (!item.label || (!item.value && item.value !== null)) {
              throw new Error(
                `Key "dicts": Key "lineHeights[${index}]": must be a array of objects with "label" and "value" properties.`,
              )
            }
            if (!isLocale(item.label)) {
              throw new Error(
                `Key "dicts": Key "lineHeights[${index}]": Key "label" must be string, or a object with "en_US" and "zh_CN" properties.`,
              )
            }
          })
        },
        required: false,
      },
      symbols: {
        merge: 'replace',
        validate(value: GraphicSymbol[]) {
          if (value && !Array.isArray(value)) {
            throw new Error('Key "dicts": Key "symbols" must be a array.')
          }
          value.forEach((item, index: number) => {
            if (!item.label || typeof item.items !== 'string') {
              throw new Error(
                `Key "dicts": Key "symbols[${index}]": must be a array of objects with "label" and "items" properties.`,
              )
            }
            if (!isLocale(item.label)) {
              throw new Error(
                `Key "dicts": Key "symbols[${index}]": Key "label" must be string, or a object with "en_US" and "zh_CN" properties.`,
              )
            }
          })
        },
        required: false,
      },
      emojis: {
        merge: 'replace',
        validate(value: Emoji[]) {
          if (value && !Array.isArray(value)) {
            throw new Error('Key "dicts": Key "emojis" must be a array.')
          }
          value.forEach((item, index: number) => {
            if (!item.label || typeof item.items !== 'string') {
              throw new Error(
                `Key "dicts": Key "emojis[${index}]": must be a array of objects with "label" and "value" properties.`,
              )
            }
            if (!isLocale(item.label)) {
              throw new Error(
                `Key "dicts": Key "emojis[${index}]": Key "label" must be string, or a object with "en_US" and "zh_CN" properties.`,
              )
            }
          })
        },
        required: false,
      },
      pageSizes: {
        merge: 'replace',
        validate(value: PageSize[]) {
          if (value && !Array.isArray(value)) {
            throw new Error('Key "dicts": Key "pageSizes": must be a array.')
          }
          if (!value.find((item) => item.default)) {
            throw new Error(
              'Key "dicts": Key "pageSizes": please set a default value.',
            )
          }
          value.forEach((item, index) => {
            if (!item.label || item.label === '') {
              throw new Error(
                `Key "dicts": Key "pageSizes[${index}]" Key: "label" cannot be empty.`,
              )
            }
            if (!isLocale(item.label)) {
              throw new Error(
                `Key "dicts": Key "pageSizes[${index}]": Key "label" must be string, or a object with "en_US" and "zh_CN" properties.`,
              )
            }
            if (!isNumber(item.width)) {
              throw new Error(
                `Key "dicts": Key "pageSizes[${index}]" Key: "width" must be a number.`,
              )
            }
            if (!isNumber(item.height)) {
              throw new Error(
                `Key "dicts": Key "pageSizes[${index}]" Key: "height" must be a number.`,
              )
            }
          })
        },
        required: false,
      },
    },
  },
  toolbar: {
    required: false,
    merge: 'replace',
    validate: 'object',
    schema: {
      defaultMode: {
        merge: 'replace',
        validate(value: 'classic' | 'ribbon') {
          if (value && !['classic', 'ribbon'].includes(value)) {
            throw new Error(
              'Key "toolbar": Key "defaultMode" must be one of "classic" or "ribbon".',
            )
          }
        },
        required: false,
      },
      menus: {
        merge: 'replace',
        validate(value: 'base' | 'advanced' | 'custom') {
          const defaultMenus = defaultOptions?.toolbar?.menus
          if (value && !Array.isArray(value)) {
            throw new Error('Key "toolbar": Key "menus" must be a array.')
          }
          if (!value.includes('base')) {
            throw new Error(
              'Key "toolbar": Key "menus" should at least contain "base".',
            )
          }
          if (!value.every((item) => defaultMenus?.includes(item))) {
            throw new Error(
              `Key "toolbar": Key "menus" the array items of toolbar.menus must contain only one or multiple of ${JSON.stringify(defaultMenus)}.`,
            )
          }
        },
        required: false,
      },
      disableMenuItems: {
        merge: 'replace',
        validate(value: string[]) {
          if (value && !Array.isArray(value)) {
            throw new Error(
              'Key "toolbar": Key "disableMenuItems" must be a array.',
            )
          }
        },
        required: false,
      },
      importWord: {
        merge: 'replace',
        validate: 'object',
        required: false,
      },
    },
  },
  page: {
    merge: 'replace',
    validate: 'object',
    required: false,
    schema: {
      defaultMargin: {
        required: false,
        merge: 'replace',
        validate: 'object',
        schema: {
          left: {
            merge: 'replace',
            validate: 'number',
            required: false,
          },
          right: {
            merge: 'replace',
            validate: 'number',
            required: false,
          },
          top: {
            merge: 'replace',
            validate: 'number',
            required: false,
          },
          bottom: {
            merge: 'replace',
            validate: 'number',
            required: false,
          },
        },
      },
      defaultOrientation: {
        merge: 'replace',
        validate(value: 'portrait' | 'landscape') {
          if (value && !['portrait', 'landscape'].includes(value)) {
            throw new Error(
              'Key "page": Key "defaultOrientation" must be one of "portrait" or "landscape".',
            )
          }
        },
        required: false,
      },
      defaultBackground: {
        merge: 'replace',
        validate: 'string',
        required: false,
      },
      showBreakMarks: {
        merge: 'replace',
        validate: 'boolean',
        required: false,
      },
      showBookmark: {
        merge: 'replace',
        validate: 'boolean',
        required: false,
      },
      watermark: {
        required: false,
        merge: 'replace',
        validate: 'object',
        schema: {
          type: {
            merge: 'replace',
            validate(value: 'compact' | 'spacious') {
              if (value && !['compact', 'spacious'].includes(value)) {
                throw new Error(
                  'Key "watermark": Key "type" must be one of "compact" or "spacious".',
                )
              }
            },
            required: false,
          },
          alpha: {
            merge: 'replace',
            validate: 'number',
            required: false,
          },
          fontColor: {
            merge: 'replace',
            validate: 'string',
            required: false,
          },
          fontFamily: {
            merge: 'replace',
            validate(value: string | null) {
              if (value !== null && typeof value !== 'string') {
                throw new Error(
                  'Key "watermark": Key "fontFamily" must be a string.',
                )
              }
            },
            required: false,
          },
          fontSize: {
            merge: 'replace',
            validate: 'number',
            required: false,
          },
          fontWeight: {
            merge: 'replace',
            validate: 'string',
            required: false,
          },
          text: {
            merge: 'replace',
            validate: 'string',
            required: false,
          },
        },
      },
      size: {
        required: false,
        merge: 'replace',
        validate: 'object',
        schema: {
          width: {
            merge: 'replace',
            validate: 'number',
            required: false,
          },
          height: {
            merge: 'replace',
            validate: 'number',
            required: false,
          },
          label: {
            merge: 'replace',
            validate: 'string',
            required: false,
          },
        },
      },
    },
  },
  document: {
    merge: 'replace',
    validate: 'object',
    required: false,
    schema: {
      title: {
        merge: 'replace',
        validate: 'string',
        required: false,
      },
      content: {
        merge: 'replace',
        validate() {},
        required: false,
      },
      placeholder: {
        merge: 'replace',
        validate(value: LocaleLabel) {
          if (!isLocale(value)) {
            throw new Error(
              `Key "document": Key "title": Key "label" must be string, or a object with "en_US" and "zh_CN" properties.`,
            )
          }
        },
        required: false,
      },
      enableSpellcheck: {
        merge: 'replace',
        validate: 'boolean',
        required: false,
      },
      enableMarkdown: {
        merge: 'replace',
        validate: 'boolean',
        required: false,
      },
      enableBubbleMenu: {
        merge: 'replace',
        validate: 'boolean',
        required: false,
      },
      enableBlockMenu: {
        merge: 'replace',
        validate: 'boolean',
        required: false,
      },
      readOnly: {
        merge: 'replace',
        validate: 'boolean',
        required: false,
      },
      autofocus: {
        merge: 'replace',
        validate(value: 'start' | 'end' | 'all' | number | boolean | null) {
          if (
            !['start', 'end', 'all', true, false, null].includes(
              value as unknown as string,
            ) &&
            !isNumber(value)
          ) {
            throw new Error(
              'Key "document": Key "autofocus" must be one of "start", "end", "all", Number, true, false, null.',
            )
          }
        },
        required: false,
      },
      characterLimit: {
        merge: 'replace',
        validate: 'number',
        required: false,
      },
      typographyRules: {
        merge: 'replace',
        validate: 'object',
        required: false,
      },
      editorProps: {
        merge: 'replace',
        validate: 'object',
        required: false,
      },
      parseOptions: {
        merge: 'replace',
        validate: 'object',
        required: false,
      },
      autoSave: {
        required: false,
        merge: 'replace',
        validate: 'object',
        schema: {
          enabled: {
            merge: 'replace',
            validate: 'boolean',
            required: false,
          },
          interval: {
            merge: 'replace',
            validate: 'number',
            required: false,
          },
        },
      },
    },
  },
  assistant: {
    merge: 'replace',
    validate: 'object',
    required: false,
    schema: {
      enabled: {
        merge: 'replace',
        validate: 'boolean',
        required: false,
      },
      maxlength: {
        merge: 'replace',
        validate(value: number) {
          if (!isNumber(value) || !Number.isInteger(value) || value <= 0) {
            throw new Error(
              'Key "assistant": Key "maxlength" must be a number.',
            )
          }
        },
        required: false,
      },
      commands: {
        merge: 'replace',
        validate(value: { label: LocaleLabel; value: LocaleLabel }[]) {
          if (value && !Array.isArray(value)) {
            throw new Error('Key "assistant": Key "commands" must be a array.')
          }
          value.forEach((item, index: number) => {
            if (!item.label || !item.value) {
              throw new Error(
                'Key "assistant": Key "commands" must be a array of objects with "label" and "value" properties.',
              )
            }
            if (!isLocale(item.label)) {
              throw new Error(
                `Key "assistant": Key "commands[${index}]": Key "label" must be string, or a object with "en_US" and "zh_CN" properties.`,
              )
            }
            if (!isLocale(item.value)) {
              throw new Error(
                `Key "assistant": Key "commands[${index}]": Key "value" must be string, or a object with "en_US" and "zh_CN" properties.`,
              )
            }
          })
        },
        required: false,
      },
    },
  },
  echarts: {
    merge: 'replace',
    validate: 'object',
    required: false,
    schema: {
      mode: {
        merge: 'replace',
        validate: 'number',
        required: false,
      },
      renderImage: {
        merge: 'replace',
        validate: 'boolean',
        required: false,
      },
    },
  },
  webPages: {
    merge: 'replace',
    validate(value: WebPageItem[]) {
      if (value && !Array.isArray(value)) {
        throw new Error('Key "webPages": must be a array.')
      }
      value.forEach((item, index: number) => {
        if (!item.label || item.label === '') {
          throw new Error(
            `Key "webPages[${index}]": Key "label" cannot be empty.`,
          )
        }
        if (!item.icon || item.icon === '') {
          throw new Error(
            `Key "webPages[${index}]": Key "icon" cannot be empty.`,
          )
        }
        if (!item.validate || !isFunction(item.validate)) {
          throw new Error(
            `Key "webPages[${index}]": Key "validate" must be a function.`,
          )
        }
        if (!item.transformURL || !isFunction(item.transformURL)) {
          throw new Error(
            `Key "webPages[${index}]": Key "transformURL" must be a function.`,
          )
        }
      })
    },
    required: false,
  },
  shareUrl: {
    merge: 'replace',
    validate: 'string',
    required: false,
  },
  templates: {
    merge: 'replace',
    validate(value: Template[]) {
      if (value && !Array.isArray(value)) {
        throw new Error('Key "templates": must be a array.')
      }
      value.forEach((item, index: number) => {
        if (!item.title || item.title === '') {
          throw new Error(
            `Key "templates[${index}]": Key "title" cannot be empty.`,
          )
        }
        if (!item.content || item.content === '') {
          throw new Error(
            `Key "templates[${index}]": Key "content" cannot be empty.`,
          )
        }
      })
    },
    required: false,
  },
  cdnUrl: {
    merge: 'replace',
    validate: 'string',
    required: false,
  },
  diagrams: {
    merge: 'assign',
    validate: 'object',
    required: false,
  },
  file: {
    required: false,
    merge: 'replace',
    validate: 'object',
    schema: {
      allowedMimeTypes: {
        merge: 'replace',
        validate: 'array',
        required: false,
      },
      maxSize: {
        merge: 'replace',
        validate: 'number',
        required: false,
      },
      preview: {
        merge: 'replace',
        validate(value) {
          value.forEach((item: { extensions: [any]; url: string }) => {
            if (typeof item !== 'object') {
              throw new Error(
                'Key "file": Key "preview" must be an array of objects.',
              )
            }
            if (!Array.isArray(item.extensions)) {
              throw new Error(
                'Key "file": Key "preview": Key "extensions" must be an array of strings.',
              )
            }
            if (!item.url?.includes('{url}')) {
              throw new Error(
                'Key "file": Key "preview": Key "url" must include "{url}".',
              )
            }
          })
        },
        required: false,
      },
    },
  },
  user: {
    merge: 'assign',
    validate: 'object',
    required: false,
  },
  users: {
    merge: 'replace',
    validate(value) {
      value.forEach((item: { id: [any]; label: string }) => {
        if (typeof item !== 'object') {
          throw new Error(
            'Key "users": Key "item" must be an array of objects.',
          )
        }
        if (!item.id) {
          throw new Error('Key "users": Key "item": Key "id" cannot be empty.')
        }
        if (!item.label) {
          throw new Error(
            'Key "users": Key "item": Key "label" cannot be empty.',
          )
        }
      })
    },
    required: false,
  },
  extensions: {
    merge: 'replace',
    validate: 'array',
    required: false,
  },
  translations: {
    merge: 'replace',
    validate: 'object',
    required: false,
  },
  onSave: {
    merge: 'replace',
    validate(value: AsyncFunction) {
      if (!isAsyncFunction(value)) {
        throw new Error('Key "onSave" must be a async function.')
      }
    },
    required: false,
  },
  onFileUpload: {
    merge: 'replace',
    validate(value: AsyncFunction) {
      if (!isAsyncFunction(value)) {
        throw new Error('Key "onFileUpload" must be a async function.')
      }
    },
    required: false,
  },
  onFileDelete: {
    merge: 'replace',
    validate(value: any) {
      if (!isFunction(value)) {
        throw new Error('Key "onFileDelete" must be a function.')
      }
    },
    required: false,
  },
  onCustomEChartSettings: {
    merge: 'replace',
    validate(value: any) {
      if (!isFunction(value)) {
        throw new Error('Key "onCustomEChartSettings" must be a function.')
      }
    },
    required: false,
  },
  onAssistant: {
    merge: 'replace',
    validate(value: AsyncFunction) {
      if (!isAsyncFunction(value)) {
        throw new Error('Key "onAssistant" must be a async function.')
      }
    },
    required: false,
  },
  onCustomImportWordMethod: {
    merge: 'replace',
    validate(value: AsyncFunction) {
      if (!isAsyncFunction(value)) {
        throw new Error(
          'Key "onCustomImportWordMethod" must be a async function.',
        )
      }
    },
    required: false,
  },
})

export { defaultOptions, ojbectSchema, propsOptions }
