<template>
  <div
    v-if="$toolbar.mode !== 'classic'"
    class="umo-toolbar-headding"
    :class="{ unfold: popupVisible }"
    :disabled="!editor?.isEditable"
  >
    <div class="umo-heading-container">
      <template v-for="(item, index) in options" :key="item.value">
        <div
          v-if="index < 4"
          class="card"
          :class="{ active: item.value === currentValue && editor?.isEditable }"
          @click="setHeading(item.value)"
        >
          <div class="title" :class="item.desc">{{ item.label }}</div>
          <div class="subtitle">{{ item.desc }}</div>
        </div>
      </template>
      <t-popup
        :attach="container"
        trigger="click"
        placement="bottom-right"
        overlay-class-name="umo-heading-container-popup"
        destroy-on-close
        :visible="popupVisible"
      >
        <div class="arrow" @click="popupVisible = !popupVisible">
          <icon name="arrow-down" />
        </div>
        <template #content>
          <div ref="popupContentRef" class="umo-heading-container">
            <template v-for="(item, index) in options" :key="item.value">
              <div
                v-if="index >= 4"
                class="card"
                :class="{
                  active: item.value === currentValue && editor?.isEditable,
                }"
                @click="setHeading(item.value)"
              >
                <div class="title" :class="item.desc">{{ item.label }}</div>
                <div class="subtitle">{{ item.desc }}</div>
              </div>
            </template>
          </div>
        </template>
      </t-popup>
    </div>
  </div>
  <menus-button
    v-else
    :text="t('base.heading.tip')"
    hide-text
    menu-type="select"
    :style="{ width: '76px' }"
    :placeholder="t('base.heading.text')"
    borderless
    :select-value="currentValue"
    @menu-click="setHeading"
  >
    <t-option
      v-for="item in options"
      :key="item.value"
      class="umo-heading-select-option"
      :value="item.value"
      :label="item.label"
    >
      <div class="heading-size" :class="item.desc">{{ item.label }}</div>
    </t-option>
  </menus-button>
</template>

<script setup lang="ts">
const { popupVisible } = usePopup()
const container = inject('container')
const editor = inject('editor')
const $toolbar = useState('toolbar', inject('options'))
const popupContentRef = ref(null)

const options = $ref([
  { label: t('base.heading.paragraph'), desc: 'text', value: 'paragraph' },
])
for (const i of Array.from({ length: 6 }).keys()) {
  const level = i + 1
  options.push({
    label: `${t('base.heading.text', { level })}`,
    desc: `h${level}`,
    value: level,
  })
}

const currentValue = computed(() => {
  const heading = (level: any) => editor.value?.isActive('heading', { level })
  if (editor.value) {
    if (editor.value?.isActive('paragraph')) {
      return 'paragraph'
    }
    if (heading(1)) {
      return 1
    }
    if (heading(2)) {
      return 2
    }
    if (heading(3)) {
      return 3
    }
    if (heading(4)) {
      return 4
    }
    if (heading(5)) {
      return 5
    }
    if (heading(6)) {
      return 6
    }
  }
  return ''
})

const setHeading = (value: any) => {
  if (value === 'paragraph') {
    editor.value?.chain().focus().setParagraph().run()
  } else {
    editor.value?.chain().focus().toggleHeading({ level: value }).run()
  }
  popupVisible.value = false
}

onClickOutside(
  popupContentRef,
  () => {
    popupVisible.value = false
  },
  {
    ignore: ['.umo-popup'],
  },
)
</script>

<style lang="less" scoped>
.umo-toolbar-headding {
  width: 318px;
  height: 56px;
  position: relative;
  z-index: 10;
  overflow: hidden;
  border-radius: 3px;
  box-sizing: border-box;
  &[disabled='true'] {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
  }
  &.unfold {
    overflow: visible;
    .umo-heading-container {
      border-color: var(--umo-border-color-light);
      border-bottom: none;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}
.umo-heading-container {
  display: flex;
  background-color: var(--umo-button-hover-background);
  padding: 2px 5px;
  flex-flow: row wrap;
  align-content: flex-start;
  border-radius: var(--umo-radius);
  box-sizing: border-box;
  border: solid 1px transparent;
  white-space: nowrap;
  .card {
    background-color: var(--umo-color-white);
    border: solid 1px var(--umo-border-color-light);
    border-radius: var(--umo-radius);
    margin: 4px 2px;
    text-align: center;
    padding: 5px 10px;
    box-sizing: border-box;
    cursor: pointer;
    flex: 0 0 68px;
    height: 42px;
    &:hover,
    &.active {
      border-color: var(--umo-primary-color);
    }
    .title {
      font-size: 14px;
      line-height: 18px;
      font-weight: 600;
      &.text {
        font-size: 12px;
        font-weight: 400;
      }
      &.h1 {
        font-size: 16px;
      }
      &.h2 {
        font-size: 14px;
      }
      &.h3 {
        font-size: 13px;
      }
      &.h4 {
        font-size: 12px;
      }
      &.h5 {
        font-size: 11px;
      }
      &.h6 {
        font-size: 10px;
      }
    }
    .subtitle {
      font-size: 8px;
      color: var(--umo-text-color-light);
      text-transform: capitalize;
      margin-top: 3px;
      line-height: 1;
    }
  }
  .arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 8px;
    top: 8px;
    height: 40px;
    border-radius: 3px;
    cursor: pointer;
    z-index: 20;
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    .umo-icon {
      font-size: 12px;
      color: var(--umo-text-color-light);
    }
  }
}
.unfold {
  .arrow {
    :deep(.umo-icon) {
      transform: rotate(-180deg);
    }
  }
}
</style>

<style lang="less">
.umo-heading-container-popup {
  .umo-popup__content {
    box-shadow: none;
    border: solid 1px var(--umo-border-color);
    border-top: none;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    margin: 1px -8px 0 0 !important;
    padding: 0;
    width: 318px;
    .heading-container {
      border-top-right-radius: 0;
      border-top-left-radius: 0;
    }
  }
}
.umo-heading-select-option {
  height: auto !important;
  .heading-size {
    line-height: 2em;
    font-weight: 600;
    min-width: 100px;
    color: var(--umo-text-color);
  }
  .text {
    font-size: 12px;
    font-weight: 400;
    line-height: 2.4em;
  }
  .h1 {
    font-size: 24px;
  }
  .h2 {
    font-size: 20px;
  }
  .h3 {
    font-size: 18px;
  }
  .h4 {
    font-size: 16px;
  }
  .h5 {
    font-size: 14px;
  }
  .h6 {
    font-size: 12px;
  }
}
</style>
