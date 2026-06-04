<template>
  <!-- Overlay -->
  <div class="modal-overlay" @click.self="$emit('close')">
    <article class="modal-box">

      <!-- Header with category and close-button -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <p class="badge solea-badge mb-0">{{ product.category }}</p>
        <button type="button" class="btn-close" @click="$emit('close')"></button>
      </div>

      <!-- Info -->
      <h2 class="fw-bold mb-1">{{ product.name }}</h2>
      <p class="text-muted mb-3">{{ product.description }}</p>

      <!-- Details -->
      <dl class="row g-2 mb-3">
        <div class="col-6">
          <div class="detail-box">
            <dt class="detail-label">Pris</dt>
            <dd class="detail-value mb-0">{{ product.price }} kr</dd>
          </div>
        </div>
        <div class="col-6">
          <div class="detail-box">
            <dt class="detail-label">Artikelnummer</dt>
            <dd class="detail-value mb-0">{{ product.sku || "-" }}</dd>
          </div>
        </div>
        <div class="col-6">
          <div class="detail-box">
            <dt class="detail-label">Hyllplan</dt>
            <dd class="detail-value mb-0">{{ product.shelf || "-" }}</dd>
          </div>
        </div>
        <div class="col-6">
          <div class="detail-box">
            <dt class="detail-label">Kategori</dt>
            <dd class="detail-value mb-0">{{ product.category || "-" }}</dd>
          </div>
        </div>
    </dl>

      <!-- Inventory balance and buttons to update stock -->
      <div class="detail-box mb-3">
        <span class="detail-label">Lagersaldo</span>
        <div class="d-flex align-items-center gap-2 mt-1">
          <!-- Remove one from stock -->
          <button class="btn btn-sm solea-button-outline" 
            @click="changeStock(-1)" 
            :disabled="stockLoading"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
            </svg>
          </button>
          <span class="badge fs-6 px-3" :class="currentStock > 0 ? 'bg-success' : 'bg-danger'">
            {{ currentStock > 0 ? currentStock : "Slut i lager" }}
          </span>
          <!-- Add one to stock -->
          <button class="btn btn-sm solea-button-outline" 
            @click="changeStock(1)"
            :disabled="stockLoading"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

      <!-- Admin-buttons -->
      <div class="d-flex gap-2">

        <!-- Link to edit page -->
        <RouterLink 
          :to="`/products/${product._id}/edit`" 
          class="btn solea-button flex-grow-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill mx-1" viewBox="0 0 16 16">
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
          </svg>
          Redigera
        </RouterLink>

        <!-- Delete product (admin only) -->
        <button
          v-if="isAdmin"
          class="btn btn-outline-danger flex-grow-1" 
          @click="handleDelete" 
          :disabled="deleteLoading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
          </svg>
          {{ deleteLoading ? "Tar bort..." : "Ta bort" }}
        </button>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { products as productApi } from '../services/api.js'

// Recieve product from parent component
const props = defineProps({
  product: { type: Object, required: true }
})

// Emit events sent to parent component
const emit = defineEmits(["close", "updated", "deleted"])

// Check if user is admin
const isAdmin = computed(() => localStorage.getItem("role") === "admin")

// Local state for stock and loading/error states
const currentStock = ref(props.product.stock)
const stockLoading = ref(false)
const deleteLoading = ref(false)
const error = ref(null)

// Update stock via API
async function changeStock(delta) {
  stockLoading.value = true
  error.value = null

  try {
    // Send PATCH request to update stock
    const result = await productApi.updateStock(props.product._id, delta)

    // Update UI with new stock value
    currentStock.value = result.stock

    // Send updated product data to parent component
    emit("updated", { ...props.product, stock: result.stock })
  } catch (err) {
    error.value = err.message
  } finally {
    stockLoading.value = false
  }
}

// Delete product via API
async function handleDelete() {
  // Confirm deletion with user
  if (!confirm("Är du säker på att du vill ta bort produkten?")) return
  deleteLoading.value = true
  error.value = null
  try {
    // Send DELETE request to API
    const id = props.product._id
    await productApi.delete(id)

    // Notify parent component that product was deleted
    emit("deleted", id)
  } catch (err) {
    error.value = err.message
    deleteLoading.value = false
  }
}
</script>

<style scoped>
/* Styles for the modal overlay and box */
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
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.detail-box {
  background: #f8f8f6;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.7em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  margin-bottom: 0.2rem;
}

.detail-value {
  font-size: 0.9em;
  font-weight: 500;
  color: #333;
}
</style>