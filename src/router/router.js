import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import ProductView from '@/views/ProductView.vue'
import ProductFormView from '@/views/ProductFormView.vue'
import DashboardView from '@/views/DashboardView.vue'


const routes = [
    {
        path: "/",
        redirect: "/dashboard"
    },
    {
        path: "/logga-in",
        name: "logga-in",
        component: LoginView
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: DashboardView,
        meta: { authRequired: true }
    },
    {
        path: "/products",
        name: "produkter",
        component: ProductView,
        meta: { authRequired: true }
    },
    {
        path: "/products/new",
        name: "ny-produkt",
        component: ProductFormView,
        meta: { authRequired: true }
    },
    {
        path: "/products/:id/edit",
        name: "andra-produkt",
        component: ProductFormView,
        meta: { authRequired: true }
    }]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// Navigation guard
router.beforeEach((to) => {
    const loggedIn = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    // Check if the route requires authentication
    if (to.meta.authRequired && !loggedIn) {
        return "/logga-in"
    }

    // Already logged in users should not access the login page
    if (to.path === "/logga-in" && loggedIn) {
        return "/dashboard"
    }
})

export default router