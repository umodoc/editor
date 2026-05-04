import { onMounted, ref } from 'vue'

export const useSelect = () => {
  const selectVisible = ref(false)

  onMounted(() => {
    selectVisible.value = true
  })

  return { selectVisible }
}
