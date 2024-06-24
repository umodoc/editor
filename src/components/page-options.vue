<template>
  <modal
    :visible="visible"
    :footer="false"
    icon="page-margin"
    :header="t('pageOptions.title')"
    width="460px"
    @close="emits('close')"
  >
    <div class="page-options-container">
      <t-form label-align="left">
        <t-form-item :label="t('page.orientation.text')">
          <t-radio-group v-model="page.orientation" variant="default-filled">
            <t-radio-button value="landscape">
              <icon name="page" />
              {{ t('page.orientation.landscape') }}
            </t-radio-button>
            <t-radio-button value="portrait">
              <icon class="rotate" name="page" />
              {{ t('page.orientation.portrait') }}
            </t-radio-button>
          </t-radio-group>
        </t-form-item>
        <t-form-item :label="t('page.size.text')">
          <t-select
            :popup-props="{
              overlayClassName: 'page-size-select',
              destroyOnClose: true,
              attach: container,
            }"
            placeholder=""
            @change="selectPageSize"
          >
            <template #valueDisplay> {{ page.size.label }} </template>
            <t-option
              v-for="(item, index) in options.dicts.pageSizes"
              :key="index"
              :value="index"
            >
              <div class="label" v-text="l(item.label)"></div>
              <div class="desc">
                {{ item.width }}{{ t('page.size.cm') }} × {{ item.height
                }}{{ t('page.size.cm') }}
              </div>
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item :label="t('pageOptions.size.text')">
          <div class="page-setting">
            <div class="item">
              <t-input-number
                class="page-setting-number"
                v-model="page.size.width"
                theme="normal"
                align="center"
                :min="10"
                :label="t('pageOptions.size.width')"
                :suffix="t('page.size.cm')"
                placeholder=""
                :allow-input-overLimit="false"
                @blur="(val) => inputPageSize(val, 'width')"
              />
            </div>
            <div class="item">
              <t-input-number
                class="page-setting-number"
                v-model="page.size.height"
                theme="normal"
                align="center"
                :min="10"
                :label="t('pageOptions.size.height')"
                :suffix="t('page.size.cm')"
                placeholder=""
                :allow-input-overLimit="false"
                @blur="(val) => inputPageSize(val, 'height')"
              />
            </div>
          </div>
        </t-form-item>
        <t-form-item :label="t('pageOptions.margin.text')" name="name">
          <div>
            <div class="page-margin-inbuilt">
              <div
                class="item"
                :class="{ active: !page.margin.layout }"
                v-text="t('pageOptions.margin.default')"
                @click="selectPageMargin(options.page.defaultMargin)"
              ></div>
              <div
                class="item narrow"
                :class="{ active: page.margin.layout === 'narrow' }"
                v-text="t('pageOptions.margin.narrow')"
                @click="
                  selectPageMargin({
                    left: 1.27,
                    right: 1.27,
                    top: 1.27,
                    bottom: 1.27,
                    layout: 'narrow',
                  })
                "
              ></div>
              <div
                class="item moderate"
                :class="{ active: page.margin.layout === 'moderate' }"
                v-text="t('pageOptions.margin.moderate')"
                @click="
                  selectPageMargin({
                    left: 1.91,
                    right: 1.91,
                    top: 2.54,
                    bottom: 2.54,
                    layout: 'moderate',
                  })
                "
              ></div>
              <div
                class="item wide"
                :class="{ active: page.margin.layout === 'wide' }"
                v-text="t('pageOptions.margin.wide')"
                @click="
                  selectPageMargin({
                    top: 2.54,
                    bottom: 2.54,
                    left: 5.08,
                    right: 5.08,
                    layout: 'wide',
                  })
                "
              ></div>
            </div>
            <div class="page-setting">
              <div class="item">
                <t-input-number
                  class="page-setting-number"
                  v-model="page.margin.top"
                  theme="normal"
                  align="center"
                  :min="0"
                  :step="0.1"
                  :label="t('pageOptions.margin.top')"
                  :suffix="t('page.size.cm')"
                  placeholder=""
                  :allow-input-overLimit="false"
                  @blur="(val) => inputPageMargin(val, 'top')"
                />
              </div>
              <div class="item">
                <t-input-number
                  class="page-setting-number"
                  v-model="page.margin.bottom"
                  theme="normal"
                  align="center"
                  :min="0"
                  :step="0.1"
                  :label="t('pageOptions.margin.bottom')"
                  :suffix="t('page.size.cm')"
                  placeholder=""
                  :allow-input-overLimit="false"
                  @blur="(val) => inputPageMargin(val, 'bottom')"
                />
              </div>
              <div class="item">
                <t-input-number
                  class="page-setting-number"
                  v-model="page.margin.left"
                  theme="normal"
                  align="center"
                  :min="0"
                  :step="0.1"
                  :label="t('pageOptions.margin.left')"
                  :suffix="t('page.size.cm')"
                  placeholder=""
                  :allow-input-overLimit="false"
                  @blur="(val) => inputPageMargin(val, 'left')"
                />
              </div>
              <div class="item">
                <t-input-number
                  class="page-setting-number"
                  v-model="page.margin.right"
                  theme="normal"
                  align="center"
                  :min="0"
                  :step="0.1"
                  :label="t('pageOptions.margin.right')"
                  :suffix="t('page.size.cm')"
                  placeholder=""
                  :allow-input-overLimit="false"
                  @blur="(val) => inputPageMargin(val, 'right')"
                />
              </div>
            </div>
          </div>
        </t-form-item>
      </t-form>
    </div>
  </modal>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})
const emits = defineEmits(['close'])

const { container, options, page } = useStore()

// 页面大小
const selectPageSize = (index) => {
  page.value.size = options.value.dicts.pageSizes[index]
}
const inputPageSize = (value, field) => {
  if (!value || value < 10) {
    page.value.size[field] = 10
    return
  }
  page.value.size.label = t('pageOptions.size.custom')
}

// 页边距
const selectPageMargin = (margin) => {
  page.value.margin = margin
}
const inputPageMargin = (value, field) => {
  if (!value || value < 0) {
    page.value.margin[field] = 0
    return
  }
  page.value.margin.layout = 'custom'
  selectPageMargin(page.value.margin)
}
</script>

<style lang="less" scoped>
.page-options-container {
  width: 400px;
  margin-top: 15px;
  :deep(.umo-radio-button__label) {
    display: flex;
    align-items: center;
    .icon {
      margin-right: 5px;
      font-size: 20px;
      &.rotate {
        transform: rotate(90deg) rotateY(180deg);
      }
    }
  }
}

.page-margin-inbuilt {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .item {
    width: 60px;
    height: 80px;
    border: solid 1px var(--umo-border-color);
    border-radius: var(--umo-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--umo-button-hover-background);
    position: relative;
    cursor: pointer;
    overflow: hidden;
    font-size: 8px;
    &::after {
      position: absolute;
      display: block;
      content: ' ';
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border: solid 8px var(--umo-color-white);
      border-left-width: 10px;
      border-right-width: 10px;
    }
    &.narrow::after {
      border-width: 5px;
    }
    &.moderate::after {
      border-left-width: 6px;
      border-right-width: 6px;
    }
    &.wide::after {
      border-left-width: 13px;
      border-right-width: 13px;
    }
    &:hover,
    &.active {
      border-color: var(--umo-primary-color);
    }
  }
}
.page-setting {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  .item {
    display: flex;
    justify-content: space-between;
    &:nth-child(2n + 1) {
      margin-right: 10px;
    }
    &:first-child {
      margin-bottom: 10px;
    }
  }
  &-number {
    width: 140px;
    :deep(.umo-input__suffix) {
      opacity: 0.4;
    }
  }
}
</style>

<style lang="less">
.page-size-select {
  .umo-select-option {
    > span {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    .desc {
      font-size: 12px;
      color: var(--umo-text-color-light);
    }
  }
}
</style>
