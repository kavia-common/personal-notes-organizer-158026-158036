<template>
  <div class="card stack">
    <div class="space-between">
      <h3 style="margin: 0;">Tags</h3>
      <span class="muted small">{{ tags.length }}</span>
    </div>
    <div class="row">
      <input class="input" v-model="draft" placeholder="New tag name" @keyup.enter="createTag" />
      <button class="btn btn-primary" @click="createTag">Add</button>
    </div>
    <div class="list">
      <div v-for="t in tags" :key="t.id" class="list-item">
        <div class="row">
          <span class="tag"><span class="tag-dot" /> {{ t.name }}</span>
        </div>
        <div class="row">
          <button class="btn" @click="rename(t)">Rename</button>
          <button class="btn btn-danger" @click="remove(t)">Delete</button>
        </div>
      </div>
    </div>
    <p v-if="error" class="muted small">Error: {{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Tag } from '~/types'

const emit = defineEmits<{ (e: 'updated'): void }>()
const { $api } = useNuxtApp()

const tags = ref<Tag[]>([])
const draft = ref('')
const error = ref('')

async function list() {
  try {
    tags.value = await $api<Tag[]>('/tags/')
  } catch (e: any) {
    error.value = e?.message || 'Failed to load tags'
  }
}

async function createTag() {
  error.value = ''
  const name = draft.value.trim()
  if (!name) return
  try {
    await $api<Tag>('/tags/', { method: 'POST', body: { name } })
    draft.value = ''
    await list()
    emit('updated')
  } catch (e: any) {
    error.value = e?.data?.detail || e?.message || 'Failed to create tag'
  }
}

async function rename(t: Tag) {
  const name = prompt('New tag name', t.name)
  if (!name) return
  try {
    await $api<Tag>(`/tags/${t.id}/`, { method: 'PATCH', body: { name } })
    await list()
    emit('updated')
  } catch (e: any) {
    error.value = e?.message || 'Failed to rename tag'
  }
}

async function remove(t: Tag) {
  if (!confirm(`Delete tag "${t.name}"?`)) return
  try {
    await $api<void>(`/tags/${t.id}/`, { method: 'DELETE' })
    await list()
    emit('updated')
  } catch (e: any) {
    error.value = e?.message || 'Failed to delete tag'
  }
}

onMounted(list)
</script>
