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
            <h2 class="card-title">Produkter</h2>
            <p class="card-text text-muted">Visa och hantera lagrets produkter.</p>
            <RouterLink to="/products" class="btn solea-btn">Gå till produkter</RouterLink>
        </div>
      </section>
      <section class="col-12 col-md-6">
        <div class="card card-body h-100 shadow-sm">
            <h2 class="card-title">Lägg till produkt</h2>
            <p class="card-text text-muted">Lägg till en ny produkt i lagret.</p>
            <RouterLink to="/products/new" class="btn solea-btn">Lägg till</RouterLink>
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