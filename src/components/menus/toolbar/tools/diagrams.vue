<template>
  <menus-button
    :ico="content ? 'edit' : 'diagrams'"
    :text="content ? t('tools.diagrams.edit') : t('tools.diagrams.text')"
    huge
    @menu-click="dialogVisible = true"
  >
    <modal
      :visible="dialogVisible"
      :footer="false"
      destroy-on-close
      class="umo-diagrams-dialog"
      mode="full-screen"
      @close="dialogVisible = false"
    >
      <template #header>
        <icon name="diagrams" />
        {{ content ? t('tools.diagrams.edit') : t('tools.diagrams.text') }}
      </template>
      <div v-if="loading" class="umo-diagrams-loading">
        <t-loading :text="t('tools.diagrams.loading')" size="small" />
      </div>
      <div class="umo-diagrams-container"></div>
    </modal>
  </menus-button>
</template>

<script setup>
import DiagramEditor from '@/utils/diagram-editor'
import { getSelectionNode } from '@/utils/selection'
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

let dialogVisible = $ref(false)
let loading = $ref(false)
let image = $ref(undefined)

const onDiagramMessage = ({ event, bounds, data }) => {
  if (event === 'load') {
    loading = false
  }
  if (event === 'export') {
    if (!props.content || (props.content && props.content !== data)) {
      const { width, height } = bounds || {}
      image = {
        id: shortId(10),
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

const diagramEditor = new DiagramEditor({
  domain: options.value.diagrams?.domain,
  params: options.value.diagrams?.params,
  container: `${container} .umo-diagrams-container`,
  onMessage: onDiagramMessage,
})
onBeforeUnmount(() => diagramEditor.stopEditing())

watch(
  () => dialogVisible,
  async (val) => {
    if (!val) {
      diagramEditor.stopEditing()
      if (image?.type) {
        image.alt = t('tools.diagrams.text')
        editor.value?.chain().focus().setImage(image, !!props.content).run()
      }
      image = undefined
      return
    }
    loading = true
    await nextTick()
    if (dialogVisible) {
      diagramEditor.edit(props.content || '')
    }
  },
  { immediate: true },
)
</script>

<style lang="less">
.umo-diagrams-dialog {
  .t-dialog {
    padding: 0 !important;
    &__header {
      background: var(--umo-color-white);
      height: var(--td-comp-size-xxxl);
    }
    &__body {
      padding: 0;
    }
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
