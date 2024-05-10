<template>
  <editor-menus-button
    button-type="dropdown"
    overlay-class-name="page-orientation-dropdown"
  >
    <icon name="page-orientation" style="margin-left: 1px" />
    <span class="button-text">页面方向</span>
    <template #dropmenu>
      <t-dropdown-menu>
        <t-dropdown-item
          v-for="(item, index) in orientations"
          :key="index"
          :value="item.value"
          :active="page.orientation === item.value"
          @click="page.orientation = item.value"
        >
          <div class="icon" :class="{ rotate: item.value === 'vertical' }">
            <icon name="page" />
          </div>
          <div class="label">{{ item.label }}</div>
        </t-dropdown-item>
      </t-dropdown-menu>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { page } = useStore()

const orientations = [
  { label: '横向', value: 'horizontal' },
  { label: '纵向', value: 'vertical' },
]
</script>

<style lang="less">
.page-orientation-dropdown {
  .umo-dropdown__item {
    max-width: unset !important;
    &-text {
      display: flex;
      padding: 5px 8px;
      .icon {
        font-size: 20px;
        margin-right: 5px;
        &.rotate {
          transform: rotate(90deg) rotateY(180deg) translate(3px, 3px);
        }
      }
      .label {
        font-size: 14px;
        color: var(--umo-text-color);
      }
    }
  }
}
</style>
