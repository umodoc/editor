<template>
  <t-tooltip
    :content="`${tooltip || ''}${shortcut ? ' (' + getShortcut(shortcut) + ')' : ''}`"
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
      <template v-if="buttonType === 'button'">
        <t-button
          class="menu-button"
          :class="{
            'toolbar-classic': $toolbar.mode === 'classic',
            'huge-button': hugeButton,
            active: buttonActive && editor?.isEditable,
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
          </div>
          <slot v-if="hugeButton" name="text" />
        </t-button>
      </template>
      <template v-else-if="buttonType === 'dropdown'">
        <template v-if="popupHandle === 'arrow'">
          <t-button
            class="menu-button has-arrow"
            :class="{
              'toolbar-classic': $toolbar.mode === 'classic',
              'huge-button': hugeButton,
              active: tooltipForceHide,
            }"
            variant="text"
            size="small"
            v-bind="attrs"
            :disabled="disabled || !editor?.isEditable"
          >
            <div class="button-content">
              <div @click="buttonClick">
                <slot />
              </div>
            </div>
            <slot v-if="hugeButton" name="text" />
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
                'toolbar-classic': $toolbar.mode === 'classic',
                'huge-button': hugeButton,
                active: tooltipForceHide,
              }"
              variant="text"
              size="small"
              v-bind="attrs"
              :disabled="disabled || !editor?.isEditable"
            >
              <div class="button-content" @click="buttonClick">
                <slot />
                <span v-if="$toolbar.mode === 'ribbon'" class="icon-arrow">
                  <icon name="arrow-down" />
                </span>
              </div>
              <slot v-if="hugeButton" name="text" />
              <span v-if="$toolbar.mode === 'classic'" class="icon-arrow">
                <icon name="arrow-down" />
              </span>
            </t-button>
            <slot v-if="!selectOptions" name="dropmenu" />
          </t-dropdown>
        </template>
      </template>
      <template v-else-if="buttonType === 'select'">
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
      <template v-else-if="buttonType === 'popup'">
        <template v-if="popupHandle === 'arrow'">
          <t-button
            class="menu-button has-arrow"
            :class="{ active: popupVisible }"
            variant="text"
            size="small"
            v-bind="attrs"
            :disabled="disabled || !editor?.isEditable"
          >
            <div @click="buttonClick">
              <slot />
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
                'toolbar-classic': $toolbar.mode === 'classic',
                'huge-button': hugeButton,
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
                <span v-if="$toolbar.mode === 'ribbon'" class="icon-arrow">
                  <icon name="arrow-down" />
                </span>
              </div>
              <slot v-if="hugeButton" name="text" />
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
  // 提示
  tooltip: {
    type: String,
    default: undefined,
  },
  // 快捷键
  shortcut: {
    type: String,
    default: undefined,
  },
  // Button 相关
  buttonType: {
    type: String,
    default: 'button',
  },
  buttonActive: {
    type: Boolean,
    default: false,
  },
  hugeButton: {
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
  &.width-auto {
    width: auto;
    padding-left: var(--td-comp-paddingLR-s);
    padding-right: var(--td-comp-paddingLR-s);
  }
  &[disabled] {
    :deep(.icon) {
      --umo-primary-color: var(--umo-text-color-disabled);
      color: var(--umo-text-color-disabled) !important;
    }
    :deep(.button-text) {
      color: var(--umo-text-color-disabled) !important;
    }
  }
  &.toolbar-classic {
    padding: 0;
    :deep(.umo-button__text) {
      padding: 0 3px;
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
  :deep(.umo-button__text) {
    display: flex;
    align-items: center;
    .icon {
      font-size: 16px;
    }
    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      .button-text {
        margin-left: 3px;
        color: var(--umo-text-color);
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
  }
  &.huge-button {
    padding: 0 3px;
    width: auto;
    &.toolbar-classic {
      :deep(.umo-button__text) {
        display: flex;
        align-items: center;
        .icon {
          font-size: 18px !important;
          @media screen and (min-width: 640px) {
            margin-left: -2px;
          }
        }
        .icon-arrow {
          margin: 0 -5px 0 2px;
        }
        .button-text {
          margin-left: 3px;
          @media screen and (max-width: 640px) {
            display: none;
          }
        }
      }
    }
    &:not(.toolbar-classic) {
      --td-comp-paddingLR-s: 6px;
      --td-comp-size-xs: 'auto';
      padding: 0 var(--td-comp-paddingLR-s);
      height: 56px;
      margin-bottom: 0;
      flex-direction: column;
      .button-content {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;
      }
      :deep(.umo-button__text) {
        flex-direction: column;
        .icon {
          display: block;
          font-size: 24px;
          margin-top: 5px;
        }
        .button-text {
          font-size: 12px;
          color: var(--umo-text-color);
          margin: 4px 0 2px 0;
        }
      }
      &.has-arrow {
        .button-content {
          padding-left: 9px;
        }
      }
    }
  }
}
:global(.umo-popup-content) {
  padding: var(--umo-popup-content-padding);
}
</style>
