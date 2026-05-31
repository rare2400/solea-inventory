<script setup>
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import { RouterView } from 'vue-router';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const isLoggedIn = computed(() => route.path !== "/logga-in")
</script>

<template>
  <div>
    <AppHeader v-if="isLoggedIn" />
    <div class="d-flex">
      <main class="container-custom flex-grow-1">
        <RouterView />
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped></style>
