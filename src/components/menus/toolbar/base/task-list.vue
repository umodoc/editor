<template>
  <menus-button
    ico="task-list"
    :text="t('list.task.text')"
    shortcut="Ctrl+Shift+9"
    menu-type="dropdown"
    popup-handle="arrow"
    hide-text
    :menu-active="editor?.isActive('taskList')"
    @menu-click="editor?.chain().focus().toggleTaskList().run()"
  >
    <template #dropmenu>
      <t-dropdown-menu>
        <t-dropdown-item
          :disabled="!editor?.can().splitListItem('taskItem')"
          @click="editor?.chain().focus().splitListItem('taskItem').run()"
        >
          {{ t('list.task.split') }}
        </t-dropdown-item>
        <t-dropdown-item
          :disabled="!editor?.can().sinkListItem('taskItem')"
          @click="editor?.chain().focus().sinkListItem('taskItem').run()"
        >
          {{ t('list.task.sink') }}
        </t-dropdown-item>
        <t-dropdown-item
          :disabled="!editor?.can().liftListItem('taskItem')"
          @click="editor?.chain().focus().liftListItem('taskItem').run()"
        >
          {{ t('list.task.lift') }}
        </t-dropdown-item>
      </t-dropdown-menu>
    </template>
  </menus-button>
</template>

<script setup lang="ts">
const editor = inject('editor')
</script>
