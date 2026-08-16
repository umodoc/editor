export const contentTransform = (content) => {
  // 处理空内容或非字符串内容
  if (
    content &&
    typeof content === 'string' &&
    !content.trimStart().startsWith('<')
  ) {
    // 处理纯文本中的换行符
    return content
      .split('\n')
      .map((line) => `<p>${line}</p>`)
      .join('')
  }

  return content
}
