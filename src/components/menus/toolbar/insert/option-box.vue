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
        <t-select v-model="target" size="small" @change="initCalData">
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
              v-if="target === 'checkbox'"
              v-model="showCheckAll"
              class="umo-option-box-button-check-all"
              size="small"
              ><span style="font-size: 12px">{{
                t('insert.option.checkall')
              }}</span></t-checkbox
            >
          </div>
          <div class="umo-option-box-container-bottom">
            <div
              v-for="(box, index) in items"
              :key="box.key"
              class="umo-option-box-container-bottom-item"
            >
              <t-checkbox v-if="target === 'checkbox'" v-model="box.checked" />
              <t-radio
                v-if="target === 'radio'"
                :checked="box.checked"
                @click="radioChange(box, index)"
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
                @click="deleteItem(box)"
              >
                <icon class="umo-option-box-svg-icon" name="close" />
              </t-button>
            </div>
          </div>
        </div>
        <div class="umo-option-box-container-button">
          <t-button
            variant="outline"
            size="small"
            @click="togglePopup(false)"
            >{{ t('insert.option.cancel') }}</t-button
          >
          <t-button theme="primary" size="small" @click="confirm">{{
            t('insert.option.confirm')
          }}</t-button>
        </div>
      </div>
    </template>
  </menus-button>
</template>

<script setup>
import { shortId } from '@/utils/short-id'
const { popupVisible, togglePopup } = usePopup()
const container = inject('container')
const editor = inject('editor')
import { getSelectionNode } from '@/utils/selection'

const props = defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
})

let items = $ref([])
let target = $ref('checkbox')
let showCheckAll = $ref(false)

const initData = () => {
  items = []
  target = 'checkbox'
  showCheckAll = false
}

const initCalData = () => {
  for (let i = items.length - 1; i >= 0; i--) {
    if (!items[i].label && items[i].label === '') {
      items.splice(i, 1)
      continue
    }
    if (target === 'radio') {
      if (items[i].checked) {
        for (let j = 0; j < items.length; j++) {
          if (j !== i) {
            items[j].checked = false
          }
        }
      }
    }
    if (!items[i].key) {
      items[i].key = shortId()
    }
  }
}

const initDefaultItems = () => {
  if (items?.length > 0) {
    return
  }
  items.push(
    { label: t('insert.option.text1'), key: shortId(), checked: false },
    { label: t('insert.option.text2'), key: shortId(), checked: false },
  )
}

const radioChange = (box, i) => {
  if (items[i].checked) {
    items[i].checked = false
    return
  }
  for (const item of items) {
    if (item.checked) {
      item.checked = false
    }
  }
  items[i].checked = true
}
const addOption = async () => {
  const newOption = {
    label: '',
    key: shortId(),
    checked: false,
  }
  items.push(newOption)
  await nextTick()
  const el = document.querySelector(
    `${container} .umo-option-box-container-bottom`,
  )
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}
const deleteItem = (item) => {
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].key === item.key) {
      items.splice(i, 1)
      break
    }
  }
}

const confirm = () => {
  const noEmptyData = items.filter(
    (item) => item.label && item.label.trim()?.length > 0,
  )
  if (noEmptyData?.length === 0) {
    return
  }
  let _checkAll = false

  const optionConfig = editor.value ? getSelectionNode(editor.value) : null
  if (optionConfig?.type?.name === 'option-box' && optionConfig?.attrs) {
    _checkAll = optionConfig?.attrs?.checked || false
  }
  const _optionData = {
    dataType: 'optionBox',
    target: target === 'checkbox' ? 'checkbox' : 'radio',
    items: JSON.parse(JSON.stringify(noEmptyData)),
    checked: _checkAll,
    checkAll: showCheckAll === true ? true : false,
  }

  if (props.edit) {
    editor.value?.commands?.updateOptionBox(_optionData)
    editor.value?.commands?.focus()
  } else {
    editor.value?.chain().insertOptionBox(_optionData).focus().run()
  }
  togglePopup(false)
}

watch(
  () => popupVisible.value,
  (visible) => {
    if (visible) {
      initCalData()
      if (props?.edit) {
        const node = editor.value ? getSelectionNode(editor.value) : null
        const attrs = node?.attrs || {}
        if (node?.type?.name === 'optionBox') {
          items = JSON.parse(JSON.stringify(attrs?.items || []))
          target = attrs?.target || 'checkbox'
          showCheckAll = attrs?.checkAll || false
          console.log(items)
          initCalData()
        }
      }
      if (items?.length === 0) {
        initDefaultItems()
      }
    } else {
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
    flex-shrink: 0;
  }
  & .umo-option-box-title {
    margin: -5px 0 5px;
  }

  & .umo-option-box-container {
    padding: 6px 10px;
    width: 220px;
    height: 260px;
    border: solid 1px var(--td-border-level-2-color);
    border-radius: 4px;

    & .umo-option-box-button-svg-icon {
      margin-top: 2px;
      margin-left: -10px;
      font-size: 16px;
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
        margin: 6px 0;
        :deep(.umo-radio) {
          display: flex;
          &__label {
            margin-left: 3px;
          }
        }
      }
    }

    &-input {
      width: 160px;
    }

    &-delete {
      padding-left: 0px;
    }
    &-button {
      display: flex;
      gap: 8px;
      margin-top: 10px;
      justify-content: flex-end;
    }
  }
}
</style>
