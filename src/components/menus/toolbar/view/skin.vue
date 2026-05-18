<template>
  <menus-button
    :text="t('view.skin')"
    ico="skin"
    menu-type="dropdown"
    huge
    :select-options="skins"
    @click="changeSkin"
  />
</template>

<script setup>
const options = inject('options')
const setSkin = inject('setSkin')

const skins = computed(() => {
  const skin = useStorage('umo-editor:skin', options.value.skin)
  return [
    {
      content: t('view.skinDefault'),
      value: 'default',
      active: skin.value === 'default',
    },
    {
      content: t('view.skinModern'),
      value: 'modern',
      active: skin.value === 'modern',
    },
  ]
})

const changeSkin = ({ value }) => {
  if (value) {
    setSkin(value)
  }
}
</script>
