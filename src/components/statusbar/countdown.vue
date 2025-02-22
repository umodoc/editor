<template>
  <t-popup
    :visible="visible"
    :attach="container"
    :z-index="2000"
    trigger="click"
    placement="top-left"
    :popper-options="popperOptions"
  >
    <slot />
    <template #content>
      <div class="umo-preview-countdown">
        <div class="umo-preview-countdown-title">
          <icon name="time" /> {{ t('preview.countdown.title') }}
        </div>
        <t-form label-align="left" label-width="75px" @submit="startCountdown">
          <t-form-item
            :label="t('preview.countdown.select')"
            name="quickSelect"
          >
            <t-select
              v-model="selectValue"
              :options="options"
              :placeholder="t('preview.countdown.selectTip')"
              :popup-props="{ attach: container, zIndex: 2000 }"
              @change="countdownSelect"
            />
          </t-form-item>
          <t-form-item :label="t('preview.countdown.custom')" name="custom">
            <div class="umo-preview-countdown-input" size="small">
              <t-input-number
                v-model="hours"
                theme="normal"
                align="center"
                decimal-places="0"
                :placeholder="t('preview.countdown.hours')"
                :min="0"
                :max="60"
                :step="1"
                :disabled="selectValue !== null"
              />
              <t-input-number
                v-model="minutes"
                theme="normal"
                align="center"
                decimal-places="0"
                :placeholder="t('preview.countdown.minutes')"
                :min="0"
                :max="60"
                :step="1"
                :disabled="selectValue !== null"
              />
              <t-input-number
                v-model="seconds"
                theme="normal"
                align="center"
                decimal-places="0"
                :placeholder="t('preview.countdown.seconds')"
                :min="0"
                :max="60"
                :step="1"
                :disabled="selectValue !== null"
              />
            </div>
          </t-form-item>
          <t-form-item
            :label="t('preview.countdown.whenEnd')"
            name="endOptions"
          >
            <t-radio-group v-model="whenEnd" default-value="showEndMessage">
              <t-radio value="showEndMessage">
                {{ t('preview.countdown.showEndMessage') }}</t-radio
              >
              <t-radio value="exitPreview">
                {{ t('preview.countdown.exitPreview') }}
              </t-radio>
            </t-radio-group>
            <div></div>
          </t-form-item>
          <t-form-item>
            <t-space size="small">
              <t-button theme="primary" type="submit">
                <icon name="time" /> {{ t('preview.countdown.start') }}
              </t-button>
              <t-button theme="default" variant="base" @click="cancelCountdown">
                {{ t('preview.countdown.cancel') }}
              </t-button>
            </t-space>
          </t-form-item>
        </t-form>
      </div>
    </template>
  </t-popup>
</template>

<script setup lang="ts">
const props = defineProps({
  visible: {
    type: Boolean,
    require: true,
  },
})

const emits = defineEmits(['countdown-change', 'exit-preivew', 'close'])

const container = inject('container')

const popperOptions = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [-10, 10],
      },
    },
  ],
}
const selectValue = $ref(null)
let hours = $ref(null)
let minutes = $ref(null)
let seconds = $ref(null)
const whenEnd = $ref('showEndMessage')

const options = [
  { label: t('preview.countdown.1hour'), value: 60 },
  { label: t('preview.countdown.45minutes'), value: 45 },
  { label: t('preview.countdown.30minutes'), value: 30 },
  { label: t('preview.countdown.15minutes'), value: 15 },
  { label: t('preview.countdown.10minutes'), value: 10 },
  { label: t('preview.countdown.5minutes'), value: 5 },
  { label: t('preview.countdown.custom'), value: null },
]

const countdownSelect = (value: number) => {
  minutes = value
}

let countdownInfo = $ref('')
let messageBox: ReturnType<typeof useMessage> = null
let countdownInterval: ReturnType<typeof setInterval> | null = null
const resetCountdown = () => {
  hours = null
  minutes = null
  seconds = null
  countdownInfo = ''
}
const startCountdown = async () => {
  messageBox?.close()
  if (countdownInterval !== null) {
    clearInterval(countdownInterval)
  }
  const totalSeconds =
    (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0)

  if (totalSeconds <= 0) {
    messageBox = await useMessage('error', {
      attach: container,
      content: t('preview.countdown.error'),
    })
    return
  }

  let remainingTime = totalSeconds

  countdownInterval = setInterval(async () => {
    if (remainingTime <= 0) {
      messageBox?.close()
      resetCountdown()
      if (countdownInterval !== null) {
        clearInterval(countdownInterval)
      }
      if (whenEnd === 'showEndMessage') {
        countdownInfo = ''
        messageBox = await useMessage('error', {
          attach: container,
          content: t('preview.countdown.endCountdown'),
          duration: 5000,
          closeBtn: true,
        })
      }
      if (whenEnd === 'exitPreview') {
        emits('exit-preivew')
      }
      return
    }
    remainingTime--
    countdownInfo = `${t('preview.countdown.remaining')}: ${String(Math.floor(remainingTime / 3600)).padStart(2, '0')}:${String(Math.floor((remainingTime % 3600) / 60)).padStart(2, '0')}:${String(remainingTime % 60).padStart(2, '0')}`
  }, 1000)

  emits('close')
}

const cancelCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
  resetCountdown()
  emits('close')
}

watch(
  () => countdownInfo,
  (value: string) => {
    emits('countdown-change', value)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (countdownInterval !== null) {
    clearInterval(countdownInterval)
  }
  messageBox?.close()
})
</script>

<style lang="less" scoped>
.umo-preview-countdown {
  padding: 25px;
  width: 320px;
  cursor: default;
  &-title {
    font-size: 18px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    :deep(.umo-icon) {
      font-size: 24px;
      margin: -2px 6px 0 0;
    }
  }
  :deep(.umo-form) {
    &__item {
      &:not(:last-child) {
        margin-bottom: 15px;
      }
      .umo-radio-group {
        margin-top: 5px;
      }
      .umo-button__text {
        display: flex;
        align-items: center;
        .umo-icon {
          font-size: 16px;
          margin-right: 5px;
        }
      }
    }
    &__controls {
      margin-top: 10px;
    }
  }
  &-input {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
    :deep(.umo-input-number) {
      width: 78px !important;
    }
  }
}
</style>
