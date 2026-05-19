<template>
  <menus-button
    ico="math"
    :text="t('tools.math.text')"
    huge
    @menu-click="dialogVisible = true"
  >
    <modal
      :visible="dialogVisible"
      icon="math"
      width="734px"
      :confirm-btn="{
        disabled: latexValue === '',
      }"
      destroy-on-close
      @cancel="dialogVisible = false"
      @close="dialogVisible = false"
    >
      <template #header>
        <icon name="math" />
        {{ props.latex === '' ? t('tools.math.insert') : t('tools.math.edit') }}
      </template>
      <div ref="containerRef" class="umo-math-container">
        <div class="umo-math-input">
          <t-textarea
            v-model.trim="latexValue"
            :autosize="{ minRows: 3, maxRows: 6 }"
            :placeholder="t('tools.math.placeholder')"
            @change="previewMath"
          />
          <div class="umo-math-input-preview umo-scrollbar">
            <div v-if="latexValue !== ''" class="umo-math-input-render"></div>
            <div v-else class="umo-math-input-preview-empty">
              {{ t('tools.math.preview') }}
            </div>
          </div>
        </div>
        <div class="umo-math-select">
          <div
            v-for="(item, index) in templates"
            v-show="latexLoaded"
            :key="index"
            class="umo-math-select-item"
            @click="selectMath(item)"
          >
            {{ item }}
          </div>
          <div v-if="!latexLoaded" class="umo-math-select-loading">
            {{ t('tools.math.template') }}
          </div>
        </div>
      </div>
      <template #footer>
        <div class="umo-math-footer">
          <t-button
            theme="default"
            variant="base"
            @click="dialogVisible = false"
          >
            {{ t('tools.math.cancel') }}
          </t-button>
          <t-dropdown
            v-if="props.latex === ''"
            trigger="click"
            :options="[
              { content: t('tools.math.inline'), value: 'inline' },
              { content: t('tools.math.block'), value: 'block' },
            ]"
            @click="insertMath"
          >
            <t-button :disabled="latexValue === ''">
              {{ t('tools.math.confirm') }}
            </t-button>
          </t-dropdown>
          <t-button v-else :disabled="latexValue === ''" @click="updateMath">
            {{ t('tools.math.update') }}
          </t-button>
        </div>
      </template>
    </modal>
  </menus-button>
</template>

<script setup>
import { loadResource } from '@/utils/load-resource'

const props = defineProps({
  type: {
    type: String,
    default: null,
  },
  latex: {
    type: String,
    default: '',
  },
})

const editor = inject('editor')
const options = inject('options')

const templates = [
  '\\times',
  '\\div',
  '\\pm',
  '\\mp',
  '\\cdot',
  '\\star',
  '\\neq',
  '\\leq',
  '\\sim',
  '\\approx',
  '\\cong',
  '\\equiv',
  '\\propto',
  '\\ll',
  '\\gg',
  '\\in',
  '\\subset',
  '\\subseteq',
  '\\prec',
  '\\preceq',
  '\\simeq',
  '\\asymp',
  '\\doteq',
  '\\succ',
  '\\succeq',
  '\\sqsubseteq',
  '\\sqsupseteq',
  '\\ni',
  '\\models',
  '\\vdash',
  '\\dashv',
  '\\perp',
  '\\mid',
  '\\parallel',
  '\\smile',
  '\\frown',
  '\\bowtie',
  '\\unlhd',
  '\\unrhd',
  '\\sqrt{ab}',
  '\\sqrt[n]{ab}',
  '\\widetilde{ab}',
  '\\widehat{ab}',
  'a^{b}',
  'c_a^b ',
  '\\overleftarrow{ab}',
  '\\overrightarrow{ab}',
  '\\overbrace{ab}',
  '\\underbrace{ab}',
  '\\overline{ab}',
  '\\underline{ab}',
  'a_{b}',
  '\\log_{a}{b}',
  '\\lg{ab}',
  '\\left(\\begin{array}{c}a\\\\ b\\end{array}\\right)',
  '\\begin{bmatrix}a & b \\\\c & d \\end{bmatrix}',
  '\\begin{cases}a & x = 0\\\\b & x > 0\\end{cases}',
  '\\sin',
  '\\cot',
  '\\cos',
  '\\csc',
  '\\sec',
  '\\tan',
  '\\cosh',
  '\\coth',
  '\\sinh',
  '\\tanh',
  '\\arcsin',
  '\\arctan',
  '\\arccos',
  '\\log',
  '\\ln',
  '\\inf',
  '\\lim',
  '\\det',
  '\\ker',
  '\\bmod',
  '\\hom',
  '\\gcd',
  '\\min',
  '\\max',
  '\\exp',
  '\\sup',
]

let dialogVisible = $ref(false)
const containerRef = $ref()
let latexLoaded = $ref(false)
let latexValue = $ref('')

const loadKatex = async () => {
  const { cdnUrl } = options.value
  await loadResource(
    `${cdnUrl}/libs/katex/katex.min.js`,
    'script',
    'katex-script',
  )
  await loadResource(`${cdnUrl}/libs/katex/katex.min.css`, 'css', 'katex-style')
  setTimeout(() => {
    latexLoaded = true
  }, 100)
}

watch(
  () => dialogVisible,
  async (visible) => {
    if (visible) {
      await loadKatex()
      setTimeout(() => {
        renderMath('templates')
      }, 100)
      if (props.latex !== '') {
        const { latex } = props
        latexValue = latex
        previewMath()
      }
    } else {
      latexValue = ''
    }
  },
)

const renderMath = async (type) => {
  await nextTick()
  const render = (text, el) =>
    katex.render(text, el, {
      throwOnError: false,
      output: 'mathml',
    })
  if (type === 'templates') {
    containerRef.querySelectorAll('.umo-math-select-item').forEach((el) => {
      render(el.textContent, el)
    })
  }
  if (type === 'preview' && latexValue !== '') {
    await nextTick()
    const el = containerRef.querySelector('.umo-math-input-render')
    render(latexValue, el)
  }
}

const selectMath = (value) => {
  latexValue = latexValue === '' ? value : `${latexValue} ${value}`
  previewMath()
}

const previewMath = () => {
  renderMath('preview')
}

const insertMath = ({ value }) => {
  if (value === 'inline') {
    editor.value?.chain().focus().insertInlineMath({ latex: latexValue }).run()
  }
  if (value === 'block') {
    editor.value?.chain().focus().insertBlockMath({ latex: latexValue }).run()
  }
  dialogVisible = false
}

const updateMath = () => {
  if (props.latex !== '') {
    editor.value?.chain().focus().deleteSelectionNode().run()
  }
  insertMath({ value: props.type })
}
</script>

<style lang="scss" scoped>
.umo-math {
  &-container {
    width: 680px;
    display: flex;
    gap: 10px;
    padding: 2px;
  }
  &-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 0 2px;
  }
  &-input {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 350px;
    &-preview {
      flex: 1;
      padding: 10px;
      border: solid 1px var(--td-border-level-2-color);
      border-radius: var(--umo-radius);
      &-empty {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        color: var(--umo-text-color-light);
      }
    }
  }
  &-select {
    flex-shrink: 0;
    width: 330px;
    border: solid 1px var(--td-border-level-2-color);
    border-radius: var(--umo-radius);
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    box-sizing: border-box;
    align-items: center;
    height: 380px;
    color: var(--umo-text-color-light);
    &-item {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: var(--umo-radius);
      padding: 5px;
      min-height: 1em;
      gap: 5px;
      user-select: none;
      &:hover {
        background-color: var(--umo-button-hover-background);
      }
    }
  }
}
</style>
