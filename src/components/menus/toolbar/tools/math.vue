<template>
  <menus-button
    ico="math"
    :text="t('tools.math.text')"
    huge
    @menu-click="openDialog"
  >
    <modal
      :visible="dialogVisible"
      icon="math"
      width="734px"
      :confirm-btn="{
        disabled: latexValue === '',
      }"
      destroy-on-close
      @cancel="closeDialog"
      @close="closeDialog"
    >
      <template #header>
        <icon name="math" />
        {{ editingType ? t('tools.math.edit') : t('tools.math.insert') }}
      </template>
      <div class="umo-math-container">
        <div class="umo-math-input">
          <t-textarea
            v-model.trim="latexValue"
            :autosize="{ minRows: 3, maxRows: 6 }"
            :placeholder="t('tools.math.placeholder')"
          />
          <div class="umo-math-input-preview umo-scrollbar">
            <div
              v-if="latexValue !== ''"
              class="umo-math-input-render"
              v-html="preview"
            ></div>
            <div v-else class="umo-math-input-preview-empty">
              {{ t('tools.math.preview') }}
            </div>
          </div>
        </div>
        <div class="umo-math-select">
          <div
            v-for="{ latex, html } in templatePreviews"
            :key="latex"
            class="umo-math-select-item"
            @click="selectMath(latex)"
            v-html="html"
          ></div>
        </div>
      </div>
      <template #footer>
        <div class="umo-math-footer">
          <t-button theme="default" variant="base" @click="closeDialog">
            {{ t('tools.math.cancel') }}
          </t-button>
          <t-dropdown
            v-if="!editingType"
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
import katex from 'katex'

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
let editingType = $ref(null)
let latexValue = $ref('')
let position = null

const renderMath = (latex) =>
  katex.renderToString(latex, { throwOnError: false, output: 'mathml' })
const preview = computed(() => renderMath(latexValue))
const templatePreviews = computed(() =>
  templates.map((latex) => ({ latex, html: renderMath(latex) })),
)

const mapPosition = ({ transaction }) => {
  if (position !== null && transaction.docChanged) {
    const mapped = transaction.mapping.mapResult(position)
    position = editingType && mapped.deleted ? null : mapped.pos
  }
}

const openDialog = () => {
  if (!editor.value) {
    return
  }
  position = editor.value.state.selection.from
  editingType = props.type
  latexValue = props.latex
  editor.value.on('transaction', mapPosition)
  dialogVisible = true
}

const closeDialog = () => {
  editor.value?.off('transaction', mapPosition)
  dialogVisible = false
  position = null
}

onBeforeUnmount(closeDialog)

const selectMath = (value) => {
  latexValue = latexValue === '' ? value : `${latexValue} ${value}`
}

const applyMath = (command, focusPosition) => {
  if (position !== null && latexValue !== '') {
    editor.value
      ?.chain()
      .focus(focusPosition)
      [command]({ latex: latexValue, pos: position })
      .run()
  }
  closeDialog()
}

const insertMath = ({ value }) =>
  applyMath(
    value === 'inline' ? 'insertInlineMath' : 'insertBlockMath',
    position,
  )

const updateMath = () => {
  applyMath(editingType === 'inline' ? 'updateInlineMath' : 'updateBlockMath')
}
</script>

<style lang="less" scoped>
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
