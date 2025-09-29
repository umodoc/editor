<template>
  <menus-button
    ico="checkbox"
    :text="t('insert.option.text')"
    menu-type="popup"
    huge
    :popup-visible="popupVisible"
    @toggle-popup="togglePopup"
  >
    <template #content>
      <div class="umo-insert-option-box">
        <div class="umo-option-box-title">{{ t('insert.option.tip') }}</div>
        <t-select v-model="boxType" size="small" @change="handleChange">
          <t-option
            key="checkbox"
            :label="t('insert.option.checkbox')"
            value="checkbox"
          />
          <t-option
            key="radio"
            :label="t('insert.option.radio')"
            value="radio"
          />
        </t-select>
        <div class="umo-virtual-group"></div>
        <div class="umo-option-box-title">{{ t('insert.option.content') }}</div>
        <div class="umo-option-box-container">
          <div class="umo-option-box-container-center">
            <t-button
              variant="text"
              theme="primary"
              size="small"
              @click="addOption"
            >
              <icon class="umo-option-box-button-svg-icon" name="block-add" />
              {{ t('insert.option.add') }}
            </t-button>
            <t-checkbox
              v-if="boxType === 'checkbox'"
              v-model="checkAll"
              class="umo-option-box-button-check-all"
              size="small"
              ><span style="font-size: 12px">{{
                t('insert.option.checkall')
              }}</span></t-checkbox
            >
          </div>
          <div class="umo-option-box-container-bottom">
            <div
              v-for="(box, index) in boxData"
              :key="box.key"
              class="umo-option-box-container-bottom-item"
            >
              <t-checkbox v-if="boxType === 'checkbox'" v-model="box.checked" />
              <t-radio
                v-if="boxType === 'radio'"
                :checked="box.checked"
                @click="radioClick(box, index)"
              />
              <t-input
                v-model="box.label"
                class="umo-option-box-container-input"
                size="small"
                :maxlength="30"
              />
              <t-button
                shape="square"
                variant="text"
                size="small"
                class="umo-option-box-container-delete"
                @click="deleteOption(box)"
              >
                <icon class="umo-option-box-svg-icon" name="close" />
              </t-button>
            </div>
          </div>
        </div>
        <div class="umo-option-box-container-button">
          <t-button variant="outline" size="small" @click="cancelClick">{{
            t('insert.option.cancel')
          }}</t-button>
          <t-button theme="primary" size="small" @click="confirmClick">{{
            t('insert.option.confirm')
          }}</t-button>
        </div>
      </div>
    </template>
  </menus-button>
</template>

<script setup lang="ts">
import { shortId } from '@/utils/short-id'
const { popupVisible, togglePopup } = usePopup()
const container = inject('container')
const editor = inject('editor')

let boxData = $ref([])
let boxType = $ref('checkbox')
let checkAll = $ref(false)

// 初始化界面上的数据值
const initData = () => {
  boxData = []
  boxType = 'checkbox'
  checkAll = false
}

// 初始化计算值
const initCalData = () => {
  // 加载前先处理数据 1.key不允许重复 2.boxType为radio时，checked 只能一个true 3.label 为空的去掉
  for (let i = boxData.length - 1; i >= 0; i--) {
    if (!boxData[i].label && boxData[i].label === '') {
      boxData.splice(i, 1)
      continue
    }
    if (boxType === 'radio') {
      if (boxData[i].checked) {
        for (let j = 0; j < boxData.length; j++) {
          if (j !== i) {
            boxData[j].checked = false
          }
        }
      }
    }
    boxData[i].key ??= shortId()
  }
}

const initDefaultBoxData = () => {
  if (boxData?.length > 0) {
    return
  }
  boxData.push(
    {
      label: t('insert.option.text1'),
      key: shortId(),
      checked: false,
    },
    {
      label: t('insert.option.text2'),
      key: shortId(),
      checked: false,
    },
  )
}
// 当单选时 1.当前选项为checked 为true时，首先变味false 2.当选选项为false时,其他选项为false 自己变为true
const radioClick = (box, i) => {
  if (boxData[i].checked) {
    boxData[i].checked = false
  } else {
    for (const item of boxData) {
      if (item.checked) {
        item.checked = false
      }
    }
    boxData[i].checked = true
  }
}
const addOption = () => {
  const newOption = {
    label: '',
    key: shortId(),
    checked: false,
  }
  boxData.push(newOption)
  // 添加时，自动定位到末尾
  nextTick(() => {
    const container = document.querySelector('.umo-option-box-container-bottom')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}
const deleteOption = (box) => {
  for (let i = boxData.length - 1; i >= 0; i--) {
    if (boxData[i].key === box.key) {
      boxData.splice(i, 1)
      break
    }
  }
}

const handleChange = () => {
  initCalData()
}
const cancelClick = () => {
  togglePopup(false)
}
const confirmClick = () => {
  const noEmptyData = boxData.filter(
    (item) => item.label && item.label.trim()?.length > 0,
  )
  if (noEmptyData?.length === 0) {
    return
  }
  editor.value
    ?.chain()
    .insertOptionBox({
      dataType: 'optionBox',
      boxType: boxType === 'checkbox' ? 'checkbox' : 'radio',
      boxOptions: JSON.parse(JSON.stringify(noEmptyData)),
      boxChecked: false,
      boxShowCheckAll: checkAll === true ? true : false,
    })
    .focus()
    .run()
  togglePopup(false)
}

watch(
  () => popupVisible.value,
  (visible) => {
    if (visible) {
      // 打开时：计算并初始化数据
      initCalData()
      if (boxData?.length === 0) {
        initDefaultBoxData()
      }
    } else {
      // 关闭时：重置组件状态
      initData()
    }
  },
  { immediate: true, deep: true },
)
</script>

<style lang="less" scoped>
@import '@/assets/styles/_mixins.less';
.umo-insert-option-box {
  user-select: none;
  & .umo-virtual-group {
    margin-top: 5px;
    margin-bottom: 10px;
    border-top: solid 1px var(--umo-border-color-light);
    flex-shrink: 0;
  }
  & .umo-option-box-title {
    padding-bottom: 5px;
  }

  & .umo-option-box-container {
    padding: 5px 0px 0px 12px;
    /* color: var(--umo-text-color-light); */
    width: 220px;
    height: 260px;
    border: solid 1px var(--umo-border-color-light);
    border-radius: 4px;

    & .umo-option-box-button-svg-icon {
      margin-top: 2px;
      margin-left: -10px;
      font-size: 16px;
    }

    & .umo-option-box-button-check-all {
      margin-right: 19px;
    }

    & .umo-option-box-svg-icon {
      font-size: 16px;
      color: var(--umo-text-color-light);
    }

    &-center {
      height: 25px;
      display: flex;
      justify-content: space-between;
    }

    &-bottom {
      .umo-scrollbar();
      height: 230px;
      overflow: auto;

      &-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 0;
      }
    }

    &-input {
      width: 145px;
    }

    &-delete {
      padding-left: 0px;
    }
    &-button {
      display: flex;
      gap: 8px;
      margin-top: 5px;
      justify-content: flex-end;
    }
  }
}
</style>
