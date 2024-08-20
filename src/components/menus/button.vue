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
      class="umo-menu-button-wrap"
      @click="tooltipVisible = false"
      @mouseover="tooltipVisible = true"
      @mouseleave="tooltipVisible = false"
    >
      <template v-if="menuType === 'button'">
        <t-button
          class="umo-menu-button"
          :class="{
            huge: huge && $toolbar.mode === 'ribbon',
            'show-text': !hideText,
            active: menuActive && editor?.isEditable !== false,
          }"
          shape="square"
          variant="text"
          size="small"
          :disabled="disabled || editor?.isEditable === false"
          @click="menuClick"
          v-bind="attrs"
        >
          <div class="umo-button-content">
            <slot />
            <template v-if="ico">
              <span v-if="ico?.startsWith('<')" class="icon-svg" v-html="ico">
              </span>
              <icon class="icon" v-else :name="ico" />
            </template>
            <p class="text">{{ text }}</p>
            <kbd class="kbd" v-if="shortcutText">
              {{ getShortcut(shortcutText) }}
            </kbd>
          </div>
        </t-button>
      </template>
      <template v-else-if="menuType === 'dropdown'">
        <template v-if="popupHandle === 'arrow'">
          <t-button
            class="umo-menu-button has-arrow"
            :class="{
              huge: huge && $toolbar.mode === 'ribbon',
              'show-text': !hideText,
              active: tooltipForceHide,
            }"
            variant="text"
            size="small"
            v-bind="attrs"
            :disabled="disabled || editor?.isEditable === false"
          >
            <div class="umo-button-content" @click="menuClick">
              <slot />
              <template v-if="ico">
                <span v-if="ico?.startsWith('<')" class="icon-svg" v-html="ico">
                </span>
                <icon class="icon" v-else :name="ico" />
              </template>
              <p class="text">{{ text }}</p>
              <kbd class="kbd" v-if="shortcutText">
                {{ getShortcut(shortcutText) }}
              </kbd>
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
              <span class="icon-arrow umo-button-handle">
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
              class="umo-menu-button has-arrow"
              :class="{
                huge: huge && $toolbar.mode === 'ribbon',
                'show-text': !hideText,
                active: tooltipForceHide,
              }"
              variant="text"
              size="small"
              v-bind="attrs"
              :disabled="disabled || editor?.isEditable === false"
            >
              <div class="umo-button-content" @click="menuClick">
                <slot />
                <template v-if="ico">
                  <span
                    v-if="ico?.startsWith('<')"
                    class="icon-svg"
                    v-html="ico"
                  >
                  </span>
                  <icon class="icon" v-else :name="ico" />
                </template>
                <p class="text">{{ text }}</p>
                <kbd class="kbd" v-if="shortcutText">{{
                  getShortcut(shortcutText)
                }}</kbd>
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
          :value="selectValue"
          :popup-props="{
            destroyOnClose: true,
            attach: container,
          }"
          v-bind="attrs"
          :options="selectOptions"
          :disabled="disabled || editor?.isEditable === false"
          @change="menuClick"
        >
          <slot />
        </t-select>
      </template>
      <template v-else-if="menuType === 'popup'">
        <template v-if="popupHandle === 'arrow'">
          <t-button
            class="umo-menu-button has-arrow"
            :class="{
              'show-text': !hideText,
              active: popupVisible,
            }"
            variant="text"
            size="small"
            v-bind="attrs"
            :disabled="disabled || editor?.isEditable === false"
          >
            <div class="umo-button-content" @click="menuClick">
              <slot />
              <template v-if="ico">
                <span v-if="ico?.startsWith('<')" class="icon-svg" v-html="ico">
                </span>
                <icon class="icon" v-else :name="ico" />
              </template>
              <p class="text">{{ text }}</p>
              <kbd class="kbd" v-if="shortcutText">
                {{ getShortcut(shortcutText) }}
              </kbd>
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
                class="icon-arrow umo-button-handle"
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
                class="icon-arrow umo-button-handle"
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
              class="umo-menu-button has-arrow"
              :class="{
                huge: huge && $toolbar.mode === 'ribbon',
                'show-text': !hideText,
                active: popupVisible,
              }"
              variant="text"
              size="small"
              v-bind="attrs"
              :disabled="disabled || editor?.isEditable === false"
              @click="togglePopup()"
            >
              <div class="umo-button-content">
                <slot />
                <template v-if="ico">
                  <span
                    v-if="ico?.startsWith('<')"
                    class="icon-svg"
                    v-html="ico"
                  >
                  </span>
                  <icon class="icon" v-else :name="ico" />
                </template>
                <p class="text">{{ text }}</p>
                <kbd class="kbd" v-if="shortcutText">{{
                  getShortcut(shortcutText)
                }}</kbd>
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
  // 菜单类型
  menuType: {
    type: String,
    default: 'button',
  },
  // 是否为大按钮
  huge: {
    type: Boolean,
    default: false,
  },
  // 按钮图标
  ico: {
    type: String,
    default: undefined,
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
  // 文字提示
  tooltip: {
    type: [String, Boolean],
    default: undefined,
  },
  // 快捷键
  shortcut: {
    type: String,
    default: undefined,
  },
  shortcutText: {
    type: String,
    default: undefined,
  },
  // Dropdown,Select 相关
  selectOptions: {
    type: Array,
  },
  selectValue: {
    type: [String, Number],
    default: '',
  },
  // Popup 相关
  popupVisible: {
    type: Boolean,
    default: false,
  },
  popupHandle: {
    type: String,
  },
  // 菜单激活状态
  menuActive: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['toggle-popup'])

const attrs = useAttrs()
const { container, editor } = useStore()
const $toolbar = useState('toolbar')
const menuClick = (...args) => {
  if (attrs.onMenuClickThrough) {
    attrs.onMenuClickThrough(...args)
  } else if (attrs.onMenuClick) {
    attrs.onMenuClick(...args)
  }
}

let tooltipVisible = $ref(false)
let tooltipForceHide = $ref(false)
const popupVisileChange = (visible) => {
  // 隐藏 Tooltip，适用于 select、dropdown、popup 等子组件展开时，隐藏 Tooltip
  tooltipForceHide = visible
  try {
    editor.value.commands.focus()
  } catch {}
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
.umo-menu-button {
  --td-comp-paddingLR-s: 5px;
  --td-radius-default: var(--umo-radius);
  border: none;
  &.show-text {
    width: auto;
    padding-left: var(--td-comp-paddingLR-s);
    padding-right: var(--td-comp-paddingLR-s);
    .umo-button-content .text {
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
  .umo-button-content {
    display: flex;
    align-items: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon,
    :deep(.umo-icon) {
      font-size: 16px;
    }
    .icon-svg {
      display: flex;
      :deep(svg) {
        width: 16px;
        height: 16px;
      }
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
    &.umo-button-handle {
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
    .umo-button-content {
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
      .icon-svg {
        display: flex;
        margin-top: 3px;
        :deep(svg) {
          width: 24px;
          height: 24px;
        }
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
      .umo-button-content {
        min-width: 40px;
      }
    }
  }
}
:global(.umo-popup-content) {
  padding: var(--umo-popup-content-padding);
}
</style>
