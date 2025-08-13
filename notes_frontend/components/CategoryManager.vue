<template>
  <div class="card stack">
    <div class="space-between">
      <h3 style="margin: 0;">Categories</h3>
      <span class="muted small">{{ categories.length }}</span>
    </div>
    <div class="row">
      <input class="input" v-model="draft" placeholder="New category name" @keyup.enter="createCategory" />
      <button class="btn btn-primary" @click="createCategory">Add</button>
    </div>
    <div class="list">
      <div v-for="c in categories" :key="c.id" class="list-item">
        <div>{{ c.name }}</div>
        <div class="row">
          <button class="btn" @click="rename(c)">Rename</button>
          <button class="btn btn-danger" @click="remove(c)">Delete</button>
        </div>
      </div>
    </div>
    <p v-if="error" class="muted small">Error: {{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types'

const emit = defineEmits<{ (e: 'updated'): void }>()
const { $api } = useNuxtApp()

const categories = ref<Category[]>([])
const draft = ref('')
const error = ref('')

async function list() {
  try {
    categories.value = await $api<Category[]>('/categories/')
  } catch (e: any) {
    error.value = e?.message || 'Failed to load categories'
  }
}

async function createCategory() {
  error.value = ''
  const name = draft.value.trim()
  if (!name) return
  try {
    await $api<Category>('/categories/', { method: 'POST', body: { name } })
    draft.value = ''
    await list()
    emit('updated')
  } catch (e: any) {
    error.value = e?.message || 'Failed to create category'
  }
}

async function rename(c: Category) {
  const name = prompt('New category name', c.name)
  if (!name) return
  try {
    await $api<Category>(`/categories/${c.id}/`, { method: 'PATCH', body: { name } })
    await list()
    emit('updated')
  } catch (e: any) {
    error.value = e?.message || 'Failed to rename category'
  }
}

async function remove(c: Category) {
  if (!confirm(`Delete category "${c.name}"?`)) return
  try {
    await $api<void>(`/categories/${c.id}/`, { method: 'DELETE' })
    await list()
    emit('updated')
  } catch (e: any) {
    error.value = e?.message || 'Failed to delete category'
  }
}

onMounted(list)
</script>
