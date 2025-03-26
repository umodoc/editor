<template>
  <menus-button
    :ico="content ? 'edit' : 'diagrams'"
    :text="content ? t('tools.diagrams.edit') : t('tools.diagrams.text')"
    huge
    @menu-click="dialogVisible = true"
  >
    <modal
      :visible="dialogVisible"
      icon="diagrams"
      :header="content ? t('tools.diagrams.edit') : t('tools.diagrams.text')"
      :footer="false"
      class="umo-diagrams-dialog"
      mode="full-screen"
      @close="dialogVisible = false"
    >
      <div v-if="loading" class="umo-diagrams-loading">
        <t-loading :text="t('tools.diagrams.loading')" size="small" />
      </div>
      <div class="umo-diagrams-container"></div>
    </modal>
  </menus-button>
</template>

<script setup lang="ts">
import DiagramEditor from '@/utils/diagram-editor'
import { shortId } from '@/utils/short-id'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})

const container = inject('container')
const editor = inject('editor')
const options = inject('options')
const uploadFileMap = inject('uploadFileMap')

let dialogVisible = $ref(false)
let loading = $ref(false)
const diagramEditor = new DiagramEditor({
  domain: (options.value.diagrams?.domain ?? '') as string,
  params: (options.value.diagrams?.params ?? {}) as Record<string, any>,
  container: `${container} .umo-diagrams-container`,
})

let image = $ref<
  | {
      id: string
      type: string
      src: string
      name: string
      size: number
      width: number
      height: number
      content: string
    }
  | undefined
>()

const messageListener = async (evt: MessageEvent) => {
  if (evt?.type !== 'message' || typeof evt?.data !== 'string') {
    return
  }

  const { event, bounds, data } = JSON.parse(evt.data)
  if (event === 'load') {
    loading = false
  }
  if (event === 'export') {
    if (!props.content || (props.content && props.content !== data)) {
      const id = shortId(10)
      const { width, height } = bounds
      const name = `diagrams-${shortId()}.svg`
      // 将 data URL 转换为 Blob
      const file = await fetch(data)
        .then((res) => res.blob())
        .then((blob) => new File([blob], name, { type: blob.type }))
      uploadFileMap.value.set(id, file)
      image = {
        id,
        type: 'diagrams',
        name,
        size: file.size,
        src: data,
        width,
        height,
        content: data,
      }
    }
    dialogVisible = false
    return
  }
  if (event === 'exit') {
    dialogVisible = false
  }
}

watch(
  () => dialogVisible,
  async (val: boolean) => {
    if (!val) {
      window.removeEventListener('message', messageListener)
      diagramEditor.stopEditing()
      if (image?.type) {
        editor.value?.chain().focus().setImage(image, !!props.content).run()
      }
      return
    }
    await nextTick()
    loading = true
    diagramEditor.edit(props.content ?? '')
    window.addEventListener('message', messageListener)
    image = undefined
  },
  { immediate: true },
)
</script>

<style lang="less">
.umo-diagrams-dialog {
  .umo-dialog {
    padding: 0 !important;
  }
  .umo-dialog__header {
    background: var(--umo-color-white);
    height: var(--td-comp-size-xxxl);
  }
  .umo-dialog__body {
    padding: 0;
  }
}
.umo-diagrams-loading {
  width: 100%;
  height: calc(100% - var(--td-comp-size-xxxl));
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: var(--umo-container-background);
}
.umo-diagrams-container {
  height: 100%;
  .umo-diagrams-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }
}
</style>
