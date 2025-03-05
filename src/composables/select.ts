// 为解决 tdesign-vue-next select 组件的自身 Bug，采用延时渲染来避免

export function useSelect() {
  const selectVisible = ref<boolean>(false)

  onMounted(() => {
    selectVisible.value = true
  })

  return { selectVisible }
}
