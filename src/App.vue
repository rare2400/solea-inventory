<script setup>
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div>
    <AppHeader />
    <div class="d-flex">
      <main class="container-custom flex-grow-1">
        <RouterView />
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped></style>
