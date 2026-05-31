import { createApp } from 'vue'
import '@/assets/main.css'
import App from '@/App.vue'
import router from '@/router/router.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

// Create and mount the Vue application
const app = createApp(App)
app.use(router)
app.mount('#app')