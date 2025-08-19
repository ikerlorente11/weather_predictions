import { createRouter, createWebHistory } from 'vue-router'

// Importa tus páginas
import Home from '../pages/Home.vue'

// Define las rutas
const routes = [
  { path: '/:city?', component: Home },
]

// Crea el router
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
