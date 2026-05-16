/**
 * useApScrollbar — Fully custom (non-native) scrollbar manager.
 *
 *   • Hides native scrollbars globally (see scrollbar.css).
 *   • Renders a fixed overlay vertical scrollbar for window scroll.
 *   • Auto-attaches an overlay horizontal scrollbar to every `.ap-scroll-x`
 *     element discovered now or later (MutationObserver).
 *   • Pure JS + DOM; no Vue templates so it works regardless of mount tree.
 *   • All visuals are CSS-driven via the `.ap-cscroll*` classes, which pick
 *     up per-theme tokens from scrollbar.css.
 *   • Touch-friendly: thumb has `min-size: 48px`, supports pointer drag.
 */
const MIN_THUMB = 48
const HIDE_DELAY = 900

type Cleanup = () => void

function makeBar(orientation: 'y' | 'x', mode: 'page' | 'inline') {
  const bar = document.createElement('div')
  bar.className = `ap-cscroll ap-cscroll--${orientation} ap-cscroll--${mode}`
  bar.setAttribute('aria-hidden', 'true')
  const thumb = document.createElement('div')
  thumb.className = 'ap-cscroll__thumb'
  bar.appendChild(thumb)
  return { bar, thumb }
}

function bindDrag(
  thumb: HTMLElement,
  bar: HTMLElement,
  axis: 'y' | 'x',
  getMetrics: () => { trackAvail: number; thumbSize: number; scrollMax: number },
  setScroll: (v: number) => void,
) {
  let dragging = false
  let offset = 0

  thumb.addEventListener('pointerdown', (e) => {
    dragging = true
    const r = thumb.getBoundingClientRect()
    offset = axis === 'y' ? e.clientY - r.top : e.clientX - r.left
    thumb.setPointerCapture(e.pointerId)
    bar.classList.add('is-dragging')
    e.preventDefault()
  })
  thumb.addEventListener('pointermove', (e) => {
    if (!dragging) return
    const tr = bar.getBoundingClientRect()
    const m = getMetrics()
    if (m.trackAvail <= 0) return
    const pos = axis === 'y' ? e.clientY - tr.top - offset : e.clientX - tr.left - offset
    const clamped = Math.max(0, Math.min(m.trackAvail, pos))
    setScroll((clamped / m.trackAvail) * m.scrollMax)
  })
  const release = () => {
    dragging = false
    bar.classList.remove('is-dragging')
  }
  thumb.addEventListener('pointerup', release)
  thumb.addEventListener('pointercancel', release)

  bar.addEventListener('pointerdown', (e) => {
    if (e.target !== bar) return
    const tr = bar.getBoundingClientRect()
    const m = getMetrics()
    if (m.trackAvail <= 0) return
    const pos = axis === 'y' ? e.clientY - tr.top - m.thumbSize / 2 : e.clientX - tr.left - m.thumbSize / 2
    const clamped = Math.max(0, Math.min(m.trackAvail, pos))
    setScroll((clamped / m.trackAvail) * m.scrollMax)
  })
}

function pageScrollbar(): Cleanup {
  const { bar, thumb } = makeBar('y', 'page')
  document.body.appendChild(bar)

  let hideTimer: number | undefined

  function update() {
    const docH = document.documentElement.scrollHeight
    const viewH = window.innerHeight
    if (docH <= viewH + 1) {
      bar.classList.add('is-hidden')
      return
    }
    bar.classList.remove('is-hidden')
    const trackH = bar.clientHeight
    const ratio = viewH / docH
    const thumbH = Math.max(MIN_THUMB, Math.round(ratio * trackH))
    const trackAvail = trackH - thumbH
    const scrollMax = docH - viewH
    const top = scrollMax > 0 ? (window.scrollY / scrollMax) * trackAvail : 0
    thumb.style.height = thumbH + 'px'
    thumb.style.transform = `translateY(${top}px)`
  }

  function flash() {
    bar.classList.add('is-active')
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = window.setTimeout(() => bar.classList.remove('is-active'), HIDE_DELAY)
  }

  function getMetrics() {
    const docH = document.documentElement.scrollHeight
    const viewH = window.innerHeight
    const trackH = bar.clientHeight
    const ratio = viewH / docH
    const thumbSize = Math.max(MIN_THUMB, Math.round(ratio * trackH))
    return { trackAvail: trackH - thumbSize, thumbSize, scrollMax: docH - viewH }
  }
  bindDrag(thumb, bar, 'y', getMetrics, (v) => window.scrollTo({ top: v, behavior: 'auto' }))

  const onScroll = () => { update(); flash() }
  const onResize = () => update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  const ro = new ResizeObserver(update)
  ro.observe(document.documentElement)
  ro.observe(document.body)
  update()

  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    ro.disconnect()
    bar.remove()
  }
}

const attached = new WeakMap<Element, Cleanup>()

function horizontalScrollbar(el: HTMLElement) {
  if (attached.has(el)) return
  // Build inside a wrapper that contains both content + bar
  const parent = el.parentElement
  if (!parent) return
  const cs = getComputedStyle(parent)
  if (cs.position === 'static') parent.style.position = 'relative'

  const { bar, thumb } = makeBar('x', 'inline')
  parent.appendChild(bar)

  let hideTimer: number | undefined

  function update() {
    const sw = el.scrollWidth
    const cw = el.clientWidth
    if (sw <= cw + 1) {
      bar.classList.add('is-hidden')
      return
    }
    bar.classList.remove('is-hidden')
    const trackW = bar.clientWidth
    const ratio = cw / sw
    const thumbW = Math.max(MIN_THUMB, Math.round(ratio * trackW))
    const trackAvail = trackW - thumbW
    const scrollMax = sw - cw
    const left = scrollMax > 0 ? (el.scrollLeft / scrollMax) * trackAvail : 0
    thumb.style.width = thumbW + 'px'
    thumb.style.transform = `translateX(${left}px)`
  }

  function flash() {
    bar.classList.add('is-active')
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = window.setTimeout(() => bar.classList.remove('is-active'), HIDE_DELAY)
  }

  function getMetrics() {
    const sw = el.scrollWidth
    const cw = el.clientWidth
    const trackW = bar.clientWidth
    const ratio = cw / sw
    const thumbSize = Math.max(MIN_THUMB, Math.round(ratio * trackW))
    return { trackAvail: trackW - thumbSize, thumbSize, scrollMax: sw - cw }
  }
  bindDrag(thumb, bar, 'x', getMetrics, (v) => { el.scrollLeft = v })

  const onScroll = () => { update(); flash() }
  el.addEventListener('scroll', onScroll, { passive: true })
  const ro = new ResizeObserver(update)
  ro.observe(el)
  const mo = new MutationObserver(update)
  mo.observe(el, { childList: true, subtree: true })
  update()

  attached.set(el, () => {
    el.removeEventListener('scroll', onScroll)
    ro.disconnect()
    mo.disconnect()
    bar.remove()
  })
}

function scanHorizontals() {
  document.querySelectorAll<HTMLElement>('.ap-scroll-x').forEach(horizontalScrollbar)
}

let installed = false
export function useApScrollbar() {
  if (typeof window === 'undefined' || installed) return
  installed = true

  // Page scrollbar
  pageScrollbar()

  // Horizontal scrollbars (now + on DOM mutations)
  scanHorizontals()
  const mo = new MutationObserver(() => scanHorizontals())
  mo.observe(document.body, { childList: true, subtree: true })
}
