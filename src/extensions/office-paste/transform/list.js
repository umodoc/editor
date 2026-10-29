import {
  parseLetterNumber,
  parseRomanNumber,
  parseStyleAttribute,
} from '../utils'

export const transformLists = (doc) => {
  let listStack = []
  let currentListId
  const listElements = doc.querySelectorAll(`p[style*="mso-list:"]`)
  listElements.forEach((node) => {
    const el = node
    const [msoListId, msoListLevel] = parseMsoListAttribute(
      parseStyleAttribute(el)[`mso-list`],
    )

    // Check for start of a new list
    if (
      currentListId !== msoListId &&
      (hasNonListItemSibling(el) || msoListLevel === 1)
    ) {
      currentListId = msoListId
      listStack = []
    }

    while (msoListLevel > listStack.length) {
      const newList = createListElement(el)

      if (listStack.length > 0) {
        listStack[listStack.length - 1].appendChild(newList)
      } else {
        el.before(newList)
      }
      listStack.push(newList)
    }

    while (msoListLevel < listStack.length) {
      listStack.pop()
    }

    // Remove list item numbers and create li
    listStack[listStack.length - 1].appendChild(getListItemFromParagraph(el))
    el.remove()
  })
}

const hasNonListItemSibling = (el) => {
  return (
    !el.previousElementSibling ||
    !(
      el.previousElementSibling.nodeName === `OL` ||
      el.previousElementSibling.nodeName === `UL`
    )
  )
}

const getListItemFromParagraph = (el) => {
  const li = el.ownerDocument.createElement(`li`)
  li.innerHTML = el.innerHTML.replace(listTypeRegex, ``)

  return li
}

// Parses `mso-list` style attribute
const parseMsoListAttribute = (attr) => {
  const msoListValue = attr
  const msoListInfos = msoListValue.split(` `)
  const msoListId = msoListInfos.find((e) => /l[0-9]+/.test(e)) || ``
  const msoListLevel = +(
    msoListInfos.find((e) => e.startsWith(`level`))?.substring(5) || 1
  )

  return [msoListId, msoListLevel]
}
// 必须非贪婪匹配：同段内图片的条件注释也以 endif 结尾，贪婪匹配会把图片和文字一起删除
// eslint-disable-next-line
const listTypeRegex = /<!--\[if \!supportLists\]-->[\s\S]*?<!--\[endif\]-->/
const getListPrefix = (el) => {
  const matches = el.innerHTML.match(listTypeRegex)
  if (matches?.length) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(matches[0], `text/html`)
    return doc.body.querySelector(`span`)?.textContent || ``
  }

  return ``
}

const createListElement = (el) => {
  const listInfo = getListInfo(getListPrefix(el))
  const list = el.ownerDocument.createElement(listInfo.type)
  if (listInfo.countType) {
    list.setAttribute(`type`, listInfo.countType)
  }
  if (listInfo.start > 1) {
    list.setAttribute(`start`, listInfo.start.toString())
  }
  return list
}

const listOrderRegex = {
  number: /[0-9]+\./,
  romanLower: /(?=[mdclxvi])m*(c[md]|d?c*)(x[cl]|l?x*)(i[xv]|v?i*)\./,
  romanUpper: /(?=[MDCLXVI])M*(C[MD]|D?C*)(X[CL]|L?X*)(I[XV]|V?I*)\./,
  letterLower: /[a-z]+\./,
  letterUpper: /[A-Z]+\./,
}

const getListInfo = (prefix) => {
  let type = `ul`
  let countType = null
  let start = 1
  let matches
  if ((matches = prefix.match(listOrderRegex.number))) {
    type = `ol`
    start = +matches[0].replace(`.`, ``)
  } else if ((matches = prefix.match(listOrderRegex.romanLower))) {
    type = `ol`
    countType = `i`
    start = +parseRomanNumber(matches[0].replace(`.`, ``))
  } else if ((matches = prefix.match(listOrderRegex.romanUpper))) {
    type = `ol`
    countType = `I`
    start = +parseRomanNumber(matches[0].replace(`.`, ``))
  } else if ((matches = prefix.match(listOrderRegex.letterLower))) {
    type = `ol`
    countType = `a`
    start = +parseLetterNumber(matches[0].replace(`.`, ``))
  } else if ((matches = prefix.match(listOrderRegex.letterUpper))) {
    type = `ol`
    countType = `A`
    start = +parseLetterNumber(matches[0].replace(`.`, ``))
  }

  return {
    type,
    start,
    countType,
  }
}
