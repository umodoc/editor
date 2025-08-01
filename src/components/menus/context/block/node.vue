<template>
  <t-dropdown
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
          options.ai?.assistant?.enabled &&
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
      <t-dropdown-item v-if="!disableMenu('image')">
        <menus-toolbar-insert-image :huge="false" :tooltip="false" />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('video')">
        <menus-toolbar-insert-video :huge="false" :tooltip="false" />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('audio')">
        <menus-toolbar-insert-audio :huge="false" :tooltip="false" />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('file')">
        <menus-toolbar-insert-file :huge="false" :tooltip="false" />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('code-block')">
        <menus-toolbar-insert-code-block
          :huge="false"
          shortcut-text="Ctrl+Alt+C"
          :tooltip="false"
        />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('callout')">
        <menus-toolbar-insert-callout :huge="false" :tooltip="false" />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('hr')">
        <menus-button
          ico="hr"
          :text="t('insert.hr.text')"
          :tooltip="false"
          @menu-click="editor?.chain().focus().setHr({ type: 'signle' }).run()"
        />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('toc')">
        <menus-toolbar-insert-toc :huge="false" :tooltip="false" />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('text-box')">
        <menus-toolbar-insert-text-box :huge="false" :tooltip="false" />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('web-page')">
        <menus-toolbar-insert-web-page :huge="false" :tooltip="false" />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('qrcode')">
        <menus-toolbar-tools-qrcode :huge="false" :tooltip="false" />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('barcode')">
        <menus-toolbar-tools-barcode :huge="false" :tooltip="false" />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('signature')">
        <menus-toolbar-tools-signature :huge="false" :tooltip="false" />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('seal')">
        <menus-toolbar-tools-seal :huge="false" :tooltip="false" />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('diagrams')">
        <menus-toolbar-tools-diagrams :huge="false" :tooltip="false" />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('echarts')">
        <menus-toolbar-tools-echarts
          :huge="false"
          :tooltip="false"
          mode="add"
        />
      </t-dropdown-item>
      <t-dropdown-item v-if="!disableMenu('mermaid')">
        <menus-toolbar-tools-mermaid :huge="false" :tooltip="false" />
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

const disableMenu = (name: string) => {
  return options.value.disableExtensions.includes(name)
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
