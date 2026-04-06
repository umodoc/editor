<template>
  <div
    v-if="items.length > 0"
    ref="popupRef"
    class="umo-popup umo-mention-popup"
  >
    <div class="umo-popup__content umo-dropdown">
      <div class="umo-dropdown__menu" style="padding: 5px; max-height: 320px">
        <div>
          <li
            v-for="(item, index) in items"
            :key="item.id || item.label || index"
            class="umo-dropdown__item umo-dropdown__item--theme-default umo-dropdown__item umo-mention-popup-item"
            :class="{ 'umo-dropdown__item--active': index === selectedIndex }"
            @click="selectItem(index)"
          >
            <div class="umo-mention-popup-item-content">
              <t-avatar
                class="umo-mention-popup-item-avatar"
                shape="circle"
                size="20px"
                :style="{ borderColor: item.color || 'transparent' }"
                :image="item.avatar"
              >
                {{ item.label?.slice(0, 1) }}
              </t-avatar>
              <span class="umo-mention-popup-item-name">{{ item.label }}</span>
            </div>
            <span v-if="item.bio" class="umo-mention-popup-item-bio">
              {{ item.bio }}
            </span>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  command: {
    type: Function,
    required: true,
  },
})

let selectedIndex = $ref(0)

watch(
  () => props.items,
  () => {
    selectedIndex = 0
  },
)

const onKeyDown = ({ event }) => {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    if (props.items.length === 0) {
      return false
    }
    enterHandler()
    return true
  }

  return false
}

const upHandler = () => {
  selectedIndex = (selectedIndex + props.items.length - 1) % props.items.length
}

const downHandler = () => {
  selectedIndex = (selectedIndex + 1) % props.items.length
}

const enterHandler = () => {
  selectItem(selectedIndex)
}

const selectItem = (index) => {
  const item = props.items[index]

  if (item) {
    props.command(item)
  }
}

defineExpose({
  onKeyDown,
})
</script>

<style lang="less">
.umo-node-mention {
  box-decoration-break: clone;
  color: var(--umo-primary-color);
  padding: 0.1em 0.2em;
  margin: 0 0.1em;
  border-radius: 0.2em;
  white-space: nowrap;
  cursor: default;
}
.umo-mention-popup {
  .umo-dropdown {
    &__menu {
      padding: 8px !important;
      border-radius: var(--umo-radius);
    }
    &__item--active {
      font-weight: 600;
    }
  }
  &-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 3px 6px !important;
    &:not(:last-child) {
      margin-bottom: 2px;
    }
    &-content {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    &-avatar {
      border-width: 1px;
      border-style: solid;
      border-radius: 50%;
      flex-shrink: 0;
      color: var(--umo-text-color);
      font-size: 14px;
      font-weight: 600;
      line-height: 1;
      background-color: rgba(0, 0, 0, 0.05);
    }
    &-name {
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &-bio {
      flex-shrink: 0;
      max-width: 160px;
      font-size: 12px;
      color: var(--umo-text-color-light);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &-empty {
    padding: 3px 5px;
    min-width: 100px;
    color: var(--umo-text-color-light);
  }
}
</style>
