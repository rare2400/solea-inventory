const API_URL = "https://solea-api.onrender.com"

// Get JWT token from localStorage
function getToken() {
    return localStorage.getItem("token")
}

// Generic function to make API requests with headers and error handling
async function request(endpoint, options = {}) {
    // Create headers object
    const headers = {
        ...options.headers
    }

    // If body is present, set content type to json
    if (options.body) {
        headers["Content-Type"] = "application/json"
    }

    // Get token and add to authorization-header if it exists
    const token = getToken()
    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    // Send request to API
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    })

    // Try to parse response as JSON, if it fails return null
    const data = await response.json().catch(() => null)

    // If response is not ok, throw an error
    if (!response.ok) {
        throw new Error(data?.error || "Something went wrong")
    }

    // Return parsed data
    return data
}

// Auth API functions
export const auth = {

    // Register new user
    register: (data) => request("/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
    }),

    // Login user and return token
    login: (data) => request("/auth/login", {
        method: "POST",
        body: JSON.stringify(data)
    }),

    // Get current user profile
    getProfile: () => request("/auth/profile"),

    // Get all users
    getUsers: () => request("/auth/users"),

    // Update user by id
    updateUser: (id, data) => request(`/auth/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    }),

    // Delete user by id
    deleteUser: (id) => request(`/auth/users/${id}`, {
        method: "DELETE"
    })
}

// Products API functions
export const products = {

    // Get all products
    getAll: () => request("/products"),

    // Get product by id
    getById: (id) => request(`/products/${id}`),

    // Get product categories
    getCategories: () => request("/products/categories"),
    add: (data) => request("/products", {
        method: "POST",
        body: JSON.stringify(data)
    }),

    // Update product by id
    update: (id, data) => request(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    }),

    // Delete product by id
    delete: (id) => request(`/products/${id}`,
        { method: "DELETE" }),

    // Update product stock by id with delta value
    updateStock: (id, stock) => request(`/products/${id}/stock`, {
        method: "PATCH",
        body: JSON.stringify({ stock })
    })
}