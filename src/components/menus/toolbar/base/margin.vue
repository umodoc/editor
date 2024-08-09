<template>
  <menus-button
    ico="margin"
    :text="t('base.margin.text')"
    menu-type="popup"
    popup-handle="arrow"
    hide-text
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
    @menu-click="resetMargin()"
  >
    <template #content>
      <div class="node-margin-input">
        <t-input-number
          v-model="margin.top"
          theme="column"
          align="left"
          size="small"
          :label="`↥${t('base.margin.top')}:`"
          :placeholder="t('base.margin.default')"
          :input-props="{ clearable: true }"
          :max="100"
          :min="0"
        />
        <t-input-number
          v-model="margin.bottom"
          theme="column"
          align="left"
          size="small"
          :label="`↧${t('base.margin.bottom')}:`"
          :placeholder="t('base.margin.default')"
          :input-props="{ clearable: true }"
          :max="100"
          :min="0"
        />
        <t-button variant="outline" size="small" @click="resetMargin">
          {{ t('base.margin.reset') }}
        </t-button>
      </div>
    </template>
  </menus-button>
</template>

<script setup>
let { popupVisible, togglePopup } = usePopup()
const { editor } = useStore()

const margin = $ref({ top: '', bottom: '' })
const resetMargin = () => {}
</script>

<style lang="less" scoped>
.node-margin-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
  --td-comp-size-xs: 26px;
  width: 150px;
  :deep(.umo-input-number) {
    width: 100%;
  }
}
</style>
