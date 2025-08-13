<template>
  <div class="card stack" :style="{ opacity: note.is_archived ? 0.7 : 1 }">
    <div class="space-between">
      <div class="row-wrap">
        <strong>{{ note.title || '(Untitled)' }}</strong>
        <template v-if="categoryName">
          <span class="tag"><span class="tag-dot" /> {{ categoryName }}</span>
        </template>
      </div>
      <div class="row">
        <button class="btn" @click="$emit('edit', note)">Edit</button>
        <button class="btn btn-danger" @click="$emit('delete', note)">Delete</button>
      </div>
    </div>
    <div class="muted small">
      <span>{{ new Date(note.updated_at || note.created_at || '').toLocaleString() }}</span>
      <span v-if="note.is_archived" class="tag" style="margin-left: 8px;">Archived</span>
    </div>
    <div class="row-wrap">
      <span v-for="t in tagNames" :key="t" class="tag"><span class="tag-dot" /> {{ t }}</span>
    </div>
    <p class="muted small" v-if="!note.content">No content</p>
    <p v-else style="margin: 0; white-space: pre-line; max-height: 8lh; overflow: hidden;">{{ preview }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Note, Tag, Category } from '~/types'

const props = defineProps<{
  note: Note
  tagsIndex: Record<number, Tag>
  categoriesIndex: Record<number, Category>
}>()

const tagNames = computed(() => (props.note.tags || []).map((id) => props.tagsIndex[id]?.name).filter(Boolean) as string[])
const categoryName = computed(() => (props.note.category ? props.categoriesIndex[props.note.category]?.name : null))
const preview = computed(() => (props.note.content || '').slice(0, 300))
</script>
