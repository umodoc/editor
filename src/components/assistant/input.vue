<template>
  <div class="umo-assistant-container">
    <div class="umo-assistant-input">
      <div class="ai-icon">
        <icon name="assistant" />
      </div>
      <t-textarea
        ref="inputRef"
        class="input"
        v-model="command"
        :maxlength="options.assistant.maxlength"
        :readonly="generating"
        autocomplete="false"
        :placeholder="t('assistant.placeholder')"
        autosize
      />
      <div v-if="command !== ''" class="submit">
        <t-button
          theme="primary"
          :disabled="generating"
          :loading="generating"
          @click="send"
        >
          <span v-if="!generating" v-text="t('assistant.send')"></span>
        </t-button>
      </div>
    </div>
    <div class="umo-assistant-result">
      <div class="close">
        <tooltip :content="t('assistant.exit')">
          <t-button
            v-if="!generating"
            size="small"
            variant="text"
            shape="square"
            theme="default"
            @click="exitAssistant"
          >
            <icon name="exit" size="14" />
          </t-button>
        </tooltip>
      </div>
      <div class="commands-container">
        <div class="title" v-text="t('assistant.commands')"></div>
        <div class="commands">
          <t-button
            v-for="(item, index) in options.assistant.commands"
            :key="index"
            size="small"
            variant="outline"
            theme="default"
            v-text="l(item.label)"
            @click="insertCommand(item)"
          ></t-button>
        </div>
      </div>
      <div class="result-container" v-if="result.content !== ''">
        <div class="title" v-text="t('assistant.result')"></div>
        <div
          class="result umo-editor-container"
          :class="{ error: result.error }"
          v-html="result.content"
        ></div>
        <div class="actions">
          <div v-if="!result.error" class="main">
            <t-button theme="primary" @click="replaceContent">
              <icon name="check" />
              {{ t('assistant.replace') }}
            </t-button>
            <t-button
              variant="outline"
              theme="default"
              @click="insertContentAtAfter"
            >
              <icon name="table-add-column-before" />
              {{ t('assistant.insertAfter') }}
            </t-button>
            <t-button
              variant="outline"
              theme="default"
              @click="insertContentAtBelow"
            >
              <icon name="table-add-row-after" />
              {{ t('assistant.insertBelow') }}
            </t-button>
          </div>
          <div class="secondary">
            <tooltip v-if="!result.error" :content="t('assistant.copy')">
              <t-button
                variant="text"
                shape="square"
                theme="default"
                @click="copyResult"
              >
                <icon name="copy" /> </t-button
            ></tooltip>
            <tooltip :content="t('assistant.rewrite')">
              <t-button
                variant="text"
                shape="square"
                theme="default"
                @click="rewrite"
              >
                <icon name="reload" />
              </t-button>
            </tooltip>
            <tooltip :content="t('assistant.delete')">
              <t-button
                variant="text"
                shape="square"
                theme="default"
                @click="deleteResult"
              >
                <icon name="node-delete" />
              </t-button>
            </tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import i18n from '@/i18n'

const { options, editor, assistant } = useStore()

const inputRef = $ref(null)
let command = $ref('')
let result = $ref({
  prompt: '',
  content: '',
  error: false,
})
let generating = $ref(false)

const send = async () => {
  generating = true
  result.error = false
  result.prompt = ''
  result.content = ''

  const payload = {
    lang: i18n.global.locale.value,
    input: editor.value.commands.getSelectionText(),
    command,
    output: 'rich-text',
  }
  const content = {
    html: editor.value.getHTML(),
    text: editor.value.getText(),
    json: editor.value.getJSON(),
  }

  // 获取 onAssistant 返回的数据
  try {
    const data = await options.value.onAssistant(payload, content)
    // 错误处理
    const errorHandler = () => {
      if (result.content.startsWith('[ERROR]: ')) {
        result.error = true
        result.content = result.content.replace('[ERROR]: ', '')
      }
    }
    // 如果是可读流
    if (data instanceof ReadableStream) {
      // 创建可写流
      const stream = new WritableStream({
        write(chunk) {
          errorHandler()
          result.content += chunk
        },
        close() {
          generating = false
          result.command = command
        },
      })
      // 将可读流写入可写流
      data.pipeTo(stream)
      return
    }
    // 如果是纯文本
    if (typeof data === 'string') {
      generating = false
      result.command = command
      errorHandler()
      result.content = data
      return
    }
    console.error(
      'onAssistant method returns data in an incorrect format, it can be a ReadableStream or plain text.',
    )
  } catch (err) {
    console.error(err)
    const dialog = useAlert({
      theme: 'warning',
      header: t('assistant.error.title'),
      body: t('assistant.error.message'),
      onConfirm() {
        dialog.destroy()
      },
    })
    assistant.value = false
  }
}

const insertCommand = ({ value, autoSend }) => {
  command = l(value)
  result.command = l(value)
  result.content = ''
  inputRef.focus()
  if (autoSend !== false) {
    send()
  }
}

const exitAssistant = () => {
  assistant.value = false
  editor.value.commands.focus()
}

const replaceContent = () => {
  editor.value.chain().insertContent(result.content).run()
  exitAssistant()
}

const insertContentAtAfter = () => {
  const { to } = editor.value.state.selection
  editor.value.chain().insertContentAt(to, result.content).focus().run()
  exitAssistant()
}

const insertContentAtBelow = () => {
  editor.value.commands.selectParentNode()
  const { to } = editor.value.state.selection
  editor.value.chain().insertContentAt(to, result.content).focus().run()
  exitAssistant()
}

const copyResult = () => {
  const { copy } = useClipboard({
    source: ref(result.content),
  })
  copy()
  useMessage('success', t('assistant.copySuccess'))
}

const rewrite = () => {
  command = result.command
  send()
}

const deleteResult = () => {
  command = ''
  result.prompt = ''
  result.content = ''
}
</script>

<style lang="less" scoped>
.umo-assistant-input {
  width: 480px;
  position: relative;
  .ai-icon {
    position: absolute;
    border-radius: var(--umo-radius);
    z-index: 10;
    font-size: 20px;
    margin: 12px;
    pointer-events: none;
    width: 20px;
    height: 20px;
    overflow: hidden;
    &::after {
      content: '';
      display: block;
      width: 4px;
      background-color: var(--umo-color-white);
      opacity: 0.25;
      height: 30px;
      transform: rotate(35deg);
      position: absolute;
      top: -5px;
      left: -5px;
      z-index: 10;
      animation: start 1s ease-in;
    }
  }
  .input {
    outline: none !important;
    box-shadow: var(--umo-shadow);
    background-color: var(--umo-color-white);
    :deep(textarea) {
      border-color: var(--umo-primary-color);
      padding: 10px 60px 10px 40px;
      min-height: 44px;
      height: 44px;
      resize: none;
      outline: none !important;
    }
    :deep(.umo-textarea__info_wrapper) {
      display: none;
    }
  }
  .submit {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 10;
    margin: 9px 10px;
    :deep(.umo-button) {
      height: 26px;
      width: 42px;
      font-size: 12px;
    }
  }
}

.umo-assistant-result {
  margin-top: 10px;
  padding: 15px;
  box-shadow: var(--umo-shadow);
  border: solid 1px var(--umo-primary-color);
  border-radius: var(--umo-radius);
  position: relative;
  background-color: var(--umo-color-white);
  width: 480px;
  box-sizing: border-box;
  .close {
    position: absolute;
    top: 12px;
    right: 12px;
    opacity: 0.6;
  }
  .commands {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .title {
    font-size: 12px;
    color: var(--umo-text-color-light);
    margin-bottom: 10px;
  }
  .result {
    font-size: 12px;
    margin-bottom: 18px;
    width: 450px;
    text-align: justify;
    * + * {
      margin-top: 6px;
    }
    &.error {
      color: var(--umo-error-color);
    }
  }
  .actions {
    display: flex;
    justify-content: space-between;
    .main {
      display: flex;
      gap: 8px;
    }
    .secondary {
      display: flex;
      gap: 8px;
      :deep(.umo-button__text) {
        font-size: 16px;
        opacity: 0.6;
        .umo-icon {
          margin-right: 0 !important;
        }
      }
    }
    :deep(.umo-button) {
      height: 28px;
      font-size: 12px;
      padding-left: 10px;
      padding-right: 10px;
      &.umo-button--shape-square {
        width: 28px;
      }
      .umo-button__text {
        display: flex;
        align-items: center;
        .umo-icon {
          font-size: 14px;
          margin-right: 3px;
        }
      }
    }
  }
  .result-container {
    margin-top: 18px;
  }
}
@keyframes start {
  0% {
    left: -5px;
  }
  100% {
    left: 25px;
  }
}
</style>
