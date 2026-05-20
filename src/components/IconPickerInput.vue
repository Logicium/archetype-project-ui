<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as LucideIcons from 'lucide-vue-next'
import { ChevronDown, Search, X } from 'lucide-vue-next'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

// All exportable icon components: uppercase names that are functions
const ALL_ICON_NAMES: string[] = Object.keys(LucideIcons)
  .filter(k => /^[A-Z]/.test(k) && typeof (LucideIcons as Record<string, unknown>)[k] === 'function')
  .sort()

const open  = ref(false)
const query = ref('')
const searchEl = ref<HTMLInputElement | null>(null)
const rootEl   = ref<HTMLElement | null>(null)

const filtered = computed(() => {
  const q = query.value.toLowerCase()
  return q ? ALL_ICON_NAMES.filter(n => n.toLowerCase().includes(q)) : ALL_ICON_NAMES
})

const currentComponent = computed(() =>
  props.modelValue ? ((LucideIcons as Record<string, unknown>)[props.modelValue] ?? null) : null
)

function select(name: string) {
  emit('update:modelValue', name)
  open.value = false
  query.value = ''
}

function toggle() {
  open.value = !open.value
  if (open.value) {
    query.value = ''
    setTimeout(() => searchEl.value?.focus(), 40)
  }
}

function onClickOutside(e: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<template>
  <div ref="rootEl" class="ip">
    <button type="button" class="ip__trigger" @click="toggle">
      <component :is="currentComponent" v-if="currentComponent" :size="15" class="ip__cur-icon" />
      <span v-else class="ip__placeholder">Pick icon…</span>
      <span v-if="modelValue" class="ip__name">{{ modelValue }}</span>
      <ChevronDown :size="12" class="ip__chevron" :class="{ 'is-open': open }" />
    </button>

    <div v-if="open" class="ip__panel">
      <!-- Search -->
      <div class="ip__search-row">
        <Search :size="13" class="ip__search-icon" />
        <input
          ref="searchEl"
          v-model="query"
          type="text"
          class="ip__search"
          placeholder="Search icons…"
          @keydown.escape="open = false"
        />
        <button v-if="query" type="button" class="ip__clear" @click="query = ''">
          <X :size="12" />
        </button>
      </div>

      <!-- Grid -->
      <div class="ip__grid" role="listbox">
        <button
          v-for="name in filtered"
          :key="name"
          type="button"
          role="option"
          class="ip__item"
          :class="{ 'is-active': name === modelValue }"
          :title="name"
          :aria-selected="name === modelValue"
          @click="select(name)"
        >
          <component :is="(LucideIcons as Record<string, unknown>)[name]" :size="17" />
        </button>
      </div>

      <p v-if="filtered.length === 0" class="ip__empty">No icons match "{{ query }}"</p>
    </div>
  </div>
</template>

<style scoped>
.ip { position: relative; display: inline-block; }

/* ── Trigger ─────────────────────────────────────────────────────────────── */
.ip__trigger {
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.35rem 0.55rem;
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius);
  background: var(--ap-surface);
  color: var(--ap-ink);
  font-size: 0.82rem;
  cursor: pointer;
  transition: border-color 140ms;
  white-space: nowrap;
  min-width: 8rem;
}
.ip__trigger:hover { border-color: var(--ap-primary); }
.ip__cur-icon { flex-shrink: 0; }
.ip__placeholder { color: var(--ap-ink-muted); }
.ip__name { font-weight: 500; flex: 1; overflow: hidden; text-overflow: ellipsis; }
.ip__chevron { flex-shrink: 0; transition: transform 200ms; color: var(--ap-ink-muted); }
.ip__chevron.is-open { transform: rotate(180deg); }

/* ── Panel ───────────────────────────────────────────────────────────────── */
.ip__panel {
  position: fixed; top: 0; left: 0; z-index: 9999;
  width: 296px;
  background: red;
  border: 1px solid var(--ap-line);
  border-radius: var(--ap-radius);
  box-shadow: 0 8px 28px rgba(0,0,0,0.14);
  overflow: hidden;
}

.ip__search-row {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 0.65rem;
  border-bottom: 1px solid var(--ap-line);
}
.ip__search-icon { color: var(--ap-ink-muted); flex-shrink: 0; }
.ip__search {
  flex: 1; border: none; outline: none;
  background: transparent; font-size: 0.82rem; color: var(--ap-ink);
}
.ip__search::placeholder { color: var(--ap-ink-muted); }
.ip__clear {
  display: flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%; border: none;
  background: color-mix(in srgb, var(--ap-ink) 10%, transparent);
  color: var(--ap-ink-muted); cursor: pointer; flex-shrink: 0;
}

.ip__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(34px, 1fr));
  gap: 2px; padding: 0.5rem;
  max-height: 232px; overflow-y: auto;
}
.ip__item {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px;
  border: 1px solid transparent;
  border-radius: var(--ap-radius, 4px);
  background: transparent; color: var(--ap-ink);
  cursor: pointer;
  transition: background 100ms, border-color 100ms, color 100ms;
}
.ip__item:hover {
  background: color-mix(in srgb, var(--ap-primary) 10%, transparent);
  border-color: var(--ap-line);
}
.ip__item.is-active {
  background: color-mix(in srgb, var(--ap-primary) 15%, transparent);
  border-color: var(--ap-primary);
  color: var(--ap-primary);
}

.ip__empty {
  padding: 1.25rem; text-align: center;
  color: var(--ap-ink-muted); font-size: 0.82rem; margin: 0;
}
</style>
