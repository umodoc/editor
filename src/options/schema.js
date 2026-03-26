import { ObjectSchema } from '@eslint/object-schema'
import {
  isAsyncFunction,
  isFunction,
  isNumber,
  isRecord,
  isString,
} from '@tool-belt/type-predicates'

import defaultOptions from './config'

const isLocale = (value) => {
  if (isString(value) && value.length > 0) {
    return true
  }
  if (isRecord(value)) {
    for (const key of Object.keys(value)) {
      if (!['en_US', 'zh_CN'].includes(key)) {
        return false
      }
    }
    return true
  }
  return false
}

export default new ObjectSchema({
  editorKey: {
    merge: 'replace',
    validate: 'string!',
    required: false,
  },
  locale: {
    merge: 'replace',
    validate(value) {
      if (value && !['en-US', 'zh-CN'].includes(value)) {
        throw new Error('Key "locale": must be one of "zh-CN" or "en-US".')
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
  skin: {
    merge: 'replace',
    validate(value) {
      if (value && !['default', 'modern'].includes(value)) {
        throw new Error('Key "skin": must be one of "default" or "modern".')
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
        validate(value) {
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
        validate(value) {
          if (value && !Array.isArray(value)) {
            throw new Error('Key "dicts": Key "symbols" must be a array.')
          }
          value.forEach((item, index) => {
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
        validate(value) {
          if (value && !Array.isArray(value)) {
            throw new Error('Key "dicts": Key "emojis" must be a array.')
          }
          value.forEach((item, index) => {
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
        validate(value) {
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
      showSaveLabel: {
        merge: 'replace',
        validate: 'boolean',
        required: false,
      },
      defaultMode: {
        merge: 'replace',
        validate(value) {
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
        validate(value) {
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
    },
  },
  page: {
    merge: 'replace',
    validate: 'object',
    required: false,
    schema: {
      layouts: {
        merge: 'replace',
        validate(value) {
          const defaultLayouts = defaultOptions?.page?.layouts
          if (value && !Array.isArray(value)) {
            throw new Error('Key "page": Key "layouts" must be a array.')
          }
          if (!value.every((item) => defaultLayouts?.includes(item))) {
            throw new Error(
              `Key "page": Key "layouts" the array items of page.layouts must contain only one or multiple of ${JSON.stringify(defaultLayouts)}.`,
            )
          }
        },
        required: false,
      },
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
        validate(value) {
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
      showLineNumber: {
        merge: 'replace',
        validate: 'boolean',
        required: false,
      },
      showToc: {
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
            validate(value) {
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
            validate(value) {
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
        validate(value) {
          if (!isLocale(value)) {
            throw new Error(
              `Key "document": Key "title": Key "label" must be string, or a object with "en_US" and "zh_CN" properties.`,
            )
          }
        },
        required: false,
      },
      structure: {
        merge: 'replace',
        validate: 'string',
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
      enableNodeId: {
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
        validate(value) {
          if (
            !['start', 'end', 'all', true, false, null].includes(value) &&
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
      onCustomSettings: {
        merge: 'replace',
        validate(value) {
          if (!isFunction(value)) {
            throw new Error('Key "onCustomSettings" must be a function.')
          }
        },
        required: false,
      },
    },
  },
  webPages: {
    merge: 'replace',
    validate(value) {
      if (value && !Array.isArray(value)) {
        throw new Error('Key "webPages": must be a array.')
      }
      value.forEach((item, index) => {
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
    validate(value) {
      if (value && !Array.isArray(value)) {
        throw new Error('Key "templates": must be a array.')
      }
      value.forEach((item, index) => {
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
          value.forEach((item) => {
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
      value.forEach((item) => {
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
  disableExtensions: {
    merge: 'replace',
    validate(value) {
      if (value && !Array.isArray(value)) {
        throw new Error('Key "disableExtensions" must be a array.')
      }
    },
    required: false,
  },
  translations: {
    merge: 'replace',
    validate: 'object',
    required: false,
  },
  onSave: {
    merge: 'replace',
    validate(value) {
      if (!isAsyncFunction(value)) {
        throw new Error('Key "onSave" must be a async function.')
      }
    },
    required: false,
  },
  onFileUpload: {
    merge: 'replace',
    validate(value) {
      if (!isAsyncFunction(value)) {
        throw new Error('Key "onFileUpload" must be a async function.')
      }
    },
    required: false,
  },
  onFileDelete: {
    merge: 'replace',
    validate(value) {
      if (!isFunction(value)) {
        throw new Error('Key "onFileDelete" must be a function.')
      }
    },
    required: false,
  },
})
