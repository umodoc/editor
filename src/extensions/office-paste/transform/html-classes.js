export const transformMsoHtmlClasses = (doc) => {
  doc.querySelectorAll(`p[class*="MsoNormal"]`).forEach((node) => {
    node.classList.remove(`MsoNormal`)
  })
}
