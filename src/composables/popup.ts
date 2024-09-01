export function usePopup() {
  const popupVisible = ref(false)

  const togglePopup = (visible?: boolean) => {
    popupVisible.value = visible ?? !popupVisible.value
  }

  return { popupVisible, togglePopup }
}
