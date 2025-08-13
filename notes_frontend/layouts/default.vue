<template>
  <div class="app-shell">
    <header class="app-header">
      <NavBar />
    </header>
    <div class="app-main">
      <aside class="sidebar">
        <SidebarFilters @filter-change="onFilterChange" />
      </aside>
      <main class="content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

function onFilterChange(payload: { search?: string; tag?: number | null; category?: number | null; archived?: boolean | null }) {
  const query: Record<string, any> = {
    ...(payload.search ? { search: payload.search } : {}),
    ...(payload.tag ? { tag: payload.tag } : {}),
    ...(payload.category ? { category: payload.category } : {}),
  }
  if (typeof payload.archived === 'boolean') query.archived = payload.archived ? '1' : '0'
  router.push({ path: '/', query })
}
</script>
