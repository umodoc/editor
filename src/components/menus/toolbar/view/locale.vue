<template>
  <menus-button
    :text="t('view.locale')"
    ico="locale"
    menu-type="dropdown"
    huge
    :select-options="themes"
    @click="changeLocale"
  />
</template>

<script setup>
const setLocale = inject('setLocale')

const { locale } = useI18n()

const themes = computed(() => {
  return [
    {
      content: '🇱🇷 English',
      value: 'en-US',
      active: locale.value === 'en-US',
    },
  ]
})

const changeLocale = ({ value }) => {
  if (value) {
    setLocale(value, false)
  }
}
</script>
