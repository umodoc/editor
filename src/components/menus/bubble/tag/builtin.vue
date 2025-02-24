<template>
  <div class="umo-bubble-tag-builtin">
    <div
      v-for="item in tags"
      :key="item.type"
      class="umo-bubble-tag-item"
      :style="{
        color: item.color,
        backgroundColor: item.backgroundColor,
      }"
      @click="selectStyle(item)"
    >
      <icon
        v-if="editor?.getAttributes('tag').type === item.type"
        name="selected"
        size="14"
      />
      <span v-else class="umo-bubble-tag-item-text">A</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const tags = [
  {
    color: '#999',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    type: 'default',
  },
  {
    color: 'rgba(200, 78, 67, 1)',
    backgroundColor: 'rgb(252, 223, 220)',
    type: 'danger',
  },
  {
    color: 'rgba(63, 133, 255, 1)',
    backgroundColor: 'rgb(217, 231, 255)',
    type: 'primary',
  },
  {
    color: 'rgba(240, 196, 23, 1)',
    backgroundColor: 'rgb(255, 245, 210)',
    type: 'warning',
  },
  {
    color: 'rgba(5, 205, 153, 1)',
    backgroundColor: 'rgb(205, 245, 235)',
    type: 'success',
  },
]

const editor = inject('editor')

const selectStyle = (item: (typeof tags)[0]) => {
  const tag = editor.value?.state?.selection?.$from?.node()
  if (tag) {
    editor.value?.commands.updateAttributes('tag', {
      type: item.type,
      color: item.color,
      backgroundColor: item.backgroundColor,
    })
  }
}
</script>

<style lang="less">
.umo-bubble-tag-builtin {
  margin-right: 5px;
  display: flex;
  align-items: center;
}
.umo-bubble-tag-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: solid 1px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  margin-left: 5px;
  &-text {
    font-size: 14px;
  }
}
</style>
