<template>
  <menus-button
    ico="page-orientation"
    :text="t('page.orientation.text')"
    menu-type="dropdown"
    overlay-class-name="umo-page-orientation-dropdown"
  >
    <template #dropmenu>
      <t-dropdown-menu>
        <t-dropdown-item
          v-for="(item, index) in orientations"
          :key="index"
          :value="item.value"
          :active="page.orientation === item.value"
          @click="page.orientation = item.value"
        >
          <div
            class="icon-orientation"
            :class="{ rotate: item.value === 'landscape' }"
          >
            <icon name="page" />
          </div>
          <div class="label">{{ item.label }}</div>
        </t-dropdown-item>
      </t-dropdown-menu>
    </template>
  </menus-button>
</template>

<script setup lang="ts">
const page = inject('page')

const orientations = [
  { label: t('page.orientation.landscape'), value: 'landscape' },
  { label: t('page.orientation.portrait'), value: 'portrait' },
]
</script>

<style lang="less">
.umo-page-orientation-dropdown {
  .umo-dropdown__item {
    max-width: unset !important;
    &-text {
      display: flex;
      padding: 5px 8px;
      .icon-orientation {
        font-size: 20px;
        margin-right: 5px;
        &.rotate {
          transform: rotate(90deg) rotateY(180deg) translate(0, 3px);
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
