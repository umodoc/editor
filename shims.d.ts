declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<
    Record<string, any>,
    Record<string, any>,
    any
  >
  export default component
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    t: (key: string, ...params: unknown[]) => string
    l: (key: string, ...params: unknown[]) => string
  }
}

declare module 'vue-esign' {
  const signature: any
  export default signature
}

declare module 'dom-to-image-more' {
  export function toBlob(node: HTMLElement, options?: any): Promise<Blob>
  export function toJpeg(node: HTMLElement, options?: any): Promise<Blob>
  export function toPng(node: HTMLElement, options?: any): Promise<Blob>
}
