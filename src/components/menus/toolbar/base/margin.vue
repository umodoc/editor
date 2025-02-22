<template>
  <menus-button
    ico="margin"
    :text="t('base.margin.text')"
    menu-type="popup"
    popup-handle="arrow"
    hide-text
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
    @menu-click="resetMargin()"
  >
    <template #content>
      <div class="umo-node-margin-input">
        <t-input-number
          v-model="marginTop"
          theme="column"
          align="left"
          size="small"
          :label="`↥${t('base.margin.top')}:`"
          :placeholder="t('base.margin.default')"
          :input-props="{ clearable: true }"
          :max="500"
          :min="0"
          @change="setMargin"
        />
        <t-input-number
          v-model="marginBottom"
          theme="column"
          align="left"
          size="small"
          :label="`↧${t('base.margin.bottom')}:`"
          :placeholder="t('base.margin.default')"
          :input-props="{ clearable: true }"
          :max="500"
          :min="0"
          @change="setMargin"
        />
        <t-button variant="outline" size="small" @click="resetMargin">
          {{ t('base.margin.reset') }}
        </t-button>
      </div>
    </template>
  </menus-button>
</template>

<script setup lang="ts">
import { getSelectionNode } from '@/extensions/selection'

const { popupVisible, togglePopup } = usePopup()
const editor = inject('editor')

let marginTop = $ref('')
let marginBottom = $ref('')

const setMarginValue = () => {
  if (popupVisible.value) {
    const node = editor.value ? getSelectionNode(editor.value) : null
    if (!node?.attrs?.margin) {
      return
    }
    const { margin } = node.attrs
    if (margin?.top) {
      marginTop = margin.top.replace(/px/g, '')
    }
    if (margin?.bottom) {
      marginBottom = margin.bottom.replace(/px/g, '')
    }
  } else {
    marginTop = ''
    marginBottom = ''
  }
}

const setMargin = () => {
  editor.value?.commands.setMargin({
    top: marginTop && marginTop !== '' ? marginTop?.toString() : undefined,
    bottom:
      marginBottom && marginBottom !== ''
        ? marginBottom?.toString()
        : undefined,
  })
}

watch(
  () => popupVisible.value,
  (visible: boolean) => {
    setMarginValue()
    if (!visible && editor.value) {
      editor.value.commands.focus()
    }
  },
  { immediate: true },
)
const resetMargin = () => {
  editor.value?.commands.unsetMargin()
  popupVisible.value = false
}
</script>

<style lang="less" scoped>
.umo-node-margin-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
  --td-comp-size-xs: 26px;
  width: 150px;
  :deep(.umo-input-number) {
    width: 100%;
  }
}
</style>
