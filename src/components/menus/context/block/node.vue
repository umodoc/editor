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
      ico="block-add"
      hide-text
    />
    <t-dropdown-menu>
      <t-dropdown-item
        v-if="
          options.assistant?.enabled &&
          (editor?.isActive('paragraph') || editor?.isActive('heading')) &&
          editor?.state?.selection?.$from?.nodeAfter
        "
        divider
      >
        <menus-button
          ico="assistant"
          :text="t('assistant.text')"
          :tooltip="false"
          @menu-click="openAssistantBox"
        />
      </t-dropdown-item>
      <t-dropdown-item class="umo-block-menu-group-name" disabled>
        {{ t('blockMenu.insert') }}
      </t-dropdown-item>
      <t-dropdown-item :divider="options.templates?.length === 0">
        <menus-button
          ico="node-add"
          :text="t('blockMenu.select')"
          :tooltip="false"
        />
        <t-dropdown-menu overlay-class-name="umo-block-menu-dropdown">
          <t-dropdown-item>
            <menus-button
              ico="table"
              :text="t('table.insert.text')"
              :tooltip="false"
              @menu-click="editor?.chain().focus().insertTable().run()"
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
              shortcut-text="Ctrl+Alt+C"
              :tooltip="false"
            />
          </t-dropdown-item>
          <t-dropdown-item>
            <menus-button
              ico="hr"
              :text="t('insert.hr.text')"
              :tooltip="false"
              @menu-click="
                editor?.chain().focus().setHr({ type: 'signle' }).run()
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
              v-if="!disableItem('signature')"
              :huge="false"
              :tooltip="false"
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
      <t-dropdown-item
        v-if="options.templates && options.templates.length > 0"
        :divider="!editor?.isActive('pageBreak')"
      >
        <menus-button
          ico="template"
          :text="t('blockMenu.template')"
          :tooltip="false"
        />
        <t-dropdown-menu overlay-class-name="umo-block-menu-dropdown">
          <t-dropdown-item
            v-for="item in options.templates"
            :key="item.value"
            :value="item.value"
            :divider="item.divider"
            @click="setTemplate(item)"
          >
            <div class="umo-dropdown-item-label">{{ item.title }}</div>
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown-item>
      <template v-if="!editor?.isActive('pageBreak')">
        <t-dropdown-item class="umo-block-menu-group-name" disabled>
          {{ t('blockMenu.toogleNode') }}
        </t-dropdown-item>
        <t-dropdown-item :disabled="editor?.isActive('paragraph')">
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
          <t-dropdown-menu overlay-class-name="umo-block-menu-dropdown">
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
      </template>
    </t-dropdown-menu>
  </t-dropdown>
</template>

<script setup lang="ts">
import type { Level } from '@tiptap/extension-heading'

import type { Template } from '@/types'

const { container, options, editor, blockMenu, assistantBox } = useStore()

let menuActive = $ref(false)
const popupProps = {
  onVisibleChange(visible: boolean) {
    editor.value.commands.focus()
    blockMenu.value = visible
    menuActive = visible
  },
}

const headings = $ref<number[]>([1, 2, 3, 4, 5, 6])

const disableItem = (name: string) => {
  return options.value.toolbar?.disableMenuItems.includes(name)
}

const openAssistantBox = () => {
  assistantBox.value = true
  editor.value?.commands.selectParentNode()
  editor.value?.commands.focus()
  const { from, to } = editor.value?.state.selection ?? {}
  editor.value?.commands.setTextSelection({ from: from ?? 0, to: to ?? 0 })
}

const setTemplate = ({ content }: Template) => {
  if (!content || !editor.value) {
    return
  }
  editor.value.commands.insertContent(content)
}

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
</script>

<style lang="less"></style>
