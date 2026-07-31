export const isOutOfRange = (error) =>
  error instanceof RangeError &&
  /outside of fragment|out of range/i.test(String(error.message || ''))

export const resolvePos = (doc, pos) => {
  if (!doc || typeof pos !== 'number' || pos < 0 || pos > doc.content.size) {
    return null
  }
  try {
    return doc.resolve(pos)
  } catch (error) {
    if (isOutOfRange(error)) {
      return null
    }
    throw error
  }
}

export const safeNodePos = (getPos, state = null) => {
  if (typeof getPos !== 'function') {
    return null
  }
  try {
    const pos = getPos()
    if (typeof pos !== 'number') {
      return null
    }
    if (!state?.doc) {
      return pos
    }
    return resolvePos(state.doc, pos) ? pos : null
  } catch (error) {
    if (isOutOfRange(error)) {
      return null
    }
    throw error
  }
}

export const safeOffsetPos = (getPos, state = null, offset = 0) => {
  const pos = safeNodePos(getPos, state)
  if (typeof pos !== 'number') {
    return null
  }
  const nextPos = pos + offset
  return resolvePos(state?.doc, nextPos) ? nextPos : null
}

export const selectNodePos = (editor, getPos) => {
  const pos = safeNodePos(getPos, editor?.state)
  if (typeof pos !== 'number') {
    return false
  }
  try {
    return editor?.commands?.setNodeSelection(pos) ?? false
  } catch (error) {
    if (isOutOfRange(error)) {
      return false
    }
    throw error
  }
}
