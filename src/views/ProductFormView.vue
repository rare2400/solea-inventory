<template>
  <div class="container py-4" style="max-width: 600px;">

    <!-- Page-header with back-button -->
    <div class="d-flex align-items-center gap-3 mb-4">
      <button class="btn solea-button-outline btn-sm" @click="router.back()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left icon" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
        </svg>
        Tillbaka
      </button>

      <!-- Dynamic title based on editing or adding product -->
      <h2 class="fw-light mb-0">{{ isEditing ? "Redigera produkt" : "Lägg till produkt" }} </h2>
    </div>


    <!-- Error message -->
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" novalidate>

      <!-- Name -->
      <div class="mb-3">
        <label class="form-label">Namn <span class="text-danger">*</span></label>
        <input           
          v-model="form.name"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.name }"
          placeholder="t.ex. Silverring klassisk"
          @blur="validateField('name')" 
        />
        <p class="invalid-feedback">{{ errors.name }}</p>
      </div>

      <!-- Description -->
      <div class="mb-3">
        <label class="form-label">Beskrivning</label>
        <textarea 
          v-model="form.description" 
          class="form-control" 
          :class="{ 'is-invalid': errors.description }"
          rows="3"
          @blur="validateField('description')"
          placeholder="Beskriv produkt"
        ></textarea>
        <p class="invalid-feedback">{{ errors.description }}</p>
      </div>

      <!-- Price and Stock -->
      <div class="row g-3 mb-3">
        <div class="col-6">
          <label class="form-label">Pris (kr) <span class="text-danger">*</span></label>
          <input 
            v-model.number="form.price" 
            type="number" 
            step="0.01" 
            class="form-control"
            :class="{ 'is-invalid': errors.price }"
            @blur="validateField('price')"
            placeholder="t. ex. 399"
          />
          <p class="invalid-feedback">{{ errors.price }}</p>
        </div>
        <div class="col-6">
          <label class="form-label">Antal i lager <span class="text-danger">*</span></label>
          <input
           v-model.number="form.stock" 
           type="number" 
           class="form-control"
           :class="{ 'is-invalid': errors.stock }"
            @blur="validateField('stock')"
            placeholder="Lagersaldo"
          />
          <p class="invalid-feedback">{{ errors.stock }}</p>
        </div>
      </div>

      <!-- SKU and Shelf -->
      <div class="row g-3 mb-3">
        <div class="col-6">
          <label class="form-label">SKU <span class="text-danger">*</span></label>
          <input 
            v-model="form.sku" 
            type="text" 
            class="form-control" 
            :class="{ 'is-invalid': errors.sku }"
            @blur="validateField('sku')"
            placeholder="t.ex. RNG-AG-001" 
          />
          <div class="form-text">Kategori-Material-Nummer</div>
          <p class="invalid-feedback">{{ errors.sku }}</p>
        </div>

        <div class="col-6">
          <label class="form-label">Hyllplan <span class="text-danger">*</span></label>
          <input 
            v-model="form.shelf" 
            type="text" 
            class="form-control"
            :class="{ 'is-invalid': errors.shelf }"
            @blur="validateField('shelf')" 
            placeholder="t. ex. A301" />
          <div class="form-text">Hylla, rad och plats</div>
          <p class="invalid-feedback">{{ errors.shelf }}</p>
        </div>
      </div>

      <!-- Category -->
      <div class="mb-3">
        <label class="form-label">Kategori <span class="text-danger">*</span></label>
        <input 
          v-model="form.category" 
          type="text" 
          class="form-control" 
          :class="{ 'is-invalid': errors.name }"
          @blur="validateField('category')"
          list="categories-list"
          placeholder="Välj eller skriv kategori" />
        <datalist id="categories-list">
          <option v-for="cat in categories" 
            :key="cat" 
            :value="cat"
          ></option>
        </datalist>
        <p class="invalid-feedback">{{ errors.category }}</p>
      </div>

      <!-- Dynamic submit button and cancel button -->
      <div class="d-flex gap-2">
        <button type="submit" class="btn solea-button flex-grow-1" :disabled="loading">
          <span v-if="loading">Sparar...</span>
          <span v-else>{{ isEditing ? "Spara ändringar" : "Lägg till produkt" }}</span>
        </button>
        <button type="button" class="btn solea-button-outline" @click="router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
          </svg>
          Avbryt
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { products as productApi } from '../services/api.js'

// Use router for navigation and route for params
const router = useRouter()
const route = useRoute()

// If there is an id param in route the form is in editing mode 
const isEditing = computed(() => !!route.params.id)

// Form state
const form = ref({
  name: "",
  description: "",
  price: null,
  stock: null,
  shelf: "",
  sku: "",
  category: ""
})

// Errors for form validation
const errors = ref({
  name: "",
  description: "",
  price: "",
  stock: "",
  shelf: "",
  sku: "",
  category: ""
})

// State for categories, loading and error handling
const categories = ref([])
const loading = ref(false)
const error = ref(null)

// Validation logic for each field
function validateField(field) {
  errors.value[field] = ""

  // Validation rules based on field name
  switch (field) {
    case "name":
      if (!form.value.name || form.value.name.trim().length === 0)
        errors.value.name = "Namn är obligatoriskt"
      else if (form.value.name.length > 100)
        errors.value.name = "Namnet får inte vara längre än 100 tecken"
      break

    case "description":
      if (form.value.description && form.value.description.length > 500)
        errors.value.description = "Beskrivningen får inte vara längre än 500 tecken"
      break

    case "price":
      if (form.value.price === null || form.value.price === "")
        errors.value.price = "Pris är obligatoriskt"
      else if (form.value.price < 0)
        errors.value.price = "Priset kan inte vara negativt"
      break

    case "stock":
      if (form.value.stock === null || form.value.stock === "")
        errors.value.stock = "Antal i lager är obligatoriskt"
      else if (form.value.stock < 0)
        errors.value.stock = "Lagersaldo kan inte vara negativt"
      else if (!Number.isInteger(form.value.stock))
        errors.value.stock = "Lagersaldo måste vara ett heltal"
      break

    case "sku":
      if (!form.value.sku || form.value.sku.trim().length === 0)
        errors.value.sku = "Artikelnummer är obligatoriskt"
      else if (form.value.sku.length < 8)
        errors.value.sku = "Artikelnumret måste vara minst 8 tecken"
      else if (form.value.sku.length > 20)
        errors.value.sku = "Artikelnumret får inte vara längre än 20 tecken"
      break

    case "shelf":
      if (!form.value.shelf || form.value.shelf.trim().length === 0)
        errors.value.shelf = "Hyllplan är obligatoriskt"
      else if (form.value.shelf.length > 10)
        errors.value.shelf = "Hyllplan får inte vara längre än 10 tecken"
      break

    case "category":
      if (!form.value.category || form.value.category.trim().length === 0)
        errors.value.category = "Kategori är obligatoriskt"
      break
  }
}

// Validate all fields before submitting the form
function validateAll() {
  ["name", "description", "price", "stock", "shelf", "sku", "category"].forEach(validateField)
  return Object.values(errors.value).every(e => e === "")
}

// Fetch categories for the category input field
async function fetchCategories() {
  try {
    categories.value = await productApi.getCategories()
  } catch (err) {
    console.error(err)
  }
}

// If in editing mode, fetch the product data and populate the form
async function fetchProduct() {
  try {
    // Fetch the product by ID
    const product = await productApi.getById(route.params.id)

    // Populate the form with the product data
    form.value = {
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      shelf: product.shelf || "",
      sku: product.sku || "",
      category: product.category || "",
    }
  } catch (err) {
    error.value = err.message
  }
}

// Handle form submission for both adding and editing products
async function handleSubmit() {
  if(!validateAll()) return

  loading.value = true
  error.value = null
  try {
    if (isEditing.value) {

      // Update product if in editing mode
      await productApi.update(route.params.id, form.value)
    } else {

      // Add new product if in adding mode
      await productApi.add(form.value)
    }

    // Navigate back to products list
    router.push("/products")
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// On component mount, fetch categories
onMounted(() => {
  fetchCategories()

  // If in editing mode, also fetch the product data
  if (isEditing.value) fetchProduct()
})
</script>
