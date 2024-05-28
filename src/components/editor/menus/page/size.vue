<template>
  <editor-menus-button
    ico="page-size"
    text="页面大小"
    menu-type="dropdown"
    overlay-class-name="page-size-dropdown"
  >
    <template #dropmenu>
      <t-dropdown-menu>
        <t-dropdown-item
          v-for="(item, index) in options.dicts.pageSizes"
          :key="index"
          :value="index"
          :active="page.size.width === item.width"
          :divider="options.dicts.pageSizes.length - 1 === index"
          :min-column-width="150"
          @click="page.size = item"
        >
          <div class="label">{{ item.label }}</div>
          <div class="desc">{{ item.width }}厘米 × {{ item.height }}厘米</div>
        </t-dropdown-item>
        <t-dropdown-item @click="dialogVisible = true">
          <div class="label">自定义设置</div>
        </t-dropdown-item>
      </t-dropdown-menu>
    </template>
    <page-options :visible="dialogVisible" @close="dialogVisible = false" />
  </editor-menus-button>
</template>

<script setup>
const { options, page } = useStore()
let dialogVisible = $ref(false)
</script>

<style lang="less">
.page-size-dropdown {
  .umo-dropdown__item {
    max-width: unset !important;
    &-text {
      padding: 3px;
      .label {
        font-size: 14px;
        color: var(--umo-text-color);
      }
      .desc {
        color: var(--umo-text-color-light);
        margin-top: -3px;
        text-transform: uppercase;
        font-size: 12px;
      }
    }
  }
}
</style>
