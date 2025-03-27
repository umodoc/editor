<template>
  <t-dropdown
    :attach="`${container} .umo-page-container`"
    placement="bottom-right"
    overlay-class-name="umo-block-menu-dropdown"
    trigger="click"
    :destroy-on-close="false"
    :popup-props="popupProps"
  >
    <menus-button
      class="umo-block-menu-button"
      :menu-active="menuActive"
      ico="block-menu"
      hide-text
      style="cursor: grab"
    />
    <t-dropdown-menu>
      <t-dropdown-item class="umo-block-menu-group-name" disabled>
        {{ t('blockMenu.common') }}
      </t-dropdown-item>
      <t-dropdown-item
        v-if="editor?.isActive('paragraph') || editor?.isActive('heading')"
      >
        <menus-button
          ico="node-switch"
          :text="t('blockMenu.toogleNode')"
          :tooltip="false"
        />
        <t-dropdown-menu
          overlay-class-name="umo-block-menu-dropdown"
          placement="right"
        >
          <t-dropdown-item>
            <menus-button
              ico="paragraph"
              :text="t('base.heading.paragraph')"
              :tooltip="false"
              shortcut-text="ctrl+alt+0"
              @menu-click="toggleNodeType('paragraph')"
            />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-button
              ico="heading"
              :text="t('base.heading.text')"
              :tooltip="false"
            />
            <t-dropdown-menu
              overlay-class-name="umo-block-menu-dropdown"
              placement="right"
            >
              <t-dropdown-item
                v-for="item in headings"
                :key="item"
                :disabled="editor?.isActive('heading', { level: item })"
              >
                <menus-button
                  :tooltip="false"
                  :shortcut-text="`ctrl+alt+${item}`"
                  @menu-click="
                    toggleNodeType('heading', { level: item as Level })
                  "
                >
                  <span class="umo-heading">
                    <span class="icon-heading">H{{ item }}</span>
                    {{ t('base.heading.text', { level: item }) }}
                  </span>
                </menus-button>
              </t-dropdown-item>
            </t-dropdown-menu>
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-button
              ico="ordered-list-2"
              :text="t('list.ordered.text')"
              :tooltip="false"
              shortcut-text="Ctrl+Shift+7"
              :menu-active="editor?.isActive('orderedList')"
              @menu-click="toggleNodeType('orderedList')"
            />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-button
              ico="bullet-list-2"
              :text="t('list.bullet.text')"
              :tooltip="false"
              shortcut-text="Ctrl+Shift+8"
              :menu-active="editor?.isActive('bulletList')"
              @menu-click="toggleNodeType('bulletList')"
            />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-button
              ico="task-list-2"
              :text="t('list.task.text')"
              :tooltip="false"
              shortcut-text="Ctrl+Shift+9"
              :menu-active="editor?.isActive('taskList')"
              @menu-click="toggleNodeType('taskList')"
            />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-button
              ico="quote"
              :text="t('base.quote')"
              :tooltip="false"
              shortcut-text="Ctrl+Shift+B"
              :menu-active="editor?.isActive('blockquote')"
              @menu-click="toggleNodeType('blockquote')"
            />
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-button
          ico="node-clear-format"
          :text="t('blockMenu.clearFormat')"
          :tooltip="false"
          @menu-click="clearTextFormatting"
        />
      </t-dropdown-item>
      <t-dropdown-item divider>
        <menus-button
          ico="node-duplicate"
          :text="t('blockMenu.duplicate')"
          :tooltip="false"
          @menu-click="duplicateNode"
        />
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-button
          ico="node-copy"
          :text="t('blockMenu.copy')"
          :tooltip="false"
          @menu-click="copyNodeToClipboard"
        />
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-button
          ico="node-cut"
          :text="t('blockMenu.cut')"
          :tooltip="false"
          @menu-click="cutNodeToClipboard"
        />
      </t-dropdown-item>
      <t-dropdown-item class="umo-delete-node">
        <menus-button
          ico="node-delete-2"
          :text="t('blockMenu.delete')"
          :tooltip="false"
          @menu-click="deleteNode"
        />
      </t-dropdown-item>
    </t-dropdown-menu>
  </t-dropdown>
</template>

<script setup lang="ts">
import type { Level } from '@tiptap/extension-heading'
import type { Node } from '@tiptap/pm/model'

const props = defineProps<{
  node: Node | null
  pos: number | null
}>()
const emits = defineEmits<{
  dropdownVisible: (visible: boolean) => void
}>()

const container = inject('container')
const editor = inject('editor')
const blockMenu = inject('blockMenu')

let menuActive = $ref(false)

const popupProps = {
  onVisibleChange(visible: boolean) {
    editor.value.commands.focus()
    blockMenu.value = visible
    menuActive = visible
    emits('dropdownVisible', visible)
  },
}

const headings = $ref<number[]>([1, 2, 3, 4, 5, 6])

const toggleNodeType = (
  type: string,
  props?: {
    level: Level
  },
) => {
  editor.value?.chain().focus().run()
  switch (type) {
    case 'paragraph':
      editor.value?.commands.setParagraph()
      break
    case 'heading':
      if (props) {
        editor.value?.commands.setHeading(props)
      }
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

const clearTextFormatting = () => {
  editor.value
    ?.chain()
    .setNodeSelection(props.pos)
    .focus()
    .unsetAllMarks()
    .run()
}
const copyNodeToClipboard = () => {
  editor.value?.commands.setNodeSelection(props.pos)
  document.execCommand('copy')
}
const cutNodeToClipboard = () => {
  editor.value?.commands.setNodeSelection(props.pos)
  document.execCommand('cut')
}
const duplicateNode = () => {
  editor.value?.commands.insertContentAt(props.pos, props.node?.toJSON())
}
const deleteNode = () => {
  editor.value
    ?.chain()
    .setNodeSelection(props.pos)
    .focus()
    .deleteSelectionNode()
    .run()
}
</script>

<style lang="less" scoped></style>
