/**
 * Configuración de rutas de la aplicación Weather Predictions.
 * Utiliza Vue Router con historial HTML5.
 */
import { createRouter, createWebHistory } from 'vue-router'

// Importa la página principal
import Home from '../pages/Home.vue'

/**
 * Rutas disponibles en la aplicación.
 * - /:city? : Página principal, opcionalmente con ciudad.
 */
const routes = [
  { path: '/:city?', component: Home },
]

// Crear instancia de router con historial HTML5
const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router
