<template>
  <node-view-wrapper
    as="span"
    class="umo-node-option-box"
    @click.capture="editor?.commands.setNodeSelection(getPos())"
  >
    <span
      v-if="attrs.target === 'radio'"
      class="umo-option-box-radio-container"
    >
      <span
        v-for="(box, index) in attrs.items"
        :key="box.key"
        class="option-item"
      >
        <t-radio
          :key="index"
          :checked="box.checked"
          :disabled="isDisabled"
          @change="radioChange(index)"
        ></t-radio>
        <span>{{ box.label }}</span>
      </span>
    </span>

    <span v-else class="umo-option-box-checkbox-container">
      <span v-if="attrs.checkAll" class="option-item">
        <t-checkbox
          key="checkallInxex"
          :checked="attrs.checked"
          :disabled="isDisabled"
          @change="checkboxAll"
        ></t-checkbox>
        <span>{{ t('insert.option.check') }}</span>
      </span>

      <span
        v-for="(box, index) in attrs.items"
        :key="box.key"
        class="option-item"
      >
        <t-checkbox
          :key="index"
          :checked="box.checked"
          :disabled="isDisabled"
          @click="checkboxChange(index)"
        ></t-checkbox>
        <span>{{ box.label }}</span>
      </span>
    </span>
  </node-view-wrapper>
</template>

<script setup>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
const options = inject('options')
const page = inject('page')
const editor = inject('editor')
const props = defineProps(nodeViewProps)
const { updateAttributes, getPos } = props
const attrs = $computed(() => props.node.attrs)

// 统一的禁用状态计算
const isDisabled = $computed(() => {
  return (
    page.value?.preview?.enabled ||
    options.value?.document?.readOnly ||
    !editor.value?.isEditable
  )
})

// 处理复选框变化
const checkboxChange = (index) => {
  // 如果是禁用状态，则忽略此次调用
  if (isDisabled) return

  const newOptions = [...attrs.items]
  newOptions[index].checked = !newOptions[index].checked
  updateAttributes({ items: newOptions, updated: true })

  // 使用 setTimeout 重置标志位
  setTimeout(() => {
    updateAttributes({ updated: false })
  }, 0)
}

const checkboxAll = (check) => {
  // 如果是禁用状态，则忽略此次调用
  if (isDisabled) return

  // 更新所有选项的选中状态
  const checked = check
  const newOptions = attrs.items.map((option) => ({
    ...option,
    checked,
  }))

  // 更新属性
  updateAttributes({
    items: newOptions,
    checked,
    updated: true,
  })

  // 使用 setTimeout 重置标志位
  setTimeout(() => {
    updateAttributes({ updated: false })
  }, 0)
}

// 处理单选框变化
const radioChange = (index) => {
  // 如果是禁用状态，则忽略此次调用
  if (isDisabled) return

  // 清除其他选项的选中状态
  const newOptions = attrs.items.map((option, i) => ({
    ...option,
    checked: i === index,
  }))
  updateAttributes({ items: newOptions, updated: true })

  // 使用 setTimeout 重置标志位
  setTimeout(() => {
    updateAttributes({ updated: false })
  }, 0)
}
</script>

<style lang="less">
.umo-node-option-box {
  margin: 0;
  padding: 0 0.25em;
  box-sizing: border-box;
  display: inline-flex;

  .umo-option-box-checkbox-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;

    .umo-checkbox {
      font: inherit !important;
      color: inherit !important;
      transform: translateY(0.1em);
      &__label {
        font: inherit !important;
      }
      &__input {
        width: 1em;
        height: 1em;
        border-radius: 0.15em;
        &::after {
          width: 0.3em;
          height: 0.6em;
          left: 0.2em;
          top: 0.4em;
        }
      }
    }
  }

  .umo-option-box-radio-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;

    .umo-radio {
      font: inherit !important;
      color: inherit !important;
      transform: translateY(-0.1em);
      &__label {
        font: inherit !important;
      }
      &__input {
        width: 1em;
        height: 1em;
        border-radius: 50%;
        &::after {
          width: 1em;
          height: 1em;
          left: 0;
          top: 0;
          margin: 0 !important;
        }
      }
    }
  }
}
</style>
