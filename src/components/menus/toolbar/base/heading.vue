<template>
  <div
    v-if="$toolbar.mode !== 'classic'"
    class="toolbar-headding"
    :class="{ unfold: popupVisible }"
    :disabled="!editor?.isEditable"
  >
    <div class="heading-container">
      <template v-for="(item, index) in options" :key="item.value">
        <div
          class="card"
          :class="{ active: item.value === currentValue && editor?.isEditable }"
          v-if="index < 4"
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
        overlay-class-name="heading-container-popup"
        destroy-on-close
        :visible="popupVisible"
      >
        <div class="arrow" @click="popupVisible = !popupVisible">
          <icon name="arrow-down" />
        </div>
        <template #content>
          <div ref="popupContentRef" class="heading-container">
            <template v-for="(item, index) in options" :key="item.value">
              <div
                class="card"
                :class="{
                  active: item.value === currentValue && editor?.isEditable,
                }"
                v-if="index >= 4"
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
      class="editor-heading-select-option"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    >
      <div class="heading-size" :class="item.desc">{{ item.label }}</div>
    </t-option>
  </menus-button>
</template>

<script setup>
let { popupVisible } = usePopup()
const { container, editor } = useStore()
const $toolbar = useState('toolbar')
const popupContentRef = ref(null)

const options = $ref([
  { label: t('base.heading.paragraph'), desc: 'text', value: 'paragraph' },
])
for (let i in Array.from({ length: 6 })) {
  const level = Number(i) + 1
  options.push({
    label: `${t('base.heading.text', { level })}`,
    desc: `h${level}`,
    value: level,
  })
}

const currentValue = computed(() => {
  const heading = (level) => editor.value?.isActive('heading', { level })
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

const setHeading = (value) => {
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
.toolbar-headding {
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
    .heading-container {
      border-color: var(--umo-border-color-light);
      border-bottom: none;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}
.heading-container {
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
    .icon {
      font-size: 12px;
      color: var(--umo-text-color-light);
    }
  }
}
.unfold {
  .arrow {
    :deep(.icon) {
      transform: rotate(-180deg);
    }
  }
}
</style>

<style lang="less">
.heading-container-popup {
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
.editor-heading-select-option {
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
