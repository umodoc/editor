export const contentTransform = (content) => {
  if (content && typeof content === 'string' && !content.startsWith('<')) {
    return content
      .split('\n')
      .map((line) => `<p>${line}</p>`)
      .join('')
  }

  return content
}
