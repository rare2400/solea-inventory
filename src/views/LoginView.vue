<template>
    <div class="d-flex justify-content-center align-items-center vh-100">

        <div class="card card-solea p-4">

            <!-- Logo / Title -->
            <div class="text-center mb-4">
                <h1 class="fw-light">Solea</h1>
                <p class="text-muted">Inventory System</p>
            </div>

            <!-- Error -->
            <div v-if="error" class="alert alert-danger py-2">
                {{ error }}
            </div>

            <!-- -Log in form -->
            <form @submit.prevent="handleLogin">

                <!-- Email -->
                <div class="mb-3">
                    <label class="form-label">E-post</label>
                    <input v-model="form.email" type="email" class="form-control" />
                </div>

                <!-- Password -->
                <div class="mb-4">
                    <label class="form-label">Lösenord</label>
                    <input v-model="form.password" type="password" class="form-control" />
                </div>

                <!-- Button -->
                <button type="submit" class="btn btn-solea w-100" :disabled="loading">
                    <span v-if="loading">Loggar in...</span>
                    <span v-else>Logga in</span>
                </button>

            </form>

        </div>

    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../services/api";

const router = useRouter();

// Formdata
const form = ref({
    email: "",
    password: ""
})

// States for error and loading
const error = ref(null);
const loading = ref(false);

// Handle login
async function handleLogin() {
    error.value = null;
    loading.value = true;

    try {
        const data = await auth.login(form.value)

        // Save token to localStorage
        localStorage.setItem("token", data.token)

        // Get user profile
        const profile = await auth.getProfile()

        // Save user info to localStorage
        localStorage.setItem("firstname", profile.firstname)
        localStorage.setItem("role", profile.role)

        router.push("/dashboard")

    } catch (err) {
        error.value = "Felaktig e-post eller lösenord";
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.card-solea {
    width: 350px;
}

.btn-solea {
    background-color: var(--primary);
    color: var(--primary-light);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: background-color 0.3s ease;
}

.btn-solea:hover {
    background-color: var(--primary-hover);
    color: #fff;
}
</style>