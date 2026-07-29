<script setup lang="ts">
/**
 * ColorTheorySection — "Color, with a thesis." (absorbs the old design-system
 * color act; this section now carries the whole color system.)
 *
 * A floating 3D hue ring (three.js). Two registers:
 *  · PALETTE — the applied palette's real colors are plotted ON the wheel:
 *    angle = hue, distance from center = chroma. Primary, accent, and surface
 *    become glowing vertices joined by their actual geometry, and the HUD
 *    names the relationship it finds (analogous, complementary, …).
 *  · DIAL — click any chip (or a harmony model) to explore hypothetical
 *    harmonies as inscribed polygons.
 * Applying a family from the rail retints the entire site live and reveals
 * that family's full palette as a minimal paint-strip composition.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { useSiteTheme } from '@apotome/archetype-shared/composables/useSiteTheme'
import { SWATCH_LIST } from '@apotome/archetype-shared/themes/swatches'
import { SWATCH_THEORIES } from '@apotome/archetype-shared/themes/tokens'
import { hexToHsl } from '@apotome/archetype-shared/themes/customSwatches'

const { swatchName, swatch, setSwatch } = useSiteTheme()

/* ── Harmony models (dial mode) ── */
type Harmony = 'complementary' | 'analogous' | 'triadic' | 'split' | 'square' | 'mono'
const HARMONIES: Array<{ id: Harmony; label: string; offsets: number[] }> = [
  { id: 'complementary', label: 'Complementary', offsets: [180] },
  { id: 'analogous', label: 'Analogous', offsets: [-32, 32] },
  { id: 'triadic', label: 'Triadic', offsets: [120, 240] },
  { id: 'split', label: 'Split', offsets: [150, 210] },
  { id: 'square', label: 'Square', offsets: [90, 180, 270] },
  { id: 'mono', label: 'Monochrome', offsets: [0] },
]
const harmony = ref<Harmony>('triadic')

/* ── Mode: palette (default — the site's palette on the wheel) vs dial ── */
const mode = ref<'palette' | 'dial'>('palette')
const dialHue = ref(Math.round(hexToHsl(swatch.value.primary).h))

/** Every harmony explores from the palette's PRIMARY hue — the geometry
    always answers "what pairs with my actual brand color". */
function pickDial(h: Harmony) {
  dialHue.value = Math.round(hexToHsl(swatch.value.primary).h)
  harmony.value = h
  mode.value = 'dial'
}

/** HSL chroma — how far a color actually sits from gray. */
function chromaOf(hex: string): { h: number; c: number } {
  const { h, s, l } = hexToHsl(hex)
  return { h, c: s * (1 - Math.abs(2 * l - 1)) }
}

/** The primary color's plotted coordinates, spelled out. */
const primaryStats = computed(() => {
  const { h, c } = chromaOf(swatch.value.primary)
  return { h: Math.round(h), c: c.toFixed(2), hex: swatch.value.primary }
})

/** The vertices the instrument plots, per mode. */
const targetPoints = computed<Array<{ h: number; c: number; hex: string | null }>>(() => {
  if (mode.value === 'palette') {
    const s = swatch.value
    return [s.primary, s.accent, s.surface].map(hex => ({ ...chromaOf(hex), hex }))
  }
  // Monochrome is one hue at three depths — a ladder along the radius.
  if (harmony.value === 'mono') {
    return [0.85, 0.5, 0.2].map(c => ({ h: dialHue.value, c, hex: null }))
  }
  const offs = HARMONIES.find(x => x.id === harmony.value)!.offsets
  return [0, ...offs].map(o => ({ h: dialHue.value + o, c: 0.85, hex: null }))
})

/** Names the relationship between primary and accent. */
const detected = computed(() => {
  const p = hexToHsl(swatch.value.primary), a = hexToHsl(swatch.value.accent)
  if (p.s < 0.12 || a.s < 0.12) return 'Neutral + jewel'
  const raw = Math.abs(p.h - a.h) % 360
  const d = raw > 180 ? 360 - raw : raw
  if (d < 20) return 'Monochrome'
  if (d < 55) return 'Analogous'
  if (d < 100) return 'Square'
  if (d <= 140) return 'Triadic'
  if (d < 168) return 'Split-complement'
  return 'Complementary'
})

const hudHue = ref(dialHue.value)
const hudLabel = computed(() =>
  mode.value === 'palette'
    ? `${swatch.value.label} · ${detected.value}`
    : HARMONIES.find(h => h.id === harmony.value)!.label)

/* ── Rail: the six groups + full-palette reveal for the active family ── */
const groups = computed(() =>
  SWATCH_THEORIES.map(t => ({
    ...t,
    items: SWATCH_LIST.filter(s => s.group === t.id && s.mode === swatch.value.mode),
  })))

function applyFamily(name: string) { mode.value = 'palette'; setSwatch(name) }

/* ── Light/dark switcher — flips the applied family to its twin ── */
const twinName = computed(() => {
  const s = swatch.value
  const family = s.name.replace(/-(light|dark)$/, '')
  const target = `${family}-${s.mode === 'light' ? 'dark' : 'light'}`
  return SWATCH_LIST.some(x => x.name === target) ? target : null
})
function toggleModeSwitch() {
  if (twinName.value) { mode.value = 'palette'; setSwatch(twinName.value) }
}

/** Text color that stays readable on a given strip. */
function onColor(hex: string): string {
  const s = swatch.value
  return hexToHsl(hex).l > 0.56 ? s.ink : s.surfaceAlt
}

/** Blurred abstract wash behind the whole section, mixed from the applied
    palette — repaints with every swatch change. */
const bgStyle = computed(() => {
  const s = swatch.value
  return {
    background: [
      `radial-gradient(46% 46% at 12% 12%, ${s.primary}3d, transparent 72%)`,
      `radial-gradient(40% 40% at 88% 20%, ${s.accent}36, transparent 72%)`,
      `radial-gradient(46% 40% at 24% 54%, ${s.accent}20, transparent 74%)`,
      `radial-gradient(52% 40% at 78% 66%, ${s.primary}26, transparent 74%)`,
      // Anchored past the bottom edge so the wash carries all the way down
      // instead of fading out above the last row of the panel.
      `radial-gradient(80% 46% at 50% 104%, ${s.primary}30, transparent 78%)`,
      `radial-gradient(46% 34% at 16% 96%, ${s.accent}1f, transparent 76%)`,
    ].join(', '),
  }
})

/** The applied palette, in reading order — one continuous band. */
const paletteStrips = computed(() => {
  const s = swatch.value
  return [
    { k: 'Surface', use: 'Page ground', hex: s.surface },
    { k: 'Surface alt', use: 'Cards & panels', hex: s.surfaceAlt },
    { k: 'Primary', use: 'Buttons & links', hex: s.primary },
    { k: 'Accent', use: 'Highlights', hex: s.accent },
    { k: 'Ink', use: 'Type', hex: s.ink },
    { k: 'Line', use: 'Hairlines', hex: s.line },
  ].map(r => ({ ...r, text: onColor(r.hex) }))
})


/* ═══ three.js scene ═══════════════════════════════════════════════ */
const host = ref<HTMLDivElement | null>(null)
const palHost = ref<HTMLDivElement | null>(null)
const isReady = ref(false)
let renderer: THREE.WebGLRenderer | null = null
let raf = 0
let disposed = false
let reduced = false

function themeColors() {
  const cs = getComputedStyle(document.documentElement)
  return {
    ink: new THREE.Color(cs.getPropertyValue('--ap-ink').trim() || '#111'),
    muted: new THREE.Color(cs.getPropertyValue('--ap-ink-muted').trim() || '#777'),
  }
}

onMounted(() => {
  const mounted = host.value
  if (!mounted) return
  // Declared non-nullable so the helper functions below (hoisted decls, which
  // don't inherit the guard's narrowing) can use it without re-checking.
  const el: HTMLDivElement = mounted
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const scene = new THREE.Scene()
  // Near-top-down: the wheel reads as a symmetric circle, the slight camera
  // offset + parallax tilt keep it unmistakably a 3D object.
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
  // Far enough back that the full bezel (ticks included) always clears the
  // frame — the wheel must never crop.
  camera.position.set(0, 12.4, 3.6)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  el.appendChild(renderer.domElement)

  const rig = new THREE.Group()
  scene.add(rig)

  const R = 4
  const CHIPS = 36

  /* Hue chips */
  const chipGeo = new THREE.PlaneGeometry(0.6, 0.38)
  const chips: THREE.Mesh[] = []
  const isDark = () => swatch.value.mode === 'dark'
  const chipColor = (h: number) =>
    new THREE.Color().setHSL(h / 360, isDark() ? 0.82 : 0.74, isDark() ? 0.58 : 0.52)
  for (let i = 0; i < CHIPS; i++) {
    const h = i * (360 / CHIPS)
    const mat = new THREE.MeshBasicMaterial({
      color: chipColor(h), side: THREE.DoubleSide, transparent: true, opacity: 0.92,
    })
    const chip = new THREE.Mesh(chipGeo, mat)
    const a = THREE.MathUtils.degToRad(h)
    chip.position.set(R * Math.cos(a), 0, -R * Math.sin(a))
    // Orientation is set per-frame: each tile is billboarded flat to the
    // viewer's eye (no foreshortening), rolled so the ring still fans.
    chip.userData.hue = h
    chip.userData.angle = a
    chip.userData.r = R
    mat.opacity = 0
    chips.push(chip)
    rig.add(chip)
  }

  /* Bezel ticks + chroma reference rings (the "coordinates"). */
  const { ink, muted } = themeColors()
  const tickPts: number[] = []
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2
    const major = i % 6 === 0
    const r1 = R + 0.55, r2 = R + (major ? 0.92 : 0.72)
    tickPts.push(r1 * Math.cos(a), 0, -r1 * Math.sin(a), r2 * Math.cos(a), 0, -r2 * Math.sin(a))
  }
  const tickGeo = new THREE.BufferGeometry()
  tickGeo.setAttribute('position', new THREE.Float32BufferAttribute(tickPts, 3))
  const tickMat = new THREE.LineBasicMaterial({ color: muted, transparent: true, opacity: 0.45 })
  rig.add(new THREE.LineSegments(tickGeo, tickMat))

  const ringMats: THREE.LineBasicMaterial[] = []
  const ringGeos: THREE.BufferGeometry[] = []
  for (const rr of [1.15, 2.3, R - 0.55]) {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2
      pts.push(new THREE.Vector3(rr * Math.cos(a), 0, -rr * Math.sin(a)))
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts)
    const m = new THREE.LineBasicMaterial({ color: muted, transparent: true, opacity: rr < 3 ? 0.16 : 0.3 })
    ringGeos.push(g); ringMats.push(m)
    rig.add(new THREE.Line(g, m))
  }

  /* Plotted geometry: polygon + spokes + glowing vertices. */
  const MAXV = 4
  const polyGeo = new THREE.BufferGeometry()
  polyGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(MAXV * 2 * 3), 3))
  const polyMat = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.85 })
  rig.add(new THREE.LineSegments(polyGeo, polyMat))

  const spokeGeo = new THREE.BufferGeometry()
  spokeGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(MAXV * 2 * 3), 3))
  const spokeMat = new THREE.LineBasicMaterial({ color: muted, transparent: true, opacity: 0.4 })
  rig.add(new THREE.LineSegments(spokeGeo, spokeMat))

  const markerGeo = new THREE.SphereGeometry(0.13, 20, 20)
  const glowGeo = new THREE.SphereGeometry(0.3, 20, 20)
  const markers: Array<{ core: THREE.Mesh; glow: THREE.Mesh }> = []
  for (let i = 0; i < MAXV; i++) {
    const core = new THREE.Mesh(markerGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }))
    const glow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false,
    }))
    rig.add(core, glow)
    markers.push({ core, glow })
  }

  const centerDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 12, 12),
    new THREE.MeshBasicMaterial({ color: ink }),
  )
  rig.add(centerDot)

  /* ── The palette flow — one continuous dot-wave band under the wheel.
     Columns blend from each palette color into the next (short blend zones,
     long plateaus, no gaps), and the whole band breathes like a slow wave. */
  const ph = palHost.value
  let pal: {
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    geo: THREE.BufferGeometry
    mat: THREE.PointsMaterial
    tex: THREE.CanvasTexture
    xs: Float32Array
    rowOf: Float32Array
    cur: Float32Array
    tgt: Float32Array
    count: number
    amp: number
    worldW: number
  } | null = null

  function palDotTexture(): THREE.CanvasTexture {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const g = c.getContext('2d')!
    g.beginPath()
    g.arc(32, 32, 30, 0, Math.PI * 2)
    g.fillStyle = '#fff'
    g.fill()
    return new THREE.CanvasTexture(c)
  }

  /** Column color: six equal regions (centered under their labels), each a
      plateau that eases softly into the next — one continuous band. */
  function palColumnColor(t: number, out: THREE.Color) {
    const roles = paletteStrips.value
    const n = roles.length
    const pos = Math.max(0, Math.min(n - 1, t * n - 0.5))
    const i0 = Math.floor(pos)
    const i1 = Math.min(n - 1, i0 + 1)
    const f = pos - i0
    const blend = Math.min(1, Math.max(0, (f - 0.55) / 0.45))
    const eased = blend * blend * (3 - 2 * blend)
    const a = roles[i0] ?? roles[0]!
    const b = roles[i1] ?? a
    out.set(a.hex).lerp(new THREE.Color(b.hex), eased)
  }

  function palTargets() {
    if (!pal) return
    const col = new THREE.Color()
    const perRow = pal.count / 4
    for (let i = 0; i < pal.count; i++) {
      const cIdx = i % perRow
      palColumnColor(perRow <= 1 ? 0 : cIdx / (perRow - 1), col)
      pal.tgt[i * 3] = col.r; pal.tgt[i * 3 + 1] = col.g; pal.tgt[i * 3 + 2] = col.b
    }
  }

  function buildPal() {
    if (!ph) return
    const w = ph.clientWidth, h = ph.clientHeight
    if (!w || !h) return
    if (pal) {
      pal.geo.dispose(); pal.mat.dispose(); pal.tex.dispose()
      pal.renderer.dispose(); pal.renderer.domElement.remove()
      pal = null
    }
    const rows = 4
    // Sparse grid — clear air between dots (one column per ~26px).
    const cols = Math.max(16, Math.round(w / 26))
    const count = rows * cols

    const rendererP = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    rendererP.setClearColor(0x000000, 0)
    rendererP.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererP.setSize(w, h)
    ph.appendChild(rendererP.domElement)

    const sceneP = new THREE.Scene()
    // Perspective camera so the wave can travel in DEPTH: dots swell as they
    // approach the screen and shrink as they fall back.
    const D = 60
    const cameraP = new THREE.PerspectiveCamera(45, w / h, 0.1, 300)
    cameraP.position.set(0, 0, D)
    cameraP.lookAt(0, 0, 0)
    const worldH = 2 * D * Math.tan(THREE.MathUtils.degToRad(45 / 2))
    const worldW = worldH * (w / h)
    const cellW = worldW / cols
    const rowGap = Math.min(cellW * 1.5, worldH / (rows + 1))
    const dotWorld = Math.min(cellW * 0.85, rowGap * 0.92)

    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const xs = new Float32Array(count)
    const rowOf = new Float32Array(count)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c
        const x = ((c + 0.5) / cols) * worldW - worldW / 2
        const y = (r - (rows - 1) / 2) * rowGap
        positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = 0
        xs[i] = x; rowOf[i] = r
      }
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const tex = palDotTexture()
    const mat = new THREE.PointsMaterial({
      size: dotWorld,
      sizeAttenuation: true,
      map: tex,
      transparent: true,
      alphaTest: 0.35,
      vertexColors: true,
    })
    sceneP.add(new THREE.Points(geo, mat))

    pal = {
      renderer: rendererP, scene: sceneP, camera: cameraP, geo, mat, tex,
      xs, rowOf, cur: colors, tgt: new Float32Array(count * 3), count,
      amp: D * 0.09,   // subtle: ±9% of camera distance, a gentle breathing swell
      worldW,
    }
    palTargets()
    // First paint starts on-palette (no fade-in from black).
    pal.cur.set(pal.tgt)
    ;(geo.attributes.color as THREE.BufferAttribute).needsUpdate = true
  }

  /** Eases one dot's RGB toward its target, in place. */
  function easeDotColor(cur: Float32Array, tgt: Float32Array, i: number) {
    const b = i * 3
    for (let k = 0; k < 3; k++) {
      const c = cur[b + k] ?? 0
      cur[b + k] = c + ((tgt[b + k] ?? 0) - c) * 0.07
    }
  }

  function palRender(t: number) {
    if (!pal) return
    const pos = pal.geo.attributes.position as THREE.BufferAttribute
    const colAttr = pal.geo.attributes.color as THREE.BufferAttribute
    palWaveCur += (palWaveTgt - palWaveCur) * 0.05
    if (palWaveCur < 0.004 && palWaveTgt === 0) palWaveCur = 0
    palMouseCur += (palMouseTgt - palMouseCur) * 0.1
    const strength = reduced ? 0 : palWaveCur
    // The swell follows the pointer: a smooth gaussian crest centered on the
    // eased cursor position, lifting nearby dots toward the screen.
    const mx = (palMouseCur - 0.5) * pal.worldW
    const sigma = pal.worldW * 0.13
    const twoSigmaSq = 2 * sigma * sigma
    // Reveal sweep: on palette load, dots arrive left → right behind a
    // traveling crest; dots ahead of the front are clipped (invisible).
    const rv = reduced ? 1 : Math.min(1, (t - revealStart) / 1400)
    const front = rv * 1.35 - 0.12
    for (let i = 0; i < pal.count; i++) {
      const xn = (pal.xs[i] ?? 0) / pal.worldW + 0.5
      if (xn > front) {
        pos.setZ(i, 500)   // beyond the camera → clipped, not yet arrived
        easeDotColor(pal.cur, pal.tgt, i)
        continue
      }
      const arrive = rv >= 1 ? 0 : Math.exp(-((xn - front) ** 2) / (2 * 0.055 ** 2)) * pal.amp
      const dx = (pal.xs[i] ?? 0) - mx
      const hover = strength === 0 ? 0 : Math.exp(-(dx * dx) / twoSigmaSq) * pal.amp * strength
      const z = Math.min(pal.amp, arrive + hover)
      pos.setZ(i, z)
      easeDotColor(pal.cur, pal.tgt, i)
    }
    pos.needsUpdate = true
    colAttr.needsUpdate = true
    pal.renderer.render(pal.scene, pal.camera)
  }

  buildPal()
  const palRo = ph ? new ResizeObserver(() => { buildPal(); if (reduced) render(0) }) : null
  if (ph && palRo) palRo.observe(ph)

  /* Wave-on-hover: the band rests perfectly still; pointing at it fades the
     swell in, leaving fades it back out (eased envelope, no snap). */
  let palWaveTgt = 0
  let palWaveCur = 0
  let palMouseTgt = 0.5   // normalized 0..1 across the band
  let palMouseCur = 0.5
  let revealStart = performance.now()   // band reveal sweep clock
  const palWaveOn = () => { palWaveTgt = 1 }
  const palWaveOff = () => { palWaveTgt = 0 }
  const palWaveMove = (e: PointerEvent) => {
    if (!ph) return
    const r = ph.getBoundingClientRect()
    if (r.width > 0) palMouseTgt = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
  }
  ph?.addEventListener('pointerenter', palWaveOn)
  ph?.addEventListener('pointerleave', palWaveOff)
  ph?.addEventListener('pointermove', palWaveMove)
  const stopPalWatch = watch(paletteStrips, () => {
    palTargets()
    revealStart = performance.now()   // new palette → sweep the dots in again
    if (reduced) render(0)
  })

  function size() {
    if (!renderer) return
    const w = el.clientWidth, h = el.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  size()
  const ro = new ResizeObserver(() => { size(); if (reduced) render(0) })
  ro.observe(el)

  /* Pointer: parallax + drag-to-spin + click-to-retune. */
  let targetTiltX = 0, targetTiltZ = 0
  let spin = 0, spinVel = 0
  let dragging = false, dragStartX = 0, dragMoved = false
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  // Billboard scratch objects + intro clock (tiles arrive one at a time).
  const qRigInv = new THREE.Quaternion()
  const qRoll = new THREE.Quaternion()
  const Z_AXIS = new THREE.Vector3(0, 0, 1)
  const introStart = performance.now()

  function onMove(e: PointerEvent) {
    const r = el.getBoundingClientRect()
    targetTiltZ = (((e.clientX - r.left) / r.width) * 2 - 1) * 0.07
    targetTiltX = (((e.clientY - r.top) / r.height) * 2 - 1) * 0.1
    if (dragging) {
      spinVel = (e.clientX - dragStartX) * 0.0035
      if (Math.abs(e.clientX - dragStartX) > 4) dragMoved = true
      dragStartX = e.clientX
    }
  }
  function onDown(e: PointerEvent) { dragging = true; dragMoved = false; dragStartX = e.clientX }
  function onUp(e: PointerEvent) {
    if (dragging && !dragMoved) {
      const r = el.getBoundingClientRect()
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1))
      ray.setFromCamera(ndc, camera)
      const hit = ray.intersectObjects(chips, false)[0]
      if (hit) { mode.value = 'dial'; dialHue.value = Math.round(hit.object.userData.hue as number) }
    }
    dragging = false
  }
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerdown', onDown)
  window.addEventListener('pointerup', onUp)

  const stopSwatchWatch = watch(() => swatch.value.name, () => {
    const c = themeColors()
    tickMat.color.copy(c.muted)
    ringMats.forEach(m => m.color.copy(c.muted))
    polyMat.color.copy(c.ink); spokeMat.color.copy(c.muted)
    ;(centerDot.material as THREE.MeshBasicMaterial).color.copy(c.ink)
    chips.forEach(ch => (ch.material as THREE.MeshBasicMaterial).color.copy(chipColor(ch.userData.hue as number)))
    if (reduced) render(0)
  })

  /* Per-vertex eased display state (hue glides the short way; radius lerps). */
  const disp = Array.from({ length: MAXV }, () => ({ h: dialHue.value, r: R - 0.5, on: 0 }))
  const V = new THREE.Vector3()
  const posAt = (h: number, r: number, out: THREE.Vector3) => {
    const a = THREE.MathUtils.degToRad(h)
    return out.set(r * Math.cos(a), 0, -r * Math.sin(a))
  }
  /** chroma → radius: gray sits at the axle, full chroma rides the rim. */
  const radiusOf = (c: number) => 0.55 + Math.min(1, c) * (R - 1.15)

  function render(t: number) {
    if (!renderer) return
    const pts = targetPoints.value
    const ease = reduced ? 1 : 0.08

    const pPos = polyGeo.attributes.position as THREE.BufferAttribute
    const sPos = spokeGeo.attributes.position as THREE.BufferAttribute
    const active: THREE.Vector3[] = []
    for (let i = 0; i < MAXV; i++) {
      const target = pts[i]
      const d = disp[i]
      const m = markers[i]
      if (!d || !m) continue          // both are fixed MAXV-length arrays
      if (!target) {
        m.core.visible = m.glow.visible = false
        pPos.setXYZ(i * 2, 0, 0, 0); pPos.setXYZ(i * 2 + 1, 0, 0, 0)
        sPos.setXYZ(i * 2, 0, 0, 0); sPos.setXYZ(i * 2 + 1, 0, 0, 0)
        continue
      }
      const dh = ((((target.h % 360) + 360) % 360 - d.h + 540) % 360) - 180
      d.h = ((d.h + dh * ease) + 360) % 360
      d.r += (radiusOf(target.c) - d.r) * ease
      const p = posAt(d.h, d.r, new THREE.Vector3())
      active.push(p)
      m.core.visible = m.glow.visible = true
      m.core.position.copy(p); m.glow.position.copy(p)
      const col = target.hex
        ? new THREE.Color(target.hex)
        : new THREE.Color().setHSL(d.h / 360, 0.85, 0.6)
      ;(m.core.material as THREE.MeshBasicMaterial).color.copy(col)
      ;(m.glow.material as THREE.MeshBasicMaterial).color.copy(col)
      m.glow.scale.setScalar(reduced ? 1 : 1 + 0.12 * Math.sin(t * 0.0024 + i * 1.7))
      sPos.setXYZ(i * 2, 0, 0, 0)
      sPos.setXYZ(i * 2 + 1, p.x, p.y, p.z)
    }
    // Polygon joins the active vertices in order (2 → chord, 3 → triangle).
    for (let i = 0; i < MAXV; i++) {
      if (i < active.length && active.length > 1) {
        const p = active[i], q = active[(i + 1) % active.length]
        // Don't double-draw the single chord of a 2-vertex figure.
        if (p && q && !(active.length === 2 && i === 1)) { pPos.setXYZ(i * 2, p.x, p.y, p.z); pPos.setXYZ(i * 2 + 1, q.x, q.y, q.z); continue }
      }
      pPos.setXYZ(i * 2, 0, 0, 0); pPos.setXYZ(i * 2 + 1, 0, 0, 0)
    }
    pPos.needsUpdate = true
    sPos.needsUpdate = true

    const lead = disp[0]
    if (lead && Math.round(lead.h) !== hudHue.value) hudHue.value = Math.round(lead.h)

    if (!reduced) { spin += 0.0012 + spinVel; spinVel *= 0.94 }
    rig.rotation.y = spin
    rig.rotation.x += (targetTiltX - rig.rotation.x) * 0.06
    rig.rotation.z += (targetTiltZ - rig.rotation.z) * 0.06

    // Chips: intro cascade (one tile fading in at a time around the ring),
    // billboarded flat to the eye, and active hues push OUT along the
    // radius — the tile slides outward, it does not float toward the screen.
    const hues = pts.map(p => ((p.h % 360) + 360) % 360)
    qRigInv.copy(rig.quaternion).invert()
    for (let ci = 0; ci < chips.length; ci++) {
      const ch = chips[ci]
      if (!ch) continue
      const hh = ch.userData.hue as number
      const aC = ch.userData.angle as number
      const near = Math.min(...hues.map(x => Math.abs(((x - hh + 540) % 360) - 180)))
      const lift = Math.max(0, 1 - near / 14)
      // Birth: staggered around the ring, each tile eases in over ~240ms.
      const born = reduced ? 1 : Math.min(1, Math.max(0, (t - (introStart + (ci / chips.length) * 1150)) / 240))
      const eased = born * born * (3 - 2 * born)
      // Radius: slides out from slightly inside the ring at birth, then
      // pushes further outward when this hue is an active plot point.
      const desired = R * (0.88 + 0.12 * eased) + lift * 0.45 * eased
      const cur = ch.userData.r as number
      const nr = cur + (desired - cur) * 0.14
      ch.userData.r = nr
      ch.position.set(nr * Math.cos(aC), 0, -nr * Math.sin(aC))
      // Billboard: flat to the viewer, rolled to stay tangent to the ring
      // (compensates the rig's spin so the fan holds while it precesses).
      qRoll.setFromAxisAngle(Z_AXIS, aC + spin + Math.PI / 2)
      ch.quaternion.copy(qRigInv).multiply(camera.quaternion).multiply(qRoll)
      ;(ch.material as THREE.MeshBasicMaterial).opacity = eased * (0.55 + 0.45 * Math.max(lift, 0.6))
    }

    renderer.render(scene, camera)
    palRender(t)
  }

  function loop(t: number) {
    if (disposed) return
    render(t)
    raf = requestAnimationFrame(loop)
  }

  isReady.value = true
  if (reduced) {
    render(0)
    watch([targetPoints], () => render(0))
  } else {
    raf = requestAnimationFrame(loop)
  }

  onBeforeUnmount(() => {
    disposed = true
    cancelAnimationFrame(raf)
    stopSwatchWatch()
    stopPalWatch()
    ro.disconnect()
    palRo?.disconnect()
    ph?.removeEventListener('pointerenter', palWaveOn)
    ph?.removeEventListener('pointerleave', palWaveOff)
    ph?.removeEventListener('pointermove', palWaveMove)
    if (pal) {
      pal.geo.dispose(); pal.mat.dispose(); pal.tex.dispose()
      pal.renderer.dispose(); pal.renderer.domElement.remove()
      pal = null
    }
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointerup', onUp)
    chipGeo.dispose(); tickGeo.dispose(); polyGeo.dispose(); spokeGeo.dispose()
    ringGeos.forEach(g => g.dispose())
    markerGeo.dispose(); glowGeo.dispose()
    scene.traverse(o => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined
      if (m) m.dispose()
    })
    renderer?.dispose()
    renderer?.domElement.remove()
    renderer = null
  })
})
</script>

<template>
  <section class="ap-section ct" aria-label="The color system">
    <!-- Blurred abstract wash mixed from the applied palette. -->
    <div class="ct__bg" :style="bgStyle" aria-hidden="true" />
    <div class="ap-container">
      <div class="ap-section-head">
        <p class="ap-eyebrow">The color system</p>
        <h2>Color, with a thesis.</h2>
        <p class="ct__intro">
          Twenty-four palettes in light and dark, grouped by the feeling they create.
          Apply one and its colors land on the wheel, and the page retints live.
        </p>
      </div>

      <div class="ct__stage">
        <!-- The instrument — sticky while the rail scrolls past.
             Microtext lives in the four corners of the wheel container:
             TL readout · TR specimen id · BL harmony models · BR axis key. -->
        <div class="ct__scene">
          <div class="ct__viz">
            <div ref="host" class="ct__canvas" :class="{ 'is-ready': isReady }" />
            <div class="ct__hud ct__corner ct__corner--tl" aria-hidden="true">
              <span class="ct__hud-hue">H {{ hudHue }}°</span>
              <span class="ct__hud-sep" />
              <span class="ct__hud-model">{{ hudLabel }}</span>
            </div>
            <div class="ct__corner ct__corner--tr">
              <span aria-hidden="true">Palette · <span class="ct__corner-strong">{{ swatch.label }}</span></span>
              <span class="ct__corner-line" aria-hidden="true">Primary {{ primaryStats.hex }}</span>
              <span class="ct__corner-line" aria-hidden="true">H {{ primaryStats.h }}° · C {{ primaryStats.c }}</span>
              <button
                v-if="twinName"
                type="button"
                class="ct__mode-switch"
                :title="swatch.mode === 'light' ? 'Switch to the dark version' : 'Switch to the light version'"
                @click="toggleModeSwitch"
              >
                <span class="ct__mode-dot" :class="{ 'is-dark': swatch.mode === 'dark' }" />
                {{ swatch.mode === 'light' ? 'Light' : 'Dark' }}
              </button>
            </div>
            <div class="ct__models ct__corner ct__corner--bl" role="group" aria-label="Harmony model">
              <button
                v-for="hm in HARMONIES"
                :key="hm.id"
                type="button"
                class="ct__model"
                :class="{ 'is-active': mode === 'dial' ? harmony === hm.id : detected.toLowerCase().startsWith(hm.id.slice(0, 5)) }"
                @click="pickDial(hm.id)"
              >{{ hm.label }}</button>
            </div>
            <div class="ct__corner ct__corner--br" aria-hidden="true">Angle = hue · Radius = chroma</div>
          </div>

          <!-- The applied palette — one continuous dot band, labels beneath. -->
          <div class="ct__pal">
            <div ref="palHost" class="ct__pal-flow" aria-hidden="true" />
            <div class="ct__pal-labels" role="img" :aria-label="`${swatch.label} palette`">
              <span
                v-for="b in paletteStrips"
                :key="b.k"
                class="ct__pal-role"
                :title="`${b.use} · ${b.hex}`"
              >{{ b.k }}</span>
            </div>
          </div>
        </div>

        <!-- The theory, written down -->
        <aside class="ct__rail">
          <div v-for="g in groups" :key="g.id" class="ct__group">
            <div class="ct__group-head">
              <h3 class="ct__group-name">{{ g.label }}</h3>
              <span class="ct__group-rule" aria-hidden="true" />
            </div>
            <p class="ct__group-sub">{{ g.subtext }}</p>
            <div class="ct__group-swatches">
              <button
                v-for="s in g.items"
                :key="s.name"
                type="button"
                class="ct__fam"
                :class="{ 'is-active': swatchName === s.name }"
                :title="s.feel"
                @click="applyFamily(s.name)"
              >
                <span
                  class="ct__coin"
                  aria-hidden="true"
                  :style="{ background: `linear-gradient(135deg, ${s.primary} 0 52%, ${s.accent} 52% 100%)` }"
                />
                <span class="ct__fam-name">{{ s.label }}</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* The section carries a blurred abstract wash of the applied palette. */
.ct {
  position: relative;
  overflow: clip;
}
.ct__bg {
  position: absolute;
  /* Extra bleed past the bottom: `blur()` softens an element's own edges
     inward, so the layer has to overhang the panel for the wash to reach
     the last row instead of fading out above it. */
  inset: -10% -8% -18%;
  filter: blur(72px) saturate(1.15);
  pointer-events: none;
  transition: opacity 560ms ease;
}
.ct > .ap-container { position: relative; z-index: 1; }

.ct__intro { color: var(--ap-ink-muted); max-width: 62ch; }

.ct__stage {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.9fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: start;
}

/* ── The instrument — unboxed, sticky while the rail scrolls ── */
.ct__scene {
  min-width: 0;
  position: sticky;
  top: calc(var(--ap-header-h, 64px) + 1.25rem);
}
.ct__viz { position: relative; }
.ct__canvas {
  height: clamp(300px, 30vw, 420px);
  cursor: grab;
  opacity: 0;
  transition: opacity 1.1s ease;
  touch-action: pan-y;
}
.ct__canvas:active { cursor: grabbing; }
.ct__canvas.is-ready { opacity: 1; }
.ct__canvas :deep(canvas) { display: block; width: 100%; height: 100%; }

.ct__hud {
  position: absolute; left: 0.25rem; top: 0.25rem;
  display: inline-flex; align-items: center; gap: 0.6rem;
  font-family: var(--ap-font-mono);
  font-size: 0.72rem; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ap-ink-muted);
  pointer-events: none;
}
.ct__hud-hue { color: var(--ap-ink); font-variant-numeric: tabular-nums; min-width: 4.2em; }
.ct__hud-sep { width: 2.2rem; height: 1px; background: var(--ap-line); }
.ct__hud-model { color: var(--ap-ink); }

/* ── Corner microtext — one voice, four corners of the wheel container ── */
.ct__corner {
  position: absolute;
  font-family: var(--ap-font-mono);
  font-size: 0.62rem; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ap-ink-muted);
  pointer-events: none;
  max-width: 46%;
}
.ct__corner--tl { left: 0.25rem; top: 0.35rem; }
.ct__corner--tr { right: 0.25rem; top: 0.35rem; text-align: right; }
.ct__corner--bl { left: 0.25rem; bottom: 0.35rem; }
.ct__corner--br { right: 0.25rem; bottom: 0.35rem; text-align: right; }
.ct__corner-strong { color: var(--ap-ink); }
.ct__corner--tr { display: flex; flex-direction: column; align-items: flex-end; gap: 0.28rem; }
.ct__corner-line { font-size: 0.58rem; opacity: 0.85; font-variant-numeric: tabular-nums; }
.ct__mode-switch {
  display: inline-flex; align-items: center; gap: 0.35rem;
  margin-top: 0.15rem;
  background: none; border: 1px solid var(--ap-line); border-radius: 999px;
  padding: 0.18rem 0.55rem;
  font: inherit; font-size: 0.58rem;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ap-ink);
  cursor: pointer;
  pointer-events: auto;
  transition: border-color 140ms ease, background 140ms ease;
}
.ct__mode-switch:hover { border-color: var(--ap-ink); }
.ct__mode-dot {
  width: 9px; height: 9px; border-radius: 50%;
  background: var(--ap-ink);
  box-shadow: inset 0 0 0 1.5px var(--ap-surface);
  border: 1px solid var(--ap-ink);
}
.ct__mode-dot.is-dark { background: var(--ap-surface); }
@media (max-width: 640px) { .ct__corner--tr, .ct__corner--br { display: none; } }

.ct__models {
  display: flex; gap: clamp(0.7rem, 1.6vw, 1.4rem); flex-wrap: wrap;
  pointer-events: auto;    /* corner text is inert; these are buttons */
}
.ct__model {
  background: none; border: 0; padding: 0.2rem 0;
  font-family: var(--ap-font-mono);
  font-size: 0.68rem; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ap-ink-muted);
  border-bottom: 1px solid transparent;
  cursor: pointer;
  transition: color 140ms ease, border-color 140ms ease;
}
.ct__model:hover { color: var(--ap-ink); }
.ct__model.is-active { color: var(--ap-ink); border-bottom-color: var(--ap-primary); }

/* ── The rail ── */
.ct__rail { display: flex; flex-direction: column; gap: clamp(0.9rem, 1.8vw, 1.3rem); }
.ct__group-head { display: flex; align-items: center; gap: 0.8rem; }
.ct__group-name { margin: 0; font-size: 0.92rem; letter-spacing: 0.02em; }
.ct__group-rule { flex: 1; height: 1px; background: var(--ap-line); }
.ct__group-sub {
  margin: 0.25rem 0 0.5rem;
  font-size: 0.8rem; line-height: 1.55;
  color: var(--ap-ink-muted);
  max-width: 44ch;
}
.ct__group-swatches { display: flex; flex-wrap: wrap; gap: 0.35rem 0.7rem; }
/* Family chip: coin + its name, shown — not tucked into a tooltip. */
.ct__fam {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: none; border: 0; padding: 0.2rem 0;
  cursor: pointer;
  color: var(--ap-ink-muted);
  transition: color 160ms ease;
}
.ct__fam:hover { color: var(--ap-ink); }
.ct__fam:hover .ct__coin { transform: translateY(-2px) scale(1.08); }
.ct__coin {
  width: 20px; height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
  transition: transform 180ms cubic-bezier(0.2, 0.7, 0.3, 1), box-shadow 180ms ease;
}
.ct__fam-name {
  font-size: 0.76rem;
  letter-spacing: 0.01em;
  white-space: nowrap;
}
.ct__fam.is-active { color: var(--ap-ink); }
.ct__fam.is-active .ct__fam-name { font-weight: 600; }
.ct__fam.is-active .ct__coin {
  box-shadow:
    inset 0 0 0 1px rgba(0, 0, 0, 0.2),
    0 0 0 2px var(--ap-surface),
    0 0 0 3px var(--ap-ink);
}

/* ── Full-palette reveal — specimen row, lab-report style ── */
.ct__pal {
  margin: 1.4rem auto 0;
  max-width: 560px;
}
/* The dot-wave band: one continuous flow of color, no gaps — labels sit
   beneath, one per color region. */
.ct__pal-flow {
  height: 88px;
}
.ct__pal-flow :deep(canvas) { display: block; width: 100%; height: 100%; }
.ct__pal-labels {
  display: flex;
  margin-top: 0.15rem;
}
.ct__pal-labels .ct__pal-role { flex: 1; text-align: center; }
.ct__pal-role {
  font-family: var(--ap-font-mono);
  font-size: 0.6rem; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ap-ink-muted);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .ct__pal-row { animation: none; }
}

@media (max-width: 900px) {
  .ct__stage { grid-template-columns: 1fr; }
  /* Single column: the wheel flows normally — pinning it would ride over the rail. */
  .ct__scene { position: static; }
  .ct__canvas { height: clamp(280px, 62vw, 380px); }
  .ct__rail {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ct__pal { animation: none; }
}
</style>
