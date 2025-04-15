<template>
  <menus-button
    ico="watermark"
    :text="t('page.watermark.text')"
    huge
    menu-type="popup"
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <div class="umo-watermark-container">
        <div class="umo-watermark-toolbar">
          <menus-button
            style="width: 140px"
            :tooltip="t('page.watermark.fontFamily')"
            menu-type="select"
            :select-options="fonts ?? []"
            :select-value="page.watermark?.fontFamily"
            @menu-click="
              (value: string) => {
                if (page.watermark) {
                  page.watermark.fontFamily = value
                }
              }
            "
          ></menus-button>
          <menus-button
            menu-type="input"
            :tooltip="t('page.watermark.fontSize')"
          >
            <t-input-number
              v-if="page.watermark"
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
          <menus-toolbar-base-color
            v-if="page.watermark"
            :text="t('page.watermark.fontColor')"
            :default-color="page.watermark?.fontColor"
            modeless
            @change="
              (value: string) => {
                if (page.watermark) {
                  page.watermark.fontColor = value
                }
              }
            "
          />
          <menus-toolbar-base-bold
            v-if="page.watermark"
            :menu-active="page.watermark.fontWeight === 'bold'"
            @menu-click-through="
              page.watermark.fontWeight === 'bold'
                ? (page.watermark.fontWeight = 'normal')
                : (page.watermark.fontWeight = 'bold')
            "
          />
        </div>
        <t-input
          v-if="page.watermark"
          v-model="page.watermark.text"
          maxlength="30"
          clearable
          :placeholder="t('page.watermark.content')"
        />
        <div
          class="umo-watermark-type-title"
          v-text="t('page.watermark.type')"
        ></div>
        <div class="umo-watermark-type">
          <div
            v-if="page.watermark"
            class="item compact"
            :class="{ active: page.watermark.type === 'compact' }"
            @click="page.watermark.type = 'compact'"
          >
            <div class="bg"></div>
            <span v-text="t('page.watermark.compact')"></span>
          </div>
          <div
            v-if="page.watermark"
            class="item spacious"
            :class="{ active: page.watermark.type === 'spacious' }"
            @click="page.watermark.type = 'spacious'"
          >
            <div class="bg"></div>
            <span v-text="t('page.watermark.spacious')"></span>
          </div>
        </div>
        <t-button
          v-if="page.watermark?.text"
          class="umo-clear-button"
          block
          variant="outline"
          @click="clearWatermark"
          v-text="t('page.watermark.clear')"
        ></t-button>
      </div>
    </template>
  </menus-button>
</template>

<script setup lang="ts">
const { popupVisible, togglePopup } = usePopup()

const page = inject('page')
const options = inject('options')

const fonts = options.value.dicts?.fonts.map((item: any) => {
  return {
    label: l(item.label),
    value: item.value ?? '',
  }
})

const clearWatermark = () => {
  if (page.value.watermark) {
    page.value.watermark.text = ''
  }
  popupVisible.value = false
}
</script>

<style lang="less" scoped>
.umo-watermark-container {
  width: 320px;
  .umo-watermark-toolbar {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .umo-watermark-type {
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
  .umo-clear-button {
    margin-top: 20px;
  }
}
</style>
