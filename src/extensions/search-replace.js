import { Extension } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

const getRegex = (s, disableRegex, caseSensitive) => {
  return RegExp(
    disableRegex ? s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : s,
    caseSensitive ? 'gu' : 'gui',
  )
}

const processSearches = (doc, searchTerm, searchResultClass, resultIndex) => {
  const decorations = []
  const results = []

  let textNodesWithPosition = []
  let index = 0

  if (!searchTerm) {
    return {
      decorationsToReturn: DecorationSet.empty,
      results: [],
      resultIndex: 0,
    }
  }

  doc?.descendants((node, pos) => {
    if (node.isText) {
      if (textNodesWithPosition[index]) {
        textNodesWithPosition[index] = {
          text: textNodesWithPosition[index].text + node.text,
          pos: textNodesWithPosition[index].pos,
        }
      } else {
        textNodesWithPosition[index] = {
          text: `${node.text}`,
          pos,
        }
      }
    } else {
      index += 1
    }
  })

  textNodesWithPosition = textNodesWithPosition.filter(Boolean)

  for (const element of textNodesWithPosition) {
    const { text, pos } = element
    const matches = Array.from(text.matchAll(searchTerm)).filter(
      ([matchText]) => matchText.trim(),
    )

    for (const m of matches) {
      if (m[0] === '') break

      if (m.index !== undefined) {
        results.push({
          from: pos + m.index,
          to: pos + m.index + m[0].length,
        })
      }
    }
  }

  const activeIndex = Math.min(resultIndex, Math.max(0, results.length - 1))
  for (let i = 0; i < results.length; i += 1) {
    const r = results[i]
    const className =
      i === activeIndex
        ? `${searchResultClass} ${searchResultClass}-current`
        : searchResultClass
    const decoration = Decoration.inline(r.from, r.to, {
      class: className,
    })

    decorations.push(decoration)
  }

  return {
    decorationsToReturn: DecorationSet.create(doc, decorations),
    results,
    resultIndex: activeIndex,
  }
}

export const SearchAndReplace = Extension.create({
  name: 'searchAndReplace',
  addOptions() {
    return {
      searchResultClass: 'umo-search-result',
      disableRegex: true,
    }
  },
  addStorage() {
    return {
      searchTerm: '',
      replaceTerm: '',
      results: [],
      lastSearchTerm: '',
      caseSensitive: false,
      lastCaseSensitive: false,
      resultIndex: 0,
      lastResultIndex: 0,
    }
  },
  addCommands() {
    return {
      setSearchTerm:
        (searchTerm) =>
        ({ editor }) => {
          editor.storage.searchAndReplace.searchTerm = searchTerm

          return false
        },
      setReplaceTerm:
        (replaceTerm) =>
        ({ editor }) => {
          editor.storage.searchAndReplace.replaceTerm = replaceTerm

          return false
        },
      setCaseSensitive:
        (caseSensitive) =>
        ({ editor }) => {
          editor.storage.searchAndReplace.caseSensitive = caseSensitive

          return false
        },
      resetIndex:
        () =>
        ({ editor }) => {
          editor.storage.searchAndReplace.resultIndex = 0

          return false
        },
      nextSearchResult:
        () =>
        ({ editor }) => {
          const { results, resultIndex } = editor.storage.searchAndReplace

          const nextIndex = resultIndex + 1

          if (results[nextIndex]) {
            editor.storage.searchAndReplace.resultIndex = nextIndex
          } else {
            editor.storage.searchAndReplace.resultIndex = 0
          }

          return false
        },
      previousSearchResult:
        () =>
        ({ editor }) => {
          const { results, resultIndex } = editor.storage.searchAndReplace

          editor.storage.searchAndReplace.resultIndex =
            resultIndex > 0 ? resultIndex - 1 : Math.max(0, results.length - 1)

          return false
        },
      replace:
        () =>
        ({ editor, tr, dispatch }) => {
          const { replaceTerm, results, resultIndex } =
            editor.storage.searchAndReplace
          const result = results[resultIndex]
          if (!result) return false
          if (dispatch) tr.insertText(replaceTerm, result.from, result.to)
          return true
        },
      replaceAll:
        () =>
        ({ editor, tr, dispatch }) => {
          const { replaceTerm, results } = editor.storage.searchAndReplace

          if (!results.length) return false
          if (dispatch) {
            for (let i = results.length - 1; i >= 0; i -= 1) {
              const { from, to } = results[i]
              tr.insertText(replaceTerm, from, to)
            }
          }
          return true
        },
    }
  },

  addProseMirrorPlugins() {
    const { editor } = this
    const { searchResultClass, disableRegex } = this.options

    const setLastSearchTerm = (t) =>
      (editor.storage.searchAndReplace.lastSearchTerm = t)
    const setLastCaseSensitive = (t) =>
      (editor.storage.searchAndReplace.lastCaseSensitive = t)
    const setLastResultIndex = (t) =>
      (editor.storage.searchAndReplace.lastResultIndex = t)

    return [
      new Plugin({
        key: 'search-replace',
        state: {
          init: () => DecorationSet.empty,
          apply({ doc, docChanged }, oldState) {
            const {
              searchTerm,
              lastSearchTerm,
              caseSensitive,
              lastCaseSensitive,
              resultIndex,
              lastResultIndex,
            } = editor.storage.searchAndReplace

            if (
              !docChanged &&
              lastSearchTerm === searchTerm &&
              lastCaseSensitive === caseSensitive &&
              lastResultIndex === resultIndex
            )
              return oldState

            setLastSearchTerm(searchTerm)
            setLastCaseSensitive(caseSensitive)
            if (!searchTerm) {
              editor.storage.searchAndReplace.results = []
              editor.storage.searchAndReplace.resultIndex = 0
              setLastResultIndex(0)
              return DecorationSet.empty
            }

            const {
              decorationsToReturn,
              results,
              resultIndex: activeIndex,
            } = processSearches(
              doc,
              getRegex(searchTerm, disableRegex, caseSensitive),
              searchResultClass,
              resultIndex,
            )

            editor.storage.searchAndReplace.results = results
            editor.storage.searchAndReplace.resultIndex = activeIndex
            setLastResultIndex(activeIndex)

            return decorationsToReturn
          },
        },
        props: {
          decorations(state) {
            return this.getState(state)
          },
        },
      }),
    ]
  },
})

export default SearchAndReplace
