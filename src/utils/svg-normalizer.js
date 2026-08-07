export class SvgBoundsNormalizer {
  parseNumber(value) {
    if (value === undefined || value === null) {
      return 0
    }
    const parsed = Number.parseFloat(String(value).replace(/px$/i, '').trim())
    return Number.isFinite(parsed) ? parsed : 0
  }

  getFallbackSize(svg) {
    if (!(svg instanceof SVGElement)) {
      return { width: 0, height: 0 }
    }
    const width = this.parseNumber(svg.getAttribute('width'))
    const height = this.parseNumber(svg.getAttribute('height'))
    if (width > 0 && height > 0) {
      return { width, height }
    }
    const viewBox = String(svg.getAttribute('viewBox') || '')
      .trim()
      .split(/[\s,]+/)
      .map((item) => Number.parseFloat(item))
    if (viewBox.length === 4 && viewBox.every((item) => Number.isFinite(item))) {
      return {
        width: Math.max(0, viewBox[2]),
        height: Math.max(0, viewBox[3]),
      }
    }
    return { width: 0, height: 0 }
  }

  createSvgElement(input) {
    if (input instanceof SVGElement) {
      return {
        source: input,
        working: input.cloneNode(true),
      }
    }
    if (!input || typeof document === 'undefined') {
      return { source: null, working: null }
    }
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(String(input), 'image/svg+xml')
      const svg = doc.documentElement
      if (!svg || svg.nodeName.toLowerCase() !== 'svg') {
        return { source: null, working: null }
      }
      return {
        source: null,
        working: svg,
      }
    } catch {
      return { source: null, working: null }
    }
  }

  applyLayout(target, { width, height, viewBox }) {
    if (!(target instanceof SVGElement)) {
      return
    }
    if (viewBox) {
      target.setAttribute('viewBox', viewBox)
    }
    if (width > 0) {
      target.setAttribute('width', String(Number(width.toFixed(2))))
    }
    if (height > 0) {
      target.setAttribute('height', String(Number(height.toFixed(2))))
    }
  }

  normalize(input, options = {}) {
    const { source, working } = this.createSvgElement(input)
    const padding = Number.isFinite(Number(options.padding))
      ? Number(options.padding)
      : 4

    if (!(working instanceof SVGElement) || typeof document === 'undefined') {
      return { svg: String(input || ''), width: 0, height: 0 }
    }

    const host = document.createElement('div')
    host.style.position = 'fixed'
    host.style.left = '-100000px'
    host.style.top = '0'
    host.style.opacity = '0'
    host.style.pointerEvents = 'none'
    host.style.visibility = 'hidden'
    document.body.appendChild(host)

    try {
      working.style.maxWidth = 'none'
      host.appendChild(working)
      const fallbackSize = this.getFallbackSize(working)
      const bbox = typeof working.getBBox === 'function' ? working.getBBox() : null
      const hasBBox =
        bbox &&
        Number.isFinite(bbox.x) &&
        Number.isFinite(bbox.y) &&
        Number.isFinite(bbox.width) &&
        Number.isFinite(bbox.height) &&
        bbox.width > 0 &&
        bbox.height > 0

      const width = hasBBox ? bbox.width + padding * 2 : fallbackSize.width
      const height = hasBBox ? bbox.height + padding * 2 : fallbackSize.height
      const viewBox = hasBBox
        ? [
            Number((bbox.x - padding).toFixed(2)),
            Number((bbox.y - padding).toFixed(2)),
            Number(width.toFixed(2)),
            Number(height.toFixed(2)),
          ].join(' ')
        : working.getAttribute('viewBox') || ''

      this.applyLayout(working, { width, height, viewBox })
      if (options.mutate === true && source instanceof SVGElement) {
        this.applyLayout(source, { width, height, viewBox })
      }

      return {
        svg: new XMLSerializer().serializeToString(working),
        width,
        height,
      }
    } catch {
      const fallbackSize = this.getFallbackSize(working)
      return {
        svg: typeof input === 'string' ? input : new XMLSerializer().serializeToString(working),
        width: fallbackSize.width,
        height: fallbackSize.height,
      }
    } finally {
      host.remove()
    }
  }
}

export const svgBoundsNormalizer = new SvgBoundsNormalizer()
