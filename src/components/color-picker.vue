<template>
  <div class="umo-color-picker-container">
    <div class="umo-color-picker-default-button">
      <t-button
        theme="default"
        variant="outline"
        size="small"
        block
        @click="selectColor(color)"
        v-text="t('colorPicker.default')"
      >
      </t-button>
    </div>
    <div class="umo-color-picker-group">
      <div
        v-for="(item, index) in options.dicts?.colors"
        :key="index"
        class="umo-color-picker-item"
        :style="{ backgroundColor: item }"
        @click="selectColor(item)"
      ></div>
    </div>
    <div
      class="umo-color-picker-group-title"
      v-text="t('colorPicker.standard')"
    ></div>
    <div class="umo-color-picker-group">
      <div
        v-for="(item, index) in standardColors"
        :key="index"
        class="umo-color-picker-item"
        :style="{ backgroundColor: item }"
        @click="selectColor(item)"
      ></div>
    </div>
    <div
      v-if="$recent.colors.length > 0"
      class="umo-color-picker-group-title"
      v-text="t('colorPicker.recent')"
    ></div>
    <div v-if="$recent.colors.length > 0" class="umo-color-picker-group">
      <div
        v-for="(item, index) in $recent.colors"
        :key="index"
        class="umo-color-picker-item"
        :style="{ backgroundColor: item }"
        @click="selectColor(item)"
      ></div>
    </div>
    <div class="umo-color-picker-divider"></div>
    <t-popup
      :attach="container"
      trigger="click"
      placement="right-bottom"
      @visible-change="(visible: boolean) => (moreColorPicker = visible)"
    >
      <div class="umo-color-picker-more" :class="{ active: moreColorPicker }">
        <div class="umo-color-picker-more-menu">
          <icon name="palette-color" />
          <span v-text="t('colorPicker.more')"></span>
        </div>
        <div class="umo-color-picker-more-arrow">
          <icon name="arrow-down" />
        </div>
      </div>
      <template #content>
        <t-color-picker-panel
          v-model="color"
          size="small"
          :color-modes="['monochrome']"
          :swatch-colors="[]"
          enable-alpha
          @change="colorChange"
        />
      </template>
    </t-popup>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  defaultColor: {
    type: String,
    default: '#000',
  },
})
const emits = defineEmits(['change'])

const container = inject('container')
const editor = inject('editor')
const options = inject('options')
const $recent = useState('recent', options)
// prettier-ignore
const standardColors = ['#B12318', '#EB3323', '#F6C143', '#FFFE55', '#A0CD63', '#4FAD5B', '#4CAFEA', '#2D70BA', '#06215C', '#68389B']

const color = $ref(props.defaultColor)

// 更多颜色
const moreColorPicker = $ref(false)
const colorChange = (color: string, ctx?: { trigger: string }) => {
  if (ctx && ctx.trigger !== 'palette-saturation-brightness') {
    return
  }
  $recent.value.colors.forEach((item: string, index: number) => {
    if (item === color) {
      $recent.value.colors.splice(index, 1)
    }
  })
  $recent.value.colors.unshift(color)
  if ($recent.value.colors.length > 10) {
    $recent.value.colors.splice(10, 1)
  }
  emits('change', color)
}
watch(
  () => moreColorPicker,
  (visible: boolean) => {
    if (visible) {
      editor.value?.commands.focus(undefined, { scrollIntoView: false })
    }
  },
)

// 选择颜色
const selectColor = (color: string) => {
  colorChange(color)
  emits('change', color)
}
</script>

<style lang="less" scoped>
.umo-color-picker {
  &-container {
    width: 236px;
  }
  &-default-button {
    .umo-button {
      height: 28px;
    }
  }
  &-group {
    display: flex;
    flex-wrap: wrap;
    margin: 8px 0;
    gap: 4px;
    &-title {
      color: var(--umo-text-color-light);
      font-size: 12px;
      margin: 5px 0 2px;
    }
  }
  &-item {
    width: 20px;
    height: 20px;
    border: solid 1px rgba(0, 0, 0, 0.1);
    margin-bottom: 2px;
    flex-basis: 20px;
    box-sizing: border-box;
    transition: all 0.2s;
    cursor: pointer;
    border-radius: 3px;
    &:hover {
      transform: scale(1.1);
      border-color: rgba(0, 0, 0, 0.3);
    }
  }
  &-divider {
    height: 1px;
    background-color: var(--umo-border-color-light);
    margin: 10px 0;
  }
  &-more {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    cursor: pointer;
    &:hover,
    &.active {
      background-color: var(--td-bg-color-container-hover);
      border-radius: var(--umo-radius);
    }
    &-menu {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: var(--umo-text-color-light);
      cursor: pointer;
      .umo-icon {
        margin-right: 5px;
        font-size: 18px;
      }
    }
    &-arrow {
      .umo-icon {
        transform: rotate(-90deg);
      }
    }
  }
}
</style>
