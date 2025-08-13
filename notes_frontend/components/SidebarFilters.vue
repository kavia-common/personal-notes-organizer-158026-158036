<template>
  <div class="stack-lg">
    <div class="card stack">
      <div class="space-between">
        <h3 style="margin: 0;">Filters</h3>
        <button class="btn" @click="clearFilters">Clear</button>
      </div>
      <input class="input" v-model="local.search" placeholder="Search notes..." @keyup.enter="emitChange" />
      <div class="grid grid-2">
        <select class="select" v-model="local.category" @change="emitChange">
          <option :value="null">All categories</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
        <select class="select" v-model="local.tag" @change="emitChange">
          <option :value="null">All tags</option>
          <option v-for="t in tags" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
      </div>
      <div class="row">
        <label class="row">
          <input type="checkbox" v-model="local.archived" @change="emitChange" />
          <span>Show archived</span>
        </label>
      </div>
    </div>

    <div class="stack">
      <TagManager @updated="loadTags" />
      <CategoryManager @updated="loadCategories" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category, Tag } from '~/types'

const emit = defineEmits<{
  (e: 'filter-change', payload: { search?: string; tag?: number | null; category?: number | null; archived?: boolean | null }): void
}>()

const route = useRoute()
const { $api } = useNuxtApp()

const local = reactive({
  search: (route.query.search as string) || '',
  tag: route.query.tag ? Number(route.query.tag) : null as number | null,
  category: route.query.category ? Number(route.query.category) : null as number | null,
  archived: route.query.archived === '1' ? true : false,
})

const tags = ref<Tag[]>([])
const categories = ref<Category[]>([])

async function loadTags() {
  try {
    tags.value = await $api<Tag[]>('/tags/')
  } catch {}
}
async function loadCategories() {
  try {
    categories.value = await $api<Category[]>('/categories/')
  } catch {}
}
function emitChange() {
  emit('filter-change', { ...local })
}
function clearFilters() {
  local.search = ''
  local.tag = null
  local.category = null
  local.archived = false
  emitChange()
}

onMounted(() => {
  loadTags()
  loadCategories()
})
</script>
