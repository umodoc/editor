<template>
  <modal
    :visible="visible"
    icon="about"
    :header="t('about.title')"
    width="300px"
    :footer="false"
    @close="emits('close')"
  >
    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 2;
        padding: 30px 0 0;
      "
    >
      <a href="https://www.umodoc.com" target="_blank">
        <img src="@/assets/images/logo.svg" width="160" style="display: flex" />
      </a>
      <p>
        {{ t('about.version') }}: v{{ version }} ({{ t('about.openSource') }})
      </p>
      <p v-html="t('about.poweredBy')"></p>
      <p>
        <a href="https://github.com/umodoc/editor" target="_blank"> Github </a>
        |
        <a
          :href="`https://docs.umodoc.com/${locale === 'zh-CN' ? 'cn' : 'en'}/docs`"
          target="_blank"
        >
          {{ t('about.documentation') }}
        </a>
        |
        <a href="https://www.npmjs.com/package/@umoteam/editor" target="_blank">
          NPM
        </a>
      </p>
      <t-divider>{{ t('about.thanks') }}</t-divider>
      <p style="text-align: center; font-size: 12px; padding: 0 10px">
        <a href="https://github.com/Cassielxd" target="_blank">Cassielxd</a>
        ·
        <a href="https://github.com/china-wangxu" target="_blank"
          >china-wangxu</a
        >
        ·
        <a href="https://github.com/Goldziher" target="_blank"
          >Na'aman Hirschfeld</a
        >
        ·
        <a href="https://github.com/SevenDreamYang" target="_blank"
          >SevenDreamYang</a
        >
        ·
        <a href="https://github.com/ChenErik" target="_blank">ChenErik</a>
        ·
        <a href="https://github.com/SerRashin" target="_blank">SerRashin</a>
        ·
        <a href="https://github.com/SunnyWisozk" target="_blank"
          >Sunny Wisozk</a
        >
        ·
        <a href="https://github.com/xuzhenjun130k" target="_blank"
          >Sherman Xu</a
        >
        ·
        <a href="https://github.com/vace" target="_blank">vace</a>
        ·
        <a href="https://github.com/Mikasa33" target="_blank">Mikasa33</a>
      </p>
    </div>
  </modal>
</template>

<script setup>
import { version } from '@/utils/copyright'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['close'])

const { locale } = useI18n()
</script>

<style lang="less" scoped>
img {
  margin-bottom: 30px;
}
p {
  margin: 3px 0 !important;
  line-height: 1.5;
  a,
  :deep(a) {
    color: var(--umo-primary-color);
    font-weight: 500;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
:deep(.umo-divider) {
  margin: 30px 0 15px;
  font-size: 12px;
}
</style>
