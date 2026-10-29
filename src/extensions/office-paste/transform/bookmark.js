import { parseStyleAttribute, unwrapNode } from '../utils'

export const transformRemoveBookmarks = (doc) => {
  const bookmarks = doc.querySelectorAll(`[style*="mso-bookmark:"]`)
  if (!bookmarks.length) {
    return
  }
  const bookmarkLinks = new Map(
    Array.from(doc.querySelectorAll(`a[name]`)).map((link) => [
      link.getAttribute(`name`),
      link,
    ]),
  )
  bookmarks.forEach((node) => {
    const bookmark = parseStyleAttribute(node)[`mso-bookmark`]
    const bookmarkLink = bookmarkLinks.get(bookmark)
    if (bookmarkLink) {
      unwrapNode(bookmarkLink)
      bookmarkLinks.delete(bookmark)
    }
    unwrapNode(node)
  })
}
