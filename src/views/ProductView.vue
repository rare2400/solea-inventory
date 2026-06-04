<template>
  <div class="container py-4">

    <!-- Page header with add button -->
    <section class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-light mb-0">Produkter</h2>
      <RouterLink to="/products/new" class="btn solea-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-plus icon" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
        </svg>
        Lägg till produkt
      </RouterLink>
    </section>

    <!-- Filter section -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-md-6">
        <input 
          v-model="search" 
          type="text" 
          class="form-control" 
          placeholder="Sök produkt..." 
        />
      </div>

      <!-- Category filtration -->
      <div class="col-12 col-md-3">
        <select v-model="selectedCategory" class="form-select">
          <option value="">Alla kategorier</option>
          <option v-for="cat in categories" 
            :key="cat" 
            :value="cat"
          >
            {{ cat }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5 text-muted">
      Hämtar produkter...
    </div>

    <!-- Error message -->
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- If list is emty -->
    <div v-else-if="filteredProducts.length === 0" class="text-center py-5 text-muted">
      Inga produkter hittades.
    </div>

    <!-- List of products -->
    <div v-else class="row g-4">
      <div v-for="product in filteredProducts" 
        :key="product._id" 
        class="col-12 col-sm-6 col-lg-4"
      >
        <!-- Product card -->
        <article class="card h-100 shadow-sm product-card" @click="openDetail(product)">
          
          <!-- Product information -->
          <div class="card-body">
            <p class="badge solea-badge mb-2">{{ product.category }}</p>
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text text-muted small">{{ product.description }}</p>
          </div>

          <!-- Price and stock -->
          <div class="card-footer d-flex justify-content-between align-items-center">
            <p class="fw-bold mb-0">{{ product.price }} kr</p>

            <!-- Inventory stock +/- buttons -->
            <div class="d-flex align-items-center gap-2" @click.stop>
              <!-- Reduce stock -->
              <button
                class="btn btn-sm solea-button-outline"
                :disabled="stockLoading[product._id]"
                @click="changeStock(product, -1)"
              >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
              </svg>
            </button>
              <!-- Stock badge -->
              <span class="badge fs-6" :class="product.stock > 0 ? 'bg-success' : 'bg-danger'">
                {{ product.stock > 0 ? product.stock : "Slut i lager" }}
              </span>
              <!-- Increase stock -->
              <button
                class="btn btn-sm solea-button-outline"
                :disabled="stockLoading[product._id]"
                @click="changeStock(product, 1)"
              >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
              </svg>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Product detail component -->
    <ProductDetail 
      v-if="selectedProduct" 
      :product="selectedProduct" 
      @close="selectedProduct = null"
      @updated="handleUpdated" 
      @deleted="handleDeleted" 
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { products as productApi } from '../services/api.js'
import ProductDetail from '../components/ProductDetail.vue'

// State variables
const productList = ref([])
const categories = ref([])
const search = ref("")
const selectedCategory = ref("")
const loading = ref(false)
const error = ref(null)
const selectedProduct = ref(null)
const stockLoading = ref({}) // Objekt för att spåra stock-loading per produkt

// Filter products based on search and category
const filteredProducts = computed(() => {
  return productList.value
    .filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
    .filter(p => selectedCategory.value === "" || p.category === selectedCategory.value)
})

// Fetch products from API
async function fetchProducts() {
  loading.value = true
  try {
    productList.value = await productApi.getAll()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Fetch categories from API
async function fetchCategories() {
  try {
    categories.value = await productApi.getCategories()
  } catch (err) {
    console.error(err)
  }
}

// Change stock of a product
async function changeStock(product, stock) {
  stockLoading.value[product._id] = true
  try {

    // Update stock via API and update local state
    const result = await productApi.updateStock(product._id, stock)
    const index = productList.value.findIndex(p => p._id === product._id)

    // Update only the stock value
    if (index !== -1) productList.value[index].stock = result.stock
  } catch (err) {
    console.error(err)
  } finally {
    stockLoading.value[product._id] = false
  }
}

// Open product detail component
function openDetail(product) {
  selectedProduct.value = product
}

// Handle product updates from detail component
function handleUpdated(updatedProduct) {
  const index = productList.value.findIndex(p => p._id === updatedProduct._id)
  if (index !== -1) productList.value[index] = updatedProduct
}

// Handle product deletion from detail component
function handleDeleted(id) {
  productList.value = productList.value.filter(p => p._id !== id)
  selectedProduct.value = null
}

// Fetch products and categories on component mount
onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<style scoped>
.product-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1) !important;
}
</style>