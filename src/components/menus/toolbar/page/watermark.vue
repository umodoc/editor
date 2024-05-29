<template>
  <menus-button
    ico="watermark"
    text="页面水印"
    huge
    menu-type="popup"
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <div class="watermark-container">
        <div class="watermark-toolbar">
          <menus-button
            style="width: 140px"
            tooltip="水印文字字体"
            menu-type="select"
            :select-options="options.dicts.fonts"
            :value="page.watermark.fontFamily"
            @button-click="(value) => (page.watermark.fontFamily = value)"
          ></menus-button>
          <menus-button menu-type="input" tooltip="水印文字大小">
            <t-input-number
              v-model="page.watermark.fontSize"
              style="width: 60px"
              size="small"
              theme="column"
              align="center"
              :max="96"
              :min="12"
              :allow-input-over-limit="false"
              placeholder=""
            >
            </t-input-number>
          </menus-button>
          <menus-toolbar-base-bold
            :menu-active="page.watermark.fontWeight === 'bold'"
            @button-click-through="
              page.watermark.fontWeight === 'bold'
                ? (page.watermark.fontWeight = 'normal')
                : (page.watermark.fontWeight = 'bold')
            "
          />
          <menus-toolbar-base-color
            text="水印文字颜色"
            :default-color="page.watermark.fontColor"
            modeless
            @change="(value) => (page.watermark.fontColor = value)"
          />
        </div>
        <t-input
          v-model.trim="page.watermark.text"
          maxlength="30"
          clearable
          placeholder="水印文字内容"
        />
        <div class="watermark-type-title">水印类型</div>
        <div class="watermark-type">
          <div
            class="item compact"
            :class="{ active: page.watermark.type === 'compact' }"
            @click="page.watermark.type = 'compact'"
          >
            <div class="bg"></div>
            <span>紧凑型</span>
          </div>
          <div
            class="item spacious"
            :class="{ active: page.watermark.type === 'spacious' }"
            @click="page.watermark.type = 'spacious'"
          >
            <div class="bg"></div>
            <span>宽松型</span>
          </div>
        </div>
        <t-button
          class="clear-button"
          v-if="page.watermark.text !== ''"
          block
          variant="outline"
          @click="clearWatermark"
          >清除水印</t-button
        >
      </div>
    </template>
  </menus-button>
</template>

<script setup>
let { popupVisible, togglePopup } = usePopup()

const { options, page } = useStore()

const clearWatermark = () => {
  page.value.watermark.text = ''
  popupVisible.value = false
}
</script>

<style lang="less" scoped>
.watermark-container {
  width: 320px;
  .watermark-switch {
    margin-bottom: 15px;
  }
  .watermark-toolbar {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .watermark-type {
    display: flex;
    &-title {
      color: var(--umo-text-color-light);
      margin: 10px 0;
      font-size: 12px;
    }
    .item {
      cursor: pointer;
      &:first-child {
        margin-right: 10px;
      }
      .bg {
        width: 70px;
        height: 90px;
        border: solid 1px var(--umo-border-color);
        position: relative;
        border-radius: var(--umo-radius);
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
      }
      span {
        display: block;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 12px;
        padding: 0 10px;
        text-align: center;
        margin-top: 8px;
        font-size: 12px;
      }
      &:hover,
      &.active {
        .bg {
          border-color: var(--umo-primary-color);
        }
        span {
          color: var(--umo-primary-color);
        }
      }
      &.compact .bg {
        background-image: url('@/assets/images/watermark-compact.png');
      }
      &.spacious .bg {
        background-image: url('@/assets/images/watermark-spacious.png');
      }
    }
  }
  .clear-button {
    margin-top: 20px;
  }
}
</style>
