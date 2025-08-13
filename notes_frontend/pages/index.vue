<template>
  <div class="stack-lg">
    <div class="space-between">
      <div class="row">
        <input class="input" style="min-width: 260px;" v-model="searchLocal" placeholder="Search..." @keyup.enter="applySearch" />
        <button class="btn" @click="applySearch"><span class="kbd">Enter</span>&nbsp;Search</button>
      </div>
      <div class="row">
        <button class="btn" @click="reload">Refresh</button>
        <button class="btn btn-primary" @click="createNew">New Note</button>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: 1fr minmax(320px, 480px); align-items: start;">
      <div class="stack">
        <div v-if="loading" class="muted small">Loading notes...</div>
        <div v-else-if="notes.length === 0" class="card">
          <p class="muted">No notes found. Create one!</p>
        </div>
        <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px,1fr));" v-else>
          <NoteCard
            v-for="n in notes"
            :key="n.id"
            :note="n"
            :tags-index="tagsIndex"
            :categories-index="categoriesIndex"
            @edit="selectNote"
            @delete="deleteNote"
          />
        </div>
      </div>

      <div class="stack">
        <NoteEditor
          v-if="editorVisible"
          :note="selected"
          :tags="tags"
          :categories="categories"
          @saved="onSaved"
          @cancel="closeEditor"
        />
        <div v-else class="card muted small">Select a note to edit, or click "New Note".</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

import type { Note, Tag, Category } from '~/types'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

const searchLocal = ref((route.query.search as string) || '')
const notes = ref<Note[]>([])
const tags = ref<Tag[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const editorVisible = ref(false)
const selected = ref<Note | null>(null)

const tagsIndex = computed<Record<number, Tag>>(() => Object.fromEntries(tags.value.map((t) => [t.id, t])))
const categoriesIndex = computed<Record<number, Category>>(() => Object.fromEntries(categories.value.map((c) => [c.id, c])))

function buildQuery() {
  const params = new URLSearchParams()
  if (route.query.search) params.set('search', String(route.query.search))
  if (route.query.tag) params.set('tag', String(route.query.tag))
  if (route.query.category) params.set('category', String(route.query.category))
  if (route.query.archived) params.set('archived', String(route.query.archived))
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

async function reload() {
  loading.value = true
  try {
    const [n, t, c] = await Promise.all([
      $api<Note[]>(`/notes/${buildQuery()}`),
      $api<Tag[]>('/tags/'),
      $api<Category[]>('/categories/'),
    ])
    notes.value = n
    tags.value = t
    categories.value = c
  } finally {
    loading.value = false
  }
}

function selectNote(n: Note) {
  selected.value = n
  editorVisible.value = true
}
function createNew() {
  selected.value = null
  editorVisible.value = true
}
function closeEditor() {
  editorVisible.value = false
}

async function onSaved(saved: Note) {
  // Update or insert
  const idx = notes.value.findIndex((x) => x.id === saved.id)
  if (idx >= 0) notes.value[idx] = saved
  else notes.value.unshift(saved)
  editorVisible.value = false
}

async function deleteNote(n: Note) {
  if (!confirm(`Delete note "${n.title || '(Untitled)'}"?`)) return
  await $api<void>(`/notes/${n.id}/`, { method: 'DELETE' })
  notes.value = notes.value.filter((x) => x.id !== n.id)
}

function applySearch() {
  router.push({ query: { ...route.query, search: searchLocal.value || undefined } })
}

watch(() => route.query, reload, { deep: true, immediate: true })
</script>
