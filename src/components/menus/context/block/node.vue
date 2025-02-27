<template>
  <t-dropdown
    :attach="`${container} .umo-page-container`"
    placement="bottom-right"
    overlay-class-name="umo-block-menu-dropdown"
    :max-height="320"
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
          @menu-click="openAssistant"
        />
      </t-dropdown-item>
      <t-dropdown-item class="umo-block-menu-group-name" disabled>
        {{ t('blockMenu.insert') }}
      </t-dropdown-item>
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
        <menus-toolbar-insert-callout
          v-if="!disableItem('callout')"
          :huge="false"
          :tooltip="false"
        />
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-button
          ico="hr"
          :text="t('insert.hr.text')"
          :tooltip="false"
          @menu-click="editor?.chain().focus().setHr({ type: 'signle' }).run()"
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
        <menus-toolbar-tools-echarts
          v-if="!disableItem('echarts')"
          :huge="false"
          :tooltip="false"
          mode="add"
        />
      </t-dropdown-item>
      <t-dropdown-item>
        <menus-toolbar-tools-mermaid
          v-if="!disableItem('mermaid')"
          :huge="false"
          :tooltip="false"
        />
      </t-dropdown-item>
      <t-dropdown-item v-if="options.templates.length > 0">
        <menus-button
          ico="template"
          :text="t('blockMenu.template')"
          :tooltip="false"
        />
        <t-dropdown-menu
          overlay-class-name="umo-block-menu-dropdown"
          placement="right"
        >
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
    </t-dropdown-menu>
  </t-dropdown>
</template>

<script setup lang="ts">
import type { Template } from '@/types'

const emits = defineEmits<{
  dropdownVisible: (visible: boolean) => void
}>()

const container = inject('container')
const editor = inject('editor')
const blockMenu = inject('blockMenu')
const assistant = inject('assistant')
const options = inject('options')

let menuActive = $ref(false)
const popupProps = {
  onVisibleChange(visible: boolean) {
    editor.value.commands.focus()
    blockMenu.value = visible
    menuActive = visible
    emits('dropdownVisible', visible)
  },
}

const disableItem = (name: string) => {
  return options.value.toolbar?.disableMenuItems.includes(name)
}

const openAssistant = () => {
  assistant.value = true
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
</script>

<style lang="less"></style>
