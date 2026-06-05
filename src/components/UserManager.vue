<template>
    <div>
        <!-- Header and button to add user -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="fw-light mb-0">Användarhantering</h4>
            <button class="btn btn-sm solea-button" @click="openForm()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-person-fill-add icon" viewBox="0 0 16 16">
                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                </svg> Lägg till användare
            </button>
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
                    <tr v-for="user in users" 
                        :key="user._id">
                        <td>{{ user.firstname }} {{ user.lastname }}</td>
                        <td class="d-none d-md-table-cell">{{ user.email }}</td>
                        <td>
                            <span class="badge" :class="user.role === 'admin' ? 'solea-badge' : 'bg-secondary'">
                                {{ user.role }}
                            </span>
                        </td>
                        <!-- Edit and delete buttons -->
                        <td class="text-end d-flex gap-2 justify-content-end">
                            <button class="btn btn-sm solea-button-outline" @click="openForm(user)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                </svg>
                                <span class="d-none d-md-inline mx-1">Redigera</span>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" @click="handleDelete(user)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                                </svg>
                                <span class="d-none d-md-inline mx-1">Ta bort</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Form modal for adding/editing users -->
        <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
            <section class="modal-box">

                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2 class="mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-fill icon" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                        </svg>
                        {{ editingUser ? "Redigera användare" : "Lägg till användare" }}
                    </h2>
                    <button class="btn-close" @click="closeForm"></button>
                </div>

                <!-- Form error message -->
                <div v-if="formError" class="alert alert-danger py-2">{{ formError }}</div>

                <!-- Form -->
                <form @submit.prevent="handleSubmit">
                    <div class="row g-3 mb-3">
                        <div class="col-6">
                            <label class="form-label">Förnamn</label>
                            <input v-model="form.firstname" 
                                type="text" 
                                class="form-control" 
                                :class="{ 'is-invalid' : errors.firstname }"
                                @blur="validateField('firstname')"
                            />
                            <div class="invalid-feedback">
                                {{ errors.firstname }}
                            </div>
                        </div>
                        <div class="col-6">
                            <label class="form-label">Efternamn</label>
                            <input v-model="form.lastname" 
                                type="text" 
                                class="form-control" 
                                :class="{ 'is-invalid' : errors.lastname }"
                                @blur="validateField('lastname')"
                            />
                            <div class="invalid-feedback">
                                {{ errors.lastname }}
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">E-post</label>
                        <input v-model="form.email" 
                            type="email" 
                            class="form-control" 
                            :class="{ 'is-invalid' : errors.email }"
                            @blur="validateField('email')"
                        />
                        <div class="invalid-feedback">
                            {{ errors.email }}
                        </div>
                    </div>

                    <!-- Show password field only when adding a new user -->
                    <div v-if="!editingUser" class="mb-3">
                        <label class="form-label">Lösenord</label>
                        <input v-model="form.password" 
                            type="password" 
                            class="form-control"
                            :class="{ 'is-invalid' : errors.password }"
                            @blur="validateField('password')"
                        />
                        <div class="invalid-feedback">
                            {{ errors.password }}
                        </div>
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
                        <button type="submit" class="btn solea-button flex-grow-1" :disabled="formLoading">
                            {{ formLoading ? "Sparar..." : editingUser ? "Spara ändringar" : "Lägg till" }}
                        </button>
                        <button type="button" class="btn solea-button-outline" @click="closeForm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                            Avbryt
                        </button>
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
                    <button class="btn solea-button-outline" @click="showConfirm = false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                        Avbryt
                    </button>
                    <button class="btn btn-danger" :disabled="deleteLoading" @click="confirmDelete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
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

// Error state for form validation
const errors = ref({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: ""
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

        errors.value = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            role: ""
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
        
        errors.value = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            role: ""
        }
    }
    showForm.value = true
}

// Close form and reset editing user
function closeForm() {
    showForm.value = false
    editingUser.value = null
}

// Validate individual form fields and set error messages
function validateField(field) {
    errors.value[field] = ""

    switch (field) {
        case "firstname":
            if (!form.value.firstname.trim()) {
                errors.value.firstname = "Fyll i förnamn"
            }
            break

        case "lastname":
            if (!form.value.lastname.trim()) {
                errors.value.lastname = "Fyll i efternamn"
            }
            break

        case "email":
            if (!form.value.email.trim()) {
                errors.value.email = "E-post är obligatorisk"
            }
            break

        case "password":
            if (!editingUser.value) {
                if (!form.value.password) {
                    errors.value.password = "Välj ett lösenord"
                } else if (form.value.password.length < 6) {
                    errors.value.password =
                        "Lösenordet måste vara minst 6 tecken"
                }
            }
            break
    }
}

// Validate entire form by checking each field and ensuring there are no error messages
function validateForm() {
    ["firstname", "lastname", "email", "password", "role"].forEach(validateField)
    return Object.values(errors.value).every(e => e === "") 
}

// Handle form submission
async function handleSubmit() {
    if (!validateForm()) return

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
.solea-thead th {
    background-color: #55584B;
    color: #fff;
}
</style>