<template>
  <menus-button
    :ico="content ? 'edit' : 'diagrams'"
    :text="content ? '编辑' : '流程图'"
    huge
    @menu-click="dialogVisible = true"
  >
    <modal
      :visible="dialogVisible"
      icon="diagrams"
      :title="content ? '编辑流程图' : '新建流程图'"
      :footer="false"
      class="diagrams-dialog"
      mode="full-screen"
      @opened="openDiagramEditor"
      @close="dialogVisible = false"
    >
      <div v-if="loading" class="diagrams-loading">
        <t-loading text="加载中..." size="small" />
      </div>
      <div class="diagrams-container"></div>
    </modal>
  </menus-button>
</template>

<script setup>
import DiagramEditor from '@/utils/diagram-editor'

const props = defineProps({
  content: {
    type: String,
  },
})

const { container, options, editor } = useStore()

let dialogVisible = $ref(false)
let loading = $ref(false)
const diagramEditor = new DiagramEditor({
  domain: options.value.diagrams.domain,
  params: options.value.diagrams.params,
  container: `${container} .diagrams-container`,
})
const openDiagramEditor = () => {
  diagramEditor.edit(props.content || '')
}

let image = $ref({})

const messageListener = (evt) => {
  if (evt?.type !== 'message' && evt?.origin !== options.value.diagrams.domain)
    return

  const { event, bounds, data } = JSON.parse(evt.data)
  if (event === 'load') loading = false
  if (event === 'export') {
    const { width, height } = bounds
    if (!props.content || (props.content && props.content !== data)) {
      image = {
        type: 'diagrams',
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
  (val) => {
    if (!val) {
      window.removeEventListener('message', messageListener)
      diagramEditor.stopEditing()
      if (image.type) {
        editor.value
          ?.chain()
          .focus()
          .setImage(image, props.content ? true : false)
          .run()
      }
      return
    }
    loading = true
    window.addEventListener('message', messageListener)
    image = {}
  },
)

onBeforeMount(() => {
  window.addEventListener('message', messageListener)
})
</script>

<style lang="less">
.diagrams-dialog {
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
.diagrams-loading {
  width: 100%;
  height: calc(100% - var(--td-comp-size-xxxl));
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: var(--umo-container-background);
}
.diagrams-container {
  height: 100%;
  .diagrams-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }
}
</style>
