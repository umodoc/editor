export function usePopup() {
  const popupVisible = ref(false)

  const togglePopup = (visible) => {
    popupVisible.value = visible !== undefined ? visible : !popupVisible.value
  }

  return { popupVisible, togglePopup }
}
