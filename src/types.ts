import type { Extension } from '@tiptap/core'

import type { NodesComputed } from '@/extensions/page/types'

export interface MarginOption {
  left: number
  right: number
  top: number
  bottom: number
}
export interface WatermarkOption {
  type: string
  alpha: number
  fontColor: string
  fontSize: number
  fontFamily: string
  fontWeight: string
  text: string
}
export interface NodesComputedOption {
  types: string[]
  nodesComputed: NodesComputed
}

export interface PageOption {
  defaultMargin?: MarginOption
  defaultOrientation?: string
  defaultBackground?: string
  watermark?: WatermarkOption
  nodesComputedOption?: NodesComputedOption
  size?: any
  margin?: any
  orientation?: string
  background?: string
  header?: boolean
  footer?: boolean
  showLineNumber?: boolean
  showToc?: boolean
  pagination?: boolean
  zoomLevel?: number
  autoWidth?: boolean
  preview?: {
    enabled?: boolean
    laserPointer?: boolean
  }
}
export interface ToolbarOptions {
  defaultMode: string
  enableSourceEditor: boolean
  menus: string[]
  disableMenuItems: any[]
  importWord: {
    enabled: boolean
    options: any
    useCustomMethod: boolean
  }
}
export type Dictionary = Record<string, any>

export interface DocumentOptions {
  title: string
  content: string
  placeholder: Dictionary
  enableSpellcheck: boolean
  enableMarkdown: boolean
  enableBubbleMenu: boolean
  enableBlockMenu: boolean
  enableComment: boolean
  readOnly: boolean
  autofocus: boolean
  characterLimit: number
  typographyRules: Dictionary
  editorProps: Dictionary
  parseOptions: Dictionary
  autoSave: Dictionary
}

//定义一个 异步方法
export type AsyncMethod = (...args: any[]) => Promise<void>
export type Method = (...args: any[]) => void
export interface UmoEditorOptions {
  editorKey: string
  locale: 'en-US' | 'zh-CN'
  theme: 'light' | 'dark'
  height: string
  dicts?: any
  toolbar?: ToolbarOptions
  page: PageOption
  document?: DocumentOptions
  assistant?: Dictionary
  templates?: any[]
  cdnUrl?: string
  shareUrl?: string
  diagrams?: Dictionary
  file?: Dictionary
  user?: Dictionary
  extensions?: Extension[]
  translations?: Dictionary
  onSave?: AsyncMethod
  onFileUpload?: AsyncMethod
  onFileDelete?: Method
  onAssistant?: AsyncMethod
  onCustomImportWordMethod?: AsyncMethod
}
