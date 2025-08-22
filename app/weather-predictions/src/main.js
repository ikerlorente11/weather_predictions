/**
 * Punto de entrada principal de la aplicación Weather Predictions.
 * Configura Vue, PrimeVue, temas y el router.
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'

// Temas v4 por preset (JS, no CSS)
import Aura from '@primeuix/themes/aura'
import Material from '@primeuix/themes/material'
import Lara from '@primeuix/themes/lara'
import Nora from '@primeuix/themes/nora'

// CSS necesarios
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import './assets/weather.css'

// Crear la instancia principal de Vue
const app = createApp(App)
// Configurar PrimeVue con tema y opciones
app.use(PrimeVue, {
    theme: {
        preset: Nora,
        options: {
            darkModeSelector: 'system'
        }
    }
})

// Configurar el router
app.use(router)
// Montar la app en el DOM
app.mount('#app')