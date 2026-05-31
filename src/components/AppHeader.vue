<template>
    <header>
        <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container">

                <RouterLink to="/" class="navbar-brand fw-bold text-light">Solea</RouterLink>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <!-- Navigation -->
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <RouterLink to="/dashboard" class="nav-link text-light">Hem</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/products" class="nav-link text-light">Produkter</RouterLink>
                        </li>
                        <li v-if="isAdmin" class="nav-item">
                            <RouterLink to="/products/new" class="nav-link text-light">Lägg till produkt</RouterLink>
                        </li>
                        <!-- Log out button under navigationlinks on small screens -->
                        <li class="nav-item d-lg-none logout-mobile">
                            <button class="btn btn-link nav-link text-light" @click="handleLogout">
                                Logga ut
                            </button>
                        </li>
                    </ul>

                    <!-- Log out button the right on wide screens -->
                    <ul class="navbar-nav ms-auto d-none d-lg-flex">
                        <li class="nav-item">
                            <button class="btn btn-link nav-link text-light" @click="handleLogout">
                                Logga ut
                            </button>
                        </li>
                    </ul>
                </div>

            </div>
        </nav>
    </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Checks if the user has the "admin" role stored in localStorage
const isAdmin = computed(() => localStorage.getItem("role") === "admin")

// Empties localStorage and redirects to login page
function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("firstname")
    router.push("/logga-in")
}
</script>

<style scoped>
/* Override Bootstrap's default navbar color with our primary color */
nav {
    background-color: var(--primary) !important;
}

.btn-link {
    color: #fff;
    text-decoration: none;
    padding: 0;
}

.btn-link:hover {
    color: #ccc;
}

/* Border-top on log out button on mobile to visually separate it from the navigation links */
.logout-mobile {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    margin-top: 0.5rem;
    padding-top: 0.5rem;
}
</style>