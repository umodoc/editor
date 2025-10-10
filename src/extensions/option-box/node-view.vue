<template>
  <node-view-wrapper as="span" class="umo-node-option-box">
    <div v-if="boxType === 'radio'" class="umo-option-box-radio-container">
      <div v-for="(box, index) in boxOptions" :key="box.key">
        <t-radio
          :key="index"
          :checked="box.checked"
          :disabled="isDisabled"
          @change="handleRadioChange(index)"
        ></t-radio>
        <span>{{ box.label }}</span>
      </div>
    </div>
    <div v-else class="umo-option-box-checkbox-container">
      <div v-if="boxShowCheckAll">
        <t-checkbox
          key="checkallInxex"
          :checked="boxChecked"
          :disabled="isDisabled"
          @click="handleCheckboxAll"
        ></t-checkbox>
        <span>{{ t('insert.option.check') }}</span>
      </div>
      <div v-for="(box, index) in boxOptions" :key="box.key">
        <t-checkbox
          :key="index"
          :checked="box.checked"
          :disabled="isDisabled"
          @click="handleCheckboxChange(index)"
        ></t-checkbox>
        <span>{{ box.label }}</span>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
const options = inject('options')
const page = inject('page')
const editor = inject('editor')
const props = defineProps(nodeViewProps)
const { updateAttributes } = props

// 创建响应式的计算属性
const boxType = computed(() => props.node.attrs?.boxType ?? 'checkbox')
const boxOptions = computed(() => props.node.attrs?.boxOptions ?? [])
const boxShowCheckAll = computed(
  () => props.node.attrs?.boxShowCheckAll ?? false,
)
const boxChecked = computed(() => props.node.attrs?.boxChecked ?? false)
// 统一的禁用状态计算
const isDisabled = computed(() => {
  if (
    page.value?.preview?.enabled ||
    options.value?.document?.readOnly ||
    !editor.value?.isEditable
  ) {
    return true
  } else return false
})
// 防止重复调用的标志位
let isProcessing = false

// 处理复选框变化
const handleCheckboxChange = (index) => {
  // 如果是禁用状态，则忽略此次调用
  if (isDisabled.value) return
  // 如果正在处理中，则忽略此次调用
  if (isProcessing) return

  isProcessing = true
  const newOptions = [...boxOptions.value]
  newOptions[index].checked = !newOptions[index].checked
  updateAttributes({ boxOptions: newOptions })

  // 使用 setTimeout 重置标志位
  setTimeout(() => {
    isProcessing = false
  }, 0)
}

const handleCheckboxAll = () => {
  // 如果是禁用状态，则忽略此次调用
  if (isDisabled.value) return
  // 如果正在处理中，则忽略此次调用
  if (isProcessing) return

  isProcessing = true
  const newOptions = [...boxOptions.value]

  const newChecked = !boxChecked.value

  // 更新所有选项的选中状态
  newOptions.forEach((option) => {
    option.checked = newChecked
  })
  // 更新属性
  updateAttributes({
    boxOptions: newOptions,
    boxChecked: newChecked,
  })

  // 使用 setTimeout 重置标志位
  setTimeout(() => {
    isProcessing = false
  }, 0)
}

// 处理单选框变化
const handleRadioChange = (index) => {
  // 如果是禁用状态，则忽略此次调用
  if (isDisabled.value) return
  // 如果正在处理中，则忽略此次调用
  if (isProcessing) return

  isProcessing = true
  const newOptions = [...boxOptions.value]
  // 清除其他选项的选中状态
  newOptions.forEach((option, i) => {
    option.checked = i === index
  })
  updateAttributes({ boxOptions: newOptions })

  // 使用 setTimeout 重置标志位
  setTimeout(() => {
    isProcessing = false
  }, 0)
}
</script>

<style lang="less">
.umo-node-option-box {
  margin-left: 0.25em;
  margin-right: 0.25em;
  display: inline-block;

  .umo-option-box-checkbox-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;

    & .umo-checkbox {
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
  }
}
</style>
