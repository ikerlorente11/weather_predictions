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

const app = createApp(App)
app.use(PrimeVue, {
    theme: {
        preset: Nora,
        options: {
            darkModeSelector: 'system'
        }
    }
})

app.use(router)
app.mount('#app')