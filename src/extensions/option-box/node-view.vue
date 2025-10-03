<template>
  <node-view-wrapper as="span" class="umo-node-option-box">
    <div v-if="boxType === 'radio'" class="umo-option-box-radio-container">
      <div v-for="(box, index) in boxOptions" :key="box.key">
        <t-radio
          :key="index"
          :checked="box.checked"
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
          @click="handleCheckboxAll"
        ></t-checkbox>
        <span>{{ t('insert.option.check') }}</span>
      </div>
      <div v-for="(box, index) in boxOptions" :key="box.key">
        <t-checkbox
          :key="index"
          :checked="box.checked"
          @click="handleCheckboxChange(index)"
        ></t-checkbox>
        <span>{{ box.label }}</span>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)
const { updateAttributes } = props

// 创建响应式的计算属性
const boxType = computed(() => props.node.attrs?.boxType ?? 'checkbox')
const boxOptions = computed(() => props.node.attrs?.boxOptions ?? [])
const boxShowCheckAll = computed(
  () => props.node.attrs?.boxShowCheckAll ?? false,
)
const boxChecked = computed(() => props.node.attrs?.boxChecked ?? false)
// 防止重复调用的标志位
let isProcessing = false

// 处理复选框变化
const handleCheckboxChange = (index) => {
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
  display: block;
  padding-left: 0.5em;
  display: inline-block;
  transform: translateY(-0.05em);

  .umo-option-box-checkbox-container {
    display: flex;
    /* flex-direction: column;  加上这个变成行了*/
    flex-wrap: wrap;
    gap: 0.5em;

    & .umo-checkbox__label {
      font: inherit !important;
    }
    & .umo-checkbox {
      font: inherit !important;
      color: inherit !important;
      align-items: baseline;
    }
  }

  .umo-option-box-radio-container {
    display: flex;
    /* flex-direction: column;  加上这个变成行了*/

    flex-wrap: wrap;
    gap: 0.5em;
  }
}
</style>
