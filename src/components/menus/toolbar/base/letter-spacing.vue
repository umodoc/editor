<template>
  <menus-button
    :text="t('base.letterSpacing.text')"
    ico="letter-spacing"
    hide-text
    menu-type="popup"
    :menu-active="editor?.isActive('spacing')"
    :popup-visible="popupVisible"
    :disabled="!editor?.can().chain().focus().setLetterSpacing().run()"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <div class="umo-letter-spacing-tile">
        {{ t('base.letterSpacing.tip', { value: spacing }) }}
        <tooltip :content="t('base.letterSpacing.reset')">
          <t-button
            variant="text"
            size="small"
            shape="square"
            @click="resetLetterSpacing"
          >
            <icon name="node-clear-format" size="16" />
          </t-button>
        </tooltip>
      </div>
      <div class="umo-letter-spacing-menu">
        <t-button
          variant="text"
          size="small"
          :disabled="spacing <= -1"
          @click="spacing = Math.round((spacing - 0.1) * 10) / 10"
        >
          <icon name="minus" />
        </t-button>
        <t-slider
          v-model="spacing"
          :min="-2"
          :max="20"
          :step="0.1"
          :tooltip-props="{
            visible: false,
          }"
        />
        <t-button
          variant="text"
          size="small"
          :disabled="spacing >= 10"
          @click="spacing = Math.round((spacing + 0.1) * 10) / 10"
        >
          <icon name="plus" />
        </t-button>
      </div>
    </template>
  </menus-button>
</template>

<script setup>
const { popupVisible, togglePopup } = usePopup()
const editor = inject('editor')

let spacing = $ref(0)
watch(
  () => popupVisible.value,
  (visible) => {
    if (!visible) {
      spacing = 0
    }
    const attrs = editor.value?.getAttributes('letterSpacing')
    spacing = attrs?.spacing ? parseFloat(attrs.spacing.replace('em', '')) : 0
  },
)
watch(
  () => spacing,
  (val) => {
    setLetterSpacing(val)
  },
)

const setLetterSpacing = () => {
  editor.value?.chain().focus().setLetterSpacing(`${spacing}em`).run()
}
const resetLetterSpacing = () => {
  spacing = 0
  popupVisible.value = false
}
</script>

<style lang="scss" scoped>
.umo-letter-spacing {
  &-tile {
    font-size: 12px;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
  }
  &-menu {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 200px;
    :deep(.umo-button) {
      width: 20px;
      height: 20px;
      font-size: 16px;
    }
  }
}
</style>
