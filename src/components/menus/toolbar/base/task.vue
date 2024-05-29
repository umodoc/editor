<template>
  <menus-button
    ico="task"
    text="待办事项"
    shortcut="Ctrl+Shift+9"
    menu-type="dropdown"
    popup-handle="arrow"
    hide-text
    :menu-active="editor?.isActive('taskList')"
    @button-click="editor?.chain().focus().toggleTaskList().run()"
  >
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
  </menus-button>
</template>

<script setup>
const { editor } = useStore()
</script>
