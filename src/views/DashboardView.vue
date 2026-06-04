<template>
  <div class="container py-5">

    <!-- Welcome message and current date -->
    <section class="mb-5">
      <h1 class="fw-light">Välkommen, {{ firstname }}!</h1>
      <p class="text-muted">{{ currentDate }}</p>
    </section>

    <!-- Cards and links to product management -->
    <div class="row g-4 mb-5">
      <section class="col-12 col-md-6">
        <div class="card card-body h-100 shadow-sm">
          <div class="d-flex justify-content-between align-items-center">
            <h2 class="card-title mt-2">Produkter</h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#55584B" class="bi bi-box-seam me-3" viewBox="0 0 16 16">
              <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
            </svg>
          </div>
            <p class="card-text text-muted">Visa och hantera lagrets produkter.</p>
            <RouterLink to="/products" class="btn solea-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-in-right icon" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
                <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
              </svg>
              Gå till produkter
            </RouterLink>
        </div>
      </section>
      <section class="col-12 col-md-6">
        <div class="card card-body h-100 shadow-sm">
          <div class="d-flex justify-content-between align-items-center">
            <h2 class="card-title">Lägg till produkt</h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#55584B" class="bi bi-plus-square me-3" viewBox="0 0 16 16">
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg>
          </div>
            <p class="card-text text-muted">Lägg till en ny produkt i lagret.</p>
            <RouterLink to="/products/new" class="btn solea-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-plus icon" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
              </svg>
              Lägg till
            </RouterLink>
        </div>
      </section>
    </div>

    <!-- User management (admin only) -->
    <UserManager/>

  </div>
</template>

<script setup>
import UserManager from '../components/UserManager.vue'

// Get the user's name and role from localStorage
const firstname = localStorage.getItem("firstname") || ""

// Format the current date to Swedish standard
const currentDate = new Date().toLocaleDateString("sv-SE", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
})
</script>

<style scoped>
.card-title {
    font-size: 1.5rem;
}
</style>