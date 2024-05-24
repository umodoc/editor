<template>
  <t-tooltip
    :content="getTooltipContent"
    :visible="tooltipVisible && !tooltipForceHide"
    theme="light"
    placement="top"
    :attach="container"
    :show-arrow="false"
    destroy-on-close
  >
    <div
      class="menu-button-wrap"
      @click="tooltipVisible = false"
      @mouseover="tooltipVisible = true"
      @mouseleave="tooltipVisible = false"
    >
      <template v-if="menuType === 'button'">
        <t-button
          class="menu-button"
          :class="{
            huge: huge && $toolbar.mode === 'ribbon',
            'show-text': !hideText,
            active: menuActive && editor?.isEditable,
          }"
          shape="square"
          variant="text"
          size="small"
          :disabled="disabled || !editor?.isEditable"
          @click="buttonClick"
          v-bind="attrs"
        >
          <div class="button-content">
            <slot />
            <icon class="icon" v-if="ico" :name="ico" />
            <p class="text">{{ text }}</p>
          </div>
        </t-button>
      </template>
      <template v-else-if="menuType === 'dropdown'">
        <template v-if="popupHandle === 'arrow'">
          <t-button
            class="menu-button has-arrow"
            :class="{
              huge: huge && $toolbar.mode === 'ribbon',
              'show-text': !hideText,
              active: tooltipForceHide,
            }"
            variant="text"
            size="small"
            v-bind="attrs"
            :disabled="disabled || !editor?.isEditable"
          >
            <div class="button-content" @click="buttonClick">
              <slot />
              <icon class="icon" v-if="ico" :name="ico" />
              <p class="text">{{ text }}</p>
            </div>
            <t-dropdown
              v-bind="attrs"
              trigger="click"
              size="small"
              :options="selectOptions"
              :popup-props="{
                overlayClassName: attrs['overlay-class-name'],
                popperOptions: {
                  modifiers: [
                    { name: 'offset', options: { offset: [-22, 0] } },
                  ],
                },
                onVisibleChange: popupVisileChange,
                destroyOnClose: true,
                attach: container,
              }"
              @click="attrs.onChange"
            >
              <span class="icon-arrow handle">
                <icon name="arrow-down" />
              </span>
              <slot v-if="!selectOptions" name="dropmenu" />
            </t-dropdown>
          </t-button>
        </template>
        <template v-else>
          <t-dropdown
            v-bind="attrs"
            trigger="click"
            size="small"
            :options="selectOptions"
            :popup-props="{
              overlayClassName: attrs['overlay-class-name'],
              onVisibleChange: popupVisileChange,
              destroyOnClose: true,
              attach: container,
            }"
            @click="attrs.onChange"
          >
            <t-button
              class="menu-button has-arrow"
              :class="{
                huge: huge && $toolbar.mode === 'ribbon',
                'show-text': !hideText,
                active: tooltipForceHide,
              }"
              variant="text"
              size="small"
              v-bind="attrs"
              :disabled="disabled || !editor?.isEditable"
            >
              <div class="button-content" @click="buttonClick">
                <slot />
                <icon class="icon" v-if="ico" :name="ico" />
                <p class="text">{{ text }}</p>
                <span v-if="$toolbar.mode === 'ribbon'" class="icon-arrow">
                  <icon name="arrow-down" />
                </span>
              </div>
              <span v-if="$toolbar.mode === 'classic'" class="icon-arrow">
                <icon name="arrow-down" />
              </span>
            </t-button>
            <slot v-if="!selectOptions" name="dropmenu" />
          </t-dropdown>
        </template>
      </template>
      <template v-else-if="menuType === 'select'">
        <t-select
          size="small"
          placement="bottom-left"
          :on-popup-visible-change="popupVisileChange"
          :value="value"
          :popup-props="{
            destroyOnClose: true,
            attach: container,
          }"
          v-bind="attrs"
          :options="selectOptions"
          :disabled="disabled || !editor?.isEditable"
          @change="buttonClick"
        >
          <slot />
        </t-select>
      </template>
      <template v-else-if="menuType === 'popup'">
        <template v-if="popupHandle === 'arrow'">
          <t-button
            class="menu-button has-arrow"
            :class="{
              'show-text': !hideText,
              active: popupVisible,
            }"
            variant="text"
            size="small"
            v-bind="attrs"
            :disabled="disabled || !editor?.isEditable"
          >
            <div class="button-content" @click="buttonClick">
              <slot />
              <icon class="icon" v-if="ico" :name="ico" />
              <p class="text">{{ text }}</p>
            </div>
            <t-popup
              :attach="container"
              trigger="click"
              placement="bottom-left"
              v-bind="attrs"
              :visible="popupVisible"
              :popper-options="{
                modifiers: [{ name: 'offset', options: { offset: [-22, 0] } }],
              }"
            >
              <span
                v-if="$toolbar.mode === 'ribbon'"
                ref="popupHandleRef"
                class="icon-arrow handle"
                @click="togglePopup()"
              >
                <icon name="arrow-down" />
              </span>
              <template #content>
                <div class="umo-popup-content" ref="popupContentRef">
                  <slot name="content" />
                </div>
              </template>
              <span
                v-if="$toolbar.mode === 'classic'"
                ref="popupHandleRef"
                class="icon-arrow handle"
                @click="togglePopup()"
              >
                <icon name="arrow-down" />
              </span>
            </t-popup>
          </t-button>
        </template>
        <template v-else>
          <t-popup
            :attach="container"
            trigger="click"
            placement="bottom-left"
            :visible="popupVisible"
          >
            <t-button
              ref="popupHandleRef"
              class="menu-button has-arrow"
              :class="{
                huge: huge && $toolbar.mode === 'ribbon',
                'show-text': !hideText,
                active: popupVisible,
              }"
              variant="text"
              size="small"
              v-bind="attrs"
              :disabled="disabled || !editor?.isEditable"
              @click="togglePopup()"
            >
              <div class="button-content">
                <slot />
                <icon class="icon" v-if="ico" :name="ico" />
                <p class="text">{{ text }}</p>
                <span v-if="$toolbar.mode === 'ribbon'" class="icon-arrow">
                  <icon name="arrow-down" />
                </span>
              </div>
              <span v-if="$toolbar.mode === 'classic'" class="icon-arrow">
                <icon name="arrow-down" />
              </span>
            </t-button>
            <template #content>
              <div class="umo-popup-content" ref="popupContentRef">
                <slot name="content" />
              </div>
            </template>
          </t-popup>
        </template>
      </template>
      <template v-else>
        <slot />
      </template>
    </div>
  </t-tooltip>
</template>

<script setup>
import getShortcut from '@/utils/shortcut'

const props = defineProps({
  value: {
    type: [String, Number],
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // 按钮图标
  ico: {
    type: String,
    default: '',
  },
  // 按钮文字
  text: {
    type: String,
    default: '',
  },
  hideText: {
    type: Boolean,
    default: false,
  },
  // 提示
  tooltip: {
    type: [String, Boolean],
    default: undefined,
  },
  // 快捷键
  shortcut: {
    type: String,
    default: undefined,
  },
  // 菜单类型
  menuType: {
    type: String,
    default: 'button',
  },
  huge: {
    type: Boolean,
    default: false,
  },
  // 菜单激活状态
  menuActive: {
    type: Boolean,
    default: false,
  },
  // Dropdown,Select 相关
  selectOptions: {
    type: Array,
  },
  // Popup 相关
  popupVisible: {
    type: Boolean,
    default: false,
  },
  popupHandle: {
    type: String,
  },
})
const emits = defineEmits(['toggle-popup'])

const attrs = useAttrs()
const { container, editor } = useStore()
const $toolbar = useState('toolbar')
const buttonClick = (...args) => {
  if (attrs.onButtonClickThrough) {
    attrs.onButtonClickThrough(...args)
  } else if (attrs.onButtonClick) {
    attrs.onButtonClick(...args)
  }
}

let tooltipVisible = $ref(false)
let tooltipForceHide = $ref(false)
const popupVisileChange = (visible) => {
  // 隐藏 Tooltip，适用于 select、dropdown、popup 等子组件展开时，隐藏 Tooltip
  tooltipForceHide = visible
}
const getTooltipContent = () => {
  if (props.tooltip === false) {
    return ''
  }
  if (props.huge && props.tooltip) {
    return `${props.tooltip}${props.shortcut ? ` (${getShortcut(props.shortcut)})` : ''}`
  }
  if (props.text) {
    return `${props.tooltip || props.text}${props.shortcut ? ` (${getShortcut(props.shortcut)})` : ''}`
  }
  return ''
}
watch(
  () => props.popupVisible,
  (val) => {
    tooltipForceHide = val
  },
)

// Popup
const popupHandleRef = ref(null)
const popupContentRef = ref(null)
const togglePopup = (visible) => {
  emits('toggle-popup', visible)
}
onClickOutside(
  popupContentRef,
  () => {
    emits('toggle-popup', false)
  },
  {
    ignore: [popupHandleRef, '.umo-popup'],
  },
)
</script>

<style lang="less" scoped>
.menu-button {
  --td-comp-paddingLR-s: 5px;
  --td-radius-default: var(--umo-radius);
  border: none;
  &.show-text {
    width: auto;
    padding-left: var(--td-comp-paddingLR-s);
    padding-right: var(--td-comp-paddingLR-s);
    .button-content .text {
      display: block !important;
      margin-left: 3px;
    }
  }
  &[disabled] {
    .icon {
      --umo-primary-color: var(--umo-text-color-disabled);
      color: var(--umo-text-color-disabled) !important;
    }
    .text {
      color: var(--umo-text-color-disabled) !important;
    }
  }
  &-wrap {
    display: inline-flex;
    &:not(:last-child) {
      margin-right: 5px;
    }
  }
  &.active {
    background-color: var(--umo-button-hover-background);
    .icon-arrow.handle {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
  .button-content {
    display: flex;
    align-items: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon,
    :deep(.icon) {
      font-size: 16px;
    }
    .text {
      display: none;
    }
  }
  .icon-arrow {
    display: flex;
    border-top-right-radius: var(--td-radius-default);
    border-bottom-right-radius: var(--td-radius-default);
    width: 12px;
    height: 26px;
    align-items: center;
    justify-content: center;
    margin-right: -3px;
    .icon {
      font-size: 10px;
      color: var(--umo-text-color-light);
    }
    &.handle {
      margin: 0 -4px 0 2px;
      &:hover {
        background-color: var(--td-bg-color-container-active);
      }
    }
  }
  &.huge {
    padding: 0 3px;
    width: auto;
    padding: 0 var(--td-comp-paddingLR-s);
    height: 56px;
    margin-bottom: 0;
    flex-direction: column;
    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      min-width: 32px;
      .icon {
        display: block;
        font-size: 24px;
        margin-top: 3px;
      }
      .text {
        display: block;
        font-size: 12px;
        color: var(--umo-text-color);
      }
      .icon-arrow {
        position: absolute;
        left: calc(50% + 12px);
        top: 2px;
      }
    }
    &.has-arrow {
      .button-content {
        min-width: 40px;
      }
    }
  }
}
:global(.umo-popup-content) {
  padding: var(--umo-popup-content-padding);
}
</style>
