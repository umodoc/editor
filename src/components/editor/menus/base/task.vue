<template>
  <editor-menus-button
    button-type="dropdown"
    popup-handle="arrow"
    :button-active="editor?.isActive('taskList')"
    tooltip="待办事项"
    shortcut="Ctrl+Shift+9"
    @button-click="editor?.chain().focus().toggleTaskList().run()"
  >
    <icon name="task" />
    <template #dropmenu>
      <t-dropdown-menu>
        <t-dropdown-item
          :disabled="!editor?.can().splitListItem('taskItem')"
          @click="editor?.chain().focus().splitListItem('taskItem').run()"
        >
          增加任务
        </t-dropdown-item>
        <t-dropdown-item
          :disabled="!editor?.can().sinkListItem('taskItem')"
          @click="editor?.chain().focus().sinkListItem('taskItem').run()"
        >
          设为子任务
        </t-dropdown-item>
        <t-dropdown-item
          :disabled="!editor?.can().liftListItem('taskItem')"
          @click="editor?.chain().focus().liftListItem('taskItem').run()"
        >
          移除任务
        </t-dropdown-item>
      </t-dropdown-menu>
    </template>
  </editor-menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
