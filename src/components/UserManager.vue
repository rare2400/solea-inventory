<template>
    <div>
        <!-- Header and button to add user -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="fw-light mb-0">Användarhantering</h4>
            <button class="btn btn-sm solea-btn" @click="openForm()">+ Lägg till användare</button>
        </div>

        <!-- Loading and error message -->
        <div v-if="loading" class="text-muted">Hämtar användare...</div>
        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

        <!-- User table -->
        <div v-else class="table-responsive">
            <table class="table table-hover align-middle">
                <thead class="solea-thead">
                    <tr>
                        <th>Namn</th>
                        <th class="d-none d-md-table-cell">E-post</th>
                        <th>Roll</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Loop through users and display their info -->
                    <tr v-for="user in users" :key="user._id">
                        <td>{{ user.firstname }} {{ user.lastname }}</td>
                        <td class="d-none d-md-table-cell">{{ user.email }}</td>
                        <td>
                            <span class="badge" :class="user.role === 'admin' ? 'solea-badge' : 'bg-secondary'">
                                {{ user.role }}
                            </span>
                        </td>
                        <!-- Edit and delete buttons -->
                        <td class="text-end d-flex gap-2 justify-content-end">
                            <button class="btn btn-sm solea-btn-outline" @click="openForm(user)">Redigera</button>
                            <button class="btn btn-sm btn-outline-danger" @click="handleDelete(user)">Ta
                                bort</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Form modal for adding/editing users -->
        <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
            <section class="modal-box">

                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2 class="mb-0">{{ editingUser ? "Redigera användare" : "Lägg till användare" }}</h2>
                    <button class="btn-close" @click="closeForm"></button>
                </div>

                <!-- Form error message -->
                <div v-if="formError" class="alert alert-danger py-2">{{ formError }}</div>

                <!-- Form -->
                <form @submit.prevent="handleSubmit">
                    <div class="row g-3 mb-3">
                        <div class="col-6">
                            <label class="form-label">Förnamn</label>
                            <input v-model="form.firstname" type="text" class="form-control" required />
                        </div>
                        <div class="col-6">
                            <label class="form-label">Efternamn</label>
                            <input v-model="form.lastname" type="text" class="form-control" required />
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">E-post</label>
                        <input v-model="form.email" type="email" class="form-control" required />
                    </div>

                    <!-- Show password field only when adding a new user -->
                    <div v-if="!editingUser" class="mb-3">
                        <label class="form-label">Lösenord</label>
                        <input v-model="form.password" type="password" class="form-control" required minlength="6" />
                    </div>

                    <div class="mb-4">
                        <label class="form-label">Roll</label>
                        <select v-model="form.role" class="form-select" required>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <!-- Dynamic submit depending on loading, editing or adding and cancel button -->
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn solea-btn flex-grow-1" :disabled="formLoading">
                            {{ formLoading ? "Sparar..." : editingUser ? "Spara ändringar" : "Lägg till" }}
                        </button>
                        <button type="button" class="btn solea-btn-outline" @click="closeForm">Avbryt</button>
                    </div>
                </form>

            </section>
        </div>

        <!-- Bekräftelsemodal för borttagning -->
        <div v-if="showConfirm" class="modal-overlay" @click.self="showConfirm = false">
            <section class="modal-box" style="max-width: 400px;">
                <h3 class="mb-2">Ta bort användare</h3>
                <p class="text-muted mb-4">
                Är du säker på att du vill ta bort <strong>{{ userToDelete?.firstname }} {{ userToDelete?.lastname }}</strong>? 
                Detta går inte att ångra.
                </p>
                <div class="d-flex gap-2 justify-content-end">
                    <button class="btn solea-btn-outline" @click="showConfirm = false">Avbryt</button>
                    <button class="btn btn-danger" :disabled="deleteLoading" @click="confirmDelete">
                        {{ deleteLoading ? 'Tar bort...' : 'Ta bort' }}
                    </button>
                </div>
            </section>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth } from '../services/api.js'

// State for users, loading, error, form visibility, editing user, form data and form errors
const users = ref([])
const loading = ref(false)
const error = ref(null)
const showForm = ref(false)
const editingUser = ref(null)
const formLoading = ref(false)
const formError = ref(null)
const showConfirm = ref(false)
const userToDelete = ref(null)
const deleteLoading = ref(false)

// Form data for adding a new user
const form = ref({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "staff"
})

// Fetch users from API
async function fetchUsers() {
    loading.value = true
    try {
        users.value = await auth.getUsers()
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}

// Open form for adding or editing a user
function openForm(user = null) {
    editingUser.value = user
    formError.value = null

    // If editing, populate form with user data
    if (user) {
        form.value = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: "",
            role: user.role
        }
    } else {
        // Reset form to default values
        form.value = { 
            firstname: "", 
            lastname: "", 
            email: "", 
            password: "", 
            role: "staff" 
        }
    }
    showForm.value = true
}

// Close form and reset editing user
function closeForm() {
    showForm.value = false
    editingUser.value = null
}

// Handle form submission
async function handleSubmit() {
    formLoading.value = true
    formError.value = null
    try {
        // If editing, update user
        if (editingUser.value) {
            await auth.updateUser(editingUser.value._id, form.value)
            const index = users.value.findIndex(u => u._id === editingUser.value._id)
            if (index !== -1) users.value[index] = { ...users.value[index], ...form.value }
        } else {

            // If adding, register new user and refresh list
            await auth.register(form.value)
            await fetchUsers()
        }

        // Close form after successful submission
        closeForm()
    } catch (err) {
        formError.value = err.message
    } finally {
        formLoading.value = false
    }
}

// Handle delete button click by showing confirmation modal
async function handleDelete(user) {
    userToDelete.value = user
    showConfirm.value = true
}

// Confirm deletion of user
async function confirmDelete() {
    deleteLoading.value = true
    try {
        // Delete user and remove from list
        await auth.deleteUser(userToDelete.value._id)
        users.value = users.value.filter(u => u._id !== userToDelete.value._id)

        // Close confirmation modal
        showConfirm.value = false
        userToDelete.value = null
    } catch (err) {
        error.value = err.message
    } finally {
        deleteLoading.value = false
    }
}

// Fetch users when component is mounted
onMounted(fetchUsers)
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
    padding: 1rem;
}

.modal-box {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
}

.solea-thead th {
    background-color: #55584B;
    color: #fff;
}
</style>