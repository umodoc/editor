<template>
  <div v-if="$toolbar.show" class="toolbar-container">
    <toolbar-ribbon
      v-if="$toolbar.mode === 'ribbon'"
      :menus="toolbarMenus"
      :current-menu="currentMenu"
      @menu-change="menuChange"
    />
    <toolbar-classic
      v-if="$toolbar.mode === 'classic'"
      :menus="toolbarMenus"
      :current-menu="currentMenu"
      @menu-change="menuChange"
    />
    <toolbar-source
      v-if="$toolbar.mode === 'source' && options.toolbar.enableSourceEditor"
    />
    <div class="toolbar-actions" :class="$toolbar.mode">
      <t-popup
        v-if="$toolbar.mode !== 'source' && editor?.isEditable"
        :attach="container"
        trigger="click"
        placement="bottom-right"
        @visible-change="(visible) => (statusPopup = visible)"
      >
        <t-button
          class="button"
          variant="text"
          size="small"
          :class="{ active: statusPopup }"
        >
          <span class="status">
            <span class="status-online" :class="{ offline: !online }"></span>
            <span class="status-saved button-text">
              <span v-if="savedAt"> {{ timeAgo(savedAt) }}保存</span>
              <span class="unsaved" v-else>文档未保存</span>
            </span>
          </span>
        </t-button>
        <template #content>
          <div class="document-status-container status">
            <div>网络状态： {{ online ? '在线' : '离线' }}</div>
            <div>
              保存时间：
              <span v-if="savedAt"> {{ timeAgo(savedAt) }}保存</span>
              <span v-else>未保存</span>
            </div>
            <div class="document-button-container">
              <t-button size="small" @click="saveContent">保存文档</t-button>
              <t-button
                size="small"
                variant="outline"
                @click="setContentFromCache"
              >
                从缓存中恢复
              </t-button>
            </div>
          </div>
        </template>
      </t-popup>
      <t-dropdown
        trigger="click"
        size="small"
        placement="bottom-right"
        :popup-props="{
          destroyOnClose: true,
          attach: container,
        }"
        @click="toggleToolbarMode"
      >
        <t-button class="button" variant="text" size="small">
          <icon name="expand-down" />
          <span class="button-text">切换工具栏</span>
        </t-button>
        <template #dropdown>
          <t-dropdown-menu
            v-for="item in editorModeOptions"
            :key="item.value"
            :content="item.label"
            :value="item.value"
            :divider="item.divider"
            :active="item.value === $toolbar.mode"
          >
            <template #prefixIcon>
              <icon :name="item.prefixIcon" />
            </template>
          </t-dropdown-menu>
        </template>
      </t-dropdown>
    </div>
  </div>
  <tooltip v-else content="显示工具栏" placement="bottom-right">
    <div class="show-toolbar" @click="$toolbar.show = true">
      <icon name="arrow-down" />
    </div>
  </tooltip>
</template>

<script setup>
import timeAgo from '@/utils/time-ago'

const emits = defineEmits(['menu-change'])
const { container, options, editor, savedAt } = useStore()
const $toolbar = useState('toolbar')
const statusPopup = $ref(false)
const online = useOnline()

// 工具栏菜单
const defaultToolbarMenus = [
  { label: '开始', value: 'base' },
  { label: '插入', value: 'insert' },
  { label: '表格', value: 'table' },
  { label: '工具', value: 'tools' },
  { label: '页面', value: 'page' },
  { label: '导出', value: 'export' },
]
let toolbarMenus = defaultToolbarMenus
if (options.value.toolbar.menus) {
  toolbarMenus = options.value.toolbar.menus.map(
    (item) => defaultToolbarMenus.filter((menu) => menu.value === item)[0],
  )
}
let currentMenu = $ref(toolbarMenus[0].value)
const menuChange = (menu) => {
  currentMenu = menu
  emits('menu-change', menu)
}
// 监听如果当前编辑元素为table则切换到table菜单
watch(
  () => editor.value?.isActive('table'),
  (val, oldVal) => {
    if (val) {
      currentMenu = 'table'
    } else if (!val && oldVal) {
      currentMenu = 'base'
    }
  },
)

// 切换编辑器模式
const editorModeOptions = computed(() => {
  const modeOptions = [
    {
      label: '专业工具栏',
      value: 'ribbon',
      prefixIcon: 'toolbar-ribbon',
    },
    {
      label: '经典工具栏',
      value: 'classic',
      prefixIcon: 'toolbar-classic',
    },
    {
      label: '隐藏工具栏',
      value: 'hideToolbar',
      prefixIcon: 'hide-toolbar',
    },
  ]
  if (options.value.toolbar.enableSourceEditor) {
    modeOptions.splice(2, 0, {
      label: '编辑源代码',
      value: 'source',
      prefixIcon: 'toolbar-source',
      divider: true,
    })
  }
  return modeOptions
})

const toggleToolbarMode = ({ value }) => {
  if (value === 'hideToolbar') {
    $toolbar.value.show = false
  } else {
    $toolbar.value.show = true
    $toolbar.value.mode = value
  }
}

// 保存文档
const saveContent = inject('saveContent')

// 从缓存中恢复文档
const setContentFromCache = () => {
  const document = useState('document')
  const { content } = document.value
  if (!content || content === '' || content === '<p></p>') {
    const dialog = useAlert({
      theme: 'info',
      header: '错误提示',
      body: '当前缓存中没有内容。',
      placement: 'center',
      onConfirm() {
        dialog.destroy()
      },
    })
    return
  }
  editor.value?.chain().setContent(content, true).focus().run()
}
</script>

<style lang="less" scoped>
.toolbar-container {
  display: flex;
  justify-content: space-between;
  user-select: none;
  border-bottom: solid 1px var(--umo-border-color);
  position: relative;
}
.toolbar-actions {
  padding: 6px 10px;
  display: flex;
  align-items: center;
  &.ribbon {
    position: absolute;
    right: 0;
    top: 1px;
  }
  .button {
    &.active {
      background-color: var(--umo-button-hover-background);
    }
    &:not(:last-child) {
      margin-right: 3px;
    }
    :deep(.umo-button__text) {
      display: flex;
      align-items: center;
      .icon {
        margin-right: 3px;
      }
    }
  }
  @media screen and (max-width: 640px) {
    padding-left: 0;
    .status-online {
      margin-right: 0;
    }
    .button-text {
      display: none;
    }
  }
}
.show-toolbar {
  cursor: pointer;
  position: absolute;
  right: 20px;
  font-size: 18px;
  padding: 3px 6px;
  z-index: 99;
  background-color: var(--umo-color-white);
  color: var(--umo-text-color-light);
  border-bottom-left-radius: var(--umo-radius);
  border-bottom-right-radius: var(--umo-radius);
  border: solid 1px var(--umo-border-color);
  border-top: none;
  &:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.08);
    color: var(--umo-primary-color);
  }
}
.status {
  font-size: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &-online {
    width: 10px;
    height: 10px;
    background: rgb(26, 187, 26);
    border-radius: 50%;
    &.offline {
      background: rgb(187, 26, 26);
    }
  }
  &-saved {
    color: var(--umo-text-color-light);
    margin-left: 5px;
    .unsaved {
      color: var(--umo-error-color);
    }
  }
}
.document-status-container {
  flex-direction: column;
  align-items: unset;
  padding: 10px 15px;
  color: var(--umo-text-color);
  min-width: 150px;
  cursor: default;
  .document-button-container {
    margin: 6px 0 4px;
    display: flex;
    gap: 6px;
  }
}
</style>
