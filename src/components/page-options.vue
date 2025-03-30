<template>
  <modal
    :visible="visible"
    icon="page-margin"
    :header="t('pageOptions.title')"
    width="450px"
    @close="emits('close')"
    @confirm="onConfirm"
  >
    <div class="umo-page-options-container">
      <t-form label-align="left">
        <t-form-item :label="t('page.orientation.text')">
          <t-radio-group
            v-model="pageOptions.orientation"
            variant="default-filled"
          >
            <t-radio-button value="landscape">
              <icon class="icon-rotate" name="page" />
              {{ t('page.orientation.landscape') }}
            </t-radio-button>
            <t-radio-button value="portrait">
              <icon name="page" />
              {{ t('page.orientation.portrait') }}
            </t-radio-button>
          </t-radio-group>
        </t-form-item>
        <t-form-item :label="t('page.size.text')">
          <t-select
            :popup-props="{
              overlayClassName: 'umo-page-size-select',
              destroyOnClose: true,
              attach: container,
            }"
            @change="selectPageSize as any"
          >
            <template #valueDisplay>
              {{ l(pageOptions.size?.label) }}
            </template>
            <t-option
              v-for="(item, index) in options.dicts?.pageSizes"
              :key="index"
              :value="index"
              :title="`${l(item.label)} (${item.width}×${item.height}${t('page.size.cm')})`"
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
          <div class="umo-page-setting">
            <div class="item">
              <t-input-number
                v-if="pageOptions?.size"
                v-model="pageOptions.size.width"
                class="umo-page-setting-number"
                theme="normal"
                align="center"
                :min="10"
                :label="t('pageOptions.size.width')"
                :suffix="t('page.size.cm')"
                placeholder=""
                :allow-input-over-limit="false"
                @blur="
                  (val: InputNumberValue) => inputPageSize(Number(val), 'width')
                "
              />
            </div>
            <div class="item">
              <t-input-number
                v-if="pageOptions?.size"
                v-model="pageOptions.size.height"
                class="umo-page-setting-number"
                theme="normal"
                align="center"
                :min="10"
                :label="t('pageOptions.size.height')"
                :suffix="t('page.size.cm')"
                placeholder=""
                :allow-input-over-limit="false"
                @blur="
                  (val: InputNumberValue) =>
                    inputPageSize(Number(val), 'height')
                "
              />
            </div>
          </div>
        </t-form-item>
        <t-form-item :label="t('pageOptions.margin.text')" name="name">
          <div>
            <div class="umo-page-margin-inbuilt">
              <div
                class="item"
                :class="{ active: !pageOptions.margin?.layout }"
                @click="selectPageMargin(options.page?.defaultMargin)"
                v-text="t('pageOptions.margin.default')"
              ></div>
              <div
                class="item narrow"
                :class="{ active: pageOptions.margin?.layout === 'narrow' }"
                @click="
                  selectPageMargin({
                    left: 1.27,
                    right: 1.27,
                    top: 1.27,
                    bottom: 1.27,
                    layout: 'narrow',
                  })
                "
                v-text="t('pageOptions.margin.narrow')"
              ></div>
              <div
                class="item moderate"
                :class="{ active: pageOptions.margin?.layout === 'moderate' }"
                @click="
                  selectPageMargin({
                    left: 1.91,
                    right: 1.91,
                    top: 2.54,
                    bottom: 2.54,
                    layout: 'moderate',
                  })
                "
                v-text="t('pageOptions.margin.moderate')"
              ></div>
              <div
                class="item wide"
                :class="{ active: pageOptions.margin?.layout === 'wide' }"
                @click="
                  selectPageMargin({
                    top: 2.54,
                    bottom: 2.54,
                    left: 5.08,
                    right: 5.08,
                    layout: 'wide',
                  })
                "
                v-text="t('pageOptions.margin.wide')"
              ></div>
            </div>
            <div class="umo-page-setting">
              <div class="item">
                <t-input-number
                  v-if="pageOptions?.margin"
                  v-model="pageOptions.margin.top"
                  class="umo-page-setting-number"
                  theme="normal"
                  align="center"
                  :min="0"
                  :step="0.1"
                  :label="t('pageOptions.margin.top')"
                  :suffix="t('page.size.cm')"
                  placeholder=""
                  :allow-input-over-limit="false"
                  @blur="
                    (val: InputNumberValue) =>
                      inputPageMargin(Number(val), 'top')
                  "
                />
              </div>
              <div class="item">
                <t-input-number
                  v-if="pageOptions?.margin"
                  v-model="pageOptions.margin.bottom"
                  class="umo-page-setting-number"
                  theme="normal"
                  align="center"
                  :min="0"
                  :step="0.1"
                  :label="t('pageOptions.margin.bottom')"
                  :suffix="t('page.size.cm')"
                  placeholder=""
                  :allow-input-over-limit="false"
                  @blur="
                    (val: InputNumberValue) =>
                      inputPageMargin(Number(val), 'bottom')
                  "
                />
              </div>
              <div class="item">
                <t-input-number
                  v-if="pageOptions?.margin"
                  v-model="pageOptions.margin.left"
                  class="umo-page-setting-number"
                  theme="normal"
                  align="center"
                  :min="0"
                  :step="0.1"
                  :label="t('pageOptions.margin.left')"
                  :suffix="t('page.size.cm')"
                  placeholder=""
                  :allow-input-over-limit="false"
                  @blur="
                    (val: InputNumberValue) =>
                      inputPageMargin(Number(val), 'left')
                  "
                />
              </div>
              <div class="item">
                <t-input-number
                  v-if="pageOptions?.margin"
                  v-model="pageOptions.margin.right"
                  class="umo-page-setting-number"
                  theme="normal"
                  align="center"
                  :min="0"
                  :step="0.1"
                  :label="t('pageOptions.margin.right')"
                  :suffix="t('page.size.cm')"
                  placeholder=""
                  :allow-input-over-limit="false"
                  @blur="
                    (val: InputNumberValue) =>
                      inputPageMargin(Number(val), 'right')
                  "
                />
              </div>
            </div>
          </div>
        </t-form-item>
      </t-form>
    </div>
  </modal>
</template>

<script setup lang="ts">
import type { InputNumberValue } from 'tdesign-vue-next'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})
const emits = defineEmits(['close'])

const container = inject('container')
const page = inject('page')
const options = inject('options')

let pageOptions = $ref({})
watch(
  () => props.visible,
  (visible: boolean) => {
    if (visible) {
      pageOptions = JSON.parse(JSON.stringify(page.value))
    }
  },
  { immediate: true },
)

// 页面大小
const selectPageSize = (value: number) => {
  pageOptions.size = options.value?.dicts?.pageSizes[value]
}
const inputPageSize = (value: number, field: 'width' | 'height') => {
  if (!pageOptions.size) {
    pageOptions.size = {
      width: 0,
      height: 0,
    }
  }
  if (!value || value < 10) {
    Reflect.set(pageOptions.size, field, 10)
    return
  }
  pageOptions.size.label = t('pageOptions.size.custom')
}

// 页边距
const selectPageMargin = (margin: {
  right: number
  left: number
  bottom: number
  top: number
  layout?: 'narrow' | 'moderate' | 'wide' | 'custom'
}) => {
  pageOptions.margin = margin
}
const inputPageMargin = (
  value: number,
  field: 'top' | 'bottom' | 'left' | 'right' | 'layout',
) => {
  if (!pageOptions.margin) {
    pageOptions.margin = {
      right: 0,
      left: 0,
      bottom: 0,
      top: 0,
    }
  }
  if (!value || value < 0) {
    Reflect.set(pageOptions.margin, field, 0)
    return
  }
  pageOptions.margin.layout = 'custom'
  selectPageMargin(pageOptions.margin)
}

const onConfirm = () => {
  page.value = pageOptions
  emits('close')
}
</script>

<style lang="less" scoped>
.umo-page-options-container {
  width: 400px;
  margin-top: 15px;
  :deep(.umo-radio-button__label) {
    display: flex;
    align-items: center;
    .umo-icon {
      margin-right: 5px;
      font-size: 20px;
      &.icon-rotate {
        transform: rotate(90deg) rotateY(180deg);
      }
    }
  }
}

.umo-page-margin-inbuilt {
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
.umo-page-setting {
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
.umo-page-size-select {
  .umo-select-option {
    padding: 0 8px;
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
