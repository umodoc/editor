<template>
  <t-dropdown
    :attach="`${container} .page-container`"
    placement="bottom-right"
    overlay-class-name="block-menu-dropdown"
    trigger="click"
    :max-height="500"
    :destroy-on-close="false"
    :popup-props="{
      onVisibleChange(visible) {
        menuVisible = visible
      },
    }"
  >
    <div
      class="block-menu-hander"
      :style="`transform: translate(-32px, ${menuScrollTop}px);`"
    >
      <menus-button :menu-active="menuVisible" ico="block-menu" hide-text />
    </div>
    <t-dropdown-menu>
      <t-dropdown-item class="block-menu-group-name" disabled>
        插入新内容
      </t-dropdown-item>
      <t-dropdown-item :divider="options.templates?.length === 0">
        <menus-button ico="node-add" text="选择节点" :tooltip="false" />
        <t-dropdown-menu overlay-class-name="block-menu-dropdown">
          <t-dropdown-item>
            <menus-button
              ico="table"
              text="表格"
              :tooltip="false"
              @button-click="editor?.chain().focus().insertTable().run()"
            />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-toolbar-insert-image :huge="false" :tooltip="false" />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-toolbar-insert-video
              v-if="!disableItem('video')"
              :huge="false"
              :tooltip="false"
            />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-toolbar-insert-audio
              v-if="!disableItem('audio')"
              :huge="false"
              :tooltip="false"
            />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-toolbar-insert-file
              v-if="!disableItem('file')"
              :huge="false"
              :tooltip="false"
            />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-toolbar-insert-code-block
              v-if="!disableItem('code-block')"
              :huge="false"
              shortcutText="Ctrl+Alt+C"
              :tooltip="false"
            />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-button
              ico="horizontal-line"
              text="分割线"
              :tooltip="false"
              @button-click="
                editor
                  .chain()
                  .focus()
                  .setHorizontalRule({ type: 'signle' })
                  .run()
              "
            />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-toolbar-insert-toc :huge="false" :tooltip="false" />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-toolbar-insert-text-box :huge="false" :tooltip="false" />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-toolbar-insert-web-page :huge="false" :tooltip="false" />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-toolbar-tools-qrcode :huge="false" :tooltip="false" />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-toolbar-tools-barcode :huge="false" :tooltip="false" />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-toolbar-tools-signature
              :huge="false"
              :tooltip="false"
              v-if="!disableItem('signature')"
            />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-toolbar-tools-seal
              v-if="!disableItem('seal')"
              :huge="false"
              :tooltip="false"
            />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-toolbar-tools-diagrams
              v-if="!disableItem('diagrams')"
              :huge="false"
              :tooltip="false"
            />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-toolbar-tools-mermaid
              v-if="!disableItem('mermaid')"
              :huge="false"
              :tooltip="false"
            />
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown-item>
      <t-dropdown-item v-if="options.templates.length > 0" divider>
        <menus-button ico="template" text="插入模板" :tooltip="false" />
        <t-dropdown-menu overlay-class-name="block-menu-dropdown">
          <t-dropdown-item
            v-for="item in options.templates"
            :key="item.value"
            :value="item.value"
            :divider="item.divider"
            @click="setTemplate(item)"
          >
            <div class="dropdown-item-label">{{ item.title }}</div>
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown-item>
      <t-dropdown-item class="block-menu-group-name" disabled>
        切换节点类型
      </t-dropdown-item>
      <t-dropdown-item :disabled="editor?.isActive('paragraph')">
        <menus-button
          ico="paragraph"
          text="段落"
          :tooltip="false"
          shortcut-text="ctrl+alt+0"
          @button-click="toggleNodeType('paragraph')"
        />
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-button ico="heading" text="标题" :tooltip="false" />
        <t-dropdown-menu overlay-class-name="block-menu-dropdown">
          <t-dropdown-item
            v-for="item in headings"
            :key="item.level"
            :disabled="editor?.isActive('heading', { level: item.level })"
          >
            <menus-button
              :tooltip="false"
              :shortcut-text="`ctrl+alt+${item.level}`"
              @button-click="toggleNodeType('heading', { level: item.level })"
            >
              <span class="heading">
                <span class="icon">H{{ item.level }}</span> {{ item.text }}
              </span>
            </menus-button>
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-button
          ico="ordered-list-2"
          text="有序列表"
          :tooltip="false"
          shortcut-text="Ctrl+Shift+7"
          :menu-active="editor?.isActive('orderedList')"
          @button-click="toggleNodeType('orderedList')"
        />
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-button
          ico="bullet-list-2"
          text="无序列表"
          :tooltip="false"
          shortcut-text="Ctrl+Shift+8"
          :menu-active="editor?.isActive('bulletList')"
          @button-click="toggleNodeType('bulletList')"
        />
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-button
          ico="task-list-2"
          text="待办事项"
          :tooltip="false"
          shortcut-text="Ctrl+Shift+9"
          :menu-active="editor?.isActive('taskList')"
          @button-click="toggleNodeType('taskList')"
        />
      </t-dropdown-item>
      <t-dropdown-item divider>
        <menus-button
          ico="quote"
          text="引用"
          :tooltip="false"
          shortcut-text="Ctrl+Shift+B"
          :menu-active="editor?.isActive('blockquote')"
          @button-click="toggleNodeType('blockquote')"
        />
      </t-dropdown-item>
      <t-dropdown-item class="block-menu-group-name" disabled>
        其他操作
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-button
          ico="node-delete-2"
          text="删除节点"
          :tooltip="false"
          @button-click="deleteNode"
        />
      </t-dropdown-item>
    </t-dropdown-menu>
  </t-dropdown>
</template>

<script setup>
const { container, options, editor } = useStore()
let menuVisible = $ref(false)
let menuScrollTop = $ref(0)
const updateMenuPostion = () => {
  const currentBlock = document.querySelector(`${container} .node-focused`)
  if (currentBlock !== null) menuScrollTop = currentBlock.offsetTop
}
watch(
  editor,
  (val) => {
    if (val) editor.value.on('selectionUpdate', updateMenuPostion)
  },
  { immediate: true },
)

const headings = $ref([
  { text: '一级标题', level: 1 },
  { text: '二级标题', level: 2 },
  { text: '三级标题', level: 3 },
  { text: '四级标题', level: 4 },
  { text: '五级标题', level: 5 },
  { text: '六级标题', level: 6 },
])

const disableItem = (name) => {
  return options.value.toolbar.disableMenuItems.includes(name)
}

const setTemplate = ({ content }) => {
  if (!content || !editor.value) return
  editor.value.commands.insertContent(content)
}

const toggleNodeType = (type, props = {}) => {
  editor.value?.chain().focus().run()
  switch (type) {
    case 'paragraph':
      editor.value?.commands.setParagraph()
      break
    case 'heading':
      editor.value?.commands.setHeading(props)
      break
    case 'orderedList':
      editor.value?.commands.toggleOrderedList()
      break
    case 'bulletList':
      editor.value?.commands.toggleBulletList()
      break
    case 'taskList':
      editor.value?.commands.toggleTaskList()
      break
    case 'blockquote':
      editor.value?.commands.toggleBlockquote()
      break
  }
}

const deleteNode = () => {
  if (editor.value?.isActive('table')) {
    editor.value?.chain().focus().deleteTable().run()
    return
  }
  editor.value?.chain().focus().selectParentNode().deleteSelection().run()
}
</script>

<style lang="less">
.block-menu-hander {
  position: absolute;
  margin-top: -1px;
  .button-content {
    color: var(--umo-text-color-light);
  }
}
.block-menu-dropdown {
  .block-menu-group-name {
    // padding-top: 8px !important;
    // line-height: 1;
    padding-left: 15px !important;
  }
  .umo-dropdown__menu,
  .umo-dropdown__submenu {
    --td-radius-default: 0;
    padding: 8px 0 !important;
    .umo-divider {
      margin: 4px 0 2px;
      opacity: 0.5;
    }
    .umo-dropdown__item {
      padding: 2px 0;
      min-width: 160px !important;
      .menu-button {
        background-color: transparent;
        padding: 0 15px;
        box-sizing: border-box;
        justify-content: flex-start;
        width: 100%;
        &-wrap {
          display: block !important;
        }
        .umo-button__text {
          width: 100%;
        }
      }
      .button-content {
        width: 100%;
        justify-content: flex-start;
        .text {
          color: var(--umo-text-color);
        }
        .icon {
          margin-right: 3px;
          font-size: 16px;
          color: #666;
        }
        .kbd {
          flex: 1;
          text-align: right;
          color: var(--umo-text-color-light);
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10px;
          padding-left: 20px;
        }
        .heading {
          display: flex;
          color: var(--umo-text-color);
          .icon {
            font-size: 12px;
            display: inline-block;
            width: 2em;
          }
        }
      }
      &--disabled {
        .button-content {
          opacity: 0.6;
        }
      }
      &-direction {
        opacity: 0.4;
        font-size: 12px !important;
        margin-right: 8px;
      }
      .dropdown-item-label {
        padding: 1px 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
}
</style>
