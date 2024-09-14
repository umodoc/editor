<template>
  <div class="umo-source-container">
    <h3 class="umo-source-title">
      <icon name="code" class="icon-source" /> {{ t('toolbar.source') }}
    </h3>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.umo-source-container {
  padding: 0 10px;
  display: flex;
  align-items: center;
  .umo-source-title {
    font-size: 16px;
    font-weight: 400;
    display: flex;
    align-items: center;
    .icon-source {
      margin-right: 5px;
    }
  }
}
</style>
