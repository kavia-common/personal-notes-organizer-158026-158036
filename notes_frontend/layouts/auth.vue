<template>
  <div class="app-shell">
    <header class="app-header">
      <NavBar />
    </header>
    <main class="content" style="max-width: 560px; margin: 0 auto;">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>
