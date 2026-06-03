<template>
    <header>
        <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container">

                <RouterLink :to="isAdmin ? '/dashboard' : '/products'" class="navbar-brand fw-bold text-light p-2">
                    <img src="@/assets/solea-logo.png" alt="Solea Inventory Logo" class="me-2 header-logo">
                </RouterLink>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <!-- Navigation -->
                    <ul class="navbar-nav me-auto text-center">
                        <li v-if="isAdmin" class="nav-item">
                            <RouterLink to="/dashboard" class="nav-link text-light rounded-2 p-2">Hem</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/products" class="nav-link text-light rounded-2 p-2">Produkter</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink to="/products/new" class="nav-link text-light rounded-2 p-2">Lägg till produkt</RouterLink>
                        </li>
                        <!-- Log out button under navigationlinks on small screens -->
                        <li class="nav-item d-lg-none logout-mobile">
                            <button class="btn btn-link nav-link text-light p-2 w-100" @click="handleLogout">
                                Logga ut
                            </button>
                        </li>
                    </ul>

                    <!-- Log out button the right on wide screens -->
                    <ul class="navbar-nav ms-auto d-none d-lg-flex">
                        <li class="nav-item">
                            <button class="btn btn-link nav-link text-light p-2" @click="handleLogout">
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
.header-logo {
    height: 40px;
}

/* Override Bootstrap's default navbar color with our primary color */
nav {
    background-color: var(--primary) !important;
}

.btn-link {
    color: #fff;
    text-decoration: none;
    padding: 0;
}

.nav-link:hover,
.btn-link:hover {
    background-color: var(--primary-hover);
    text-decoration: underline;
}

/* Border-top on log out button on mobile to visually separate it from the navigation links */
.logout-mobile {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    margin-top: 0.5rem;
    padding-top: 0.5rem;
}

@media screen and (min-width: 900px) {
    .header-logo {
    height: 50px;
}
}
</style>