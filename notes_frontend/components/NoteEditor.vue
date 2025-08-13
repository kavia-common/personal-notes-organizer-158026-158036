<template>
  <div class="card stack">
    <div class="space-between">
      <h3 style="margin: 0;">{{ note?.id ? 'Edit Note' : 'New Note' }}</h3>
      <div class="row">
        <button class="btn" @click="$emit('cancel')">Close</button>
        <button class="btn btn-primary" @click="save">Save</button>
      </div>
    </div>
    <input class="input" v-model="local.title" placeholder="Title" />
    <textarea class="textarea" v-model="local.content" placeholder="Write your note..."></textarea>

    <div class="grid grid-2">
      <select class="select" v-model="local.category">
        <option :value="null">No category</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>

      <div class="stack">
        <div class="muted small">Tags</div>
        <div class="row-wrap">
          <label v-for="t in tags" :key="t.id" class="tag">
            <input type="checkbox" :value="t.id" v-model="local.tags" />
            <span>{{ t.name }}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="row">
      <label class="row">
        <input type="checkbox" v-model="local.is_archived" />
        <span>Archived</span>
      </label>
      <span class="muted small" v-if="note?.id">ID: {{ note?.id }}</span>
    </div>

    <p v-if="error" class="muted small">Error: {{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Note, Tag, Category, NotePayload } from '~/types'

const props = defineProps<{
  note?: Note | null
  tags: Tag[]
  categories: Category[]
}>()

const emit = defineEmits<{ (e: 'saved', note: Note): void; (e: 'cancel'): void }>()

const { $api } = useNuxtApp()

const local = reactive<NotePayload>({
  title: props.note?.title || '',
  content: props.note?.content || '',
  category: props.note?.category ?? null,
  tags: props.note?.tags ? [...props.note.tags] : [],
  is_archived: !!props.note?.is_archived,
})

watch(() => props.note, (n) => {
  local.title = n?.title || ''
  local.content = n?.content || ''
  local.category = n?.category ?? null
  local.tags = n?.tags ? [...n.tags] : []
  local.is_archived = !!n?.is_archived
})

const error = ref('')

async function save() {
  error.value = ''
  const payload: NotePayload = {
    title: local.title?.trim() || '(Untitled)',
    content: local.content || '',
    category: local.category ?? null,
    tags: local.tags || [],
    is_archived: !!local.is_archived,
  }
  try {
    const res = props.note?.id
      ? await $api<Note>(`/notes/${props.note.id}/`, { method: 'PATCH', body: payload })
      : await $api<Note>('/notes/', { method: 'POST', body: payload })
    emit('saved', res)
  } catch (e: any) {
    error.value = e?.data?.detail || e?.message || 'Failed to save note'
  }
}
</script>
