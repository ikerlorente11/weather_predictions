<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WeatherDayCard from '../components/WeatherDayCard.vue'
import Dialog from 'primevue/dialog';
import AutoComplete from 'primevue/autocomplete';
import FloatLabel from 'primevue/floatlabel';

const API_BASE = import.meta.env.VITE_API_URL
const route = useRoute()
const router = useRouter()

const city = ref('')
const weather = ref({ days: [] })
const loading = ref(false)
const error = ref(null)
const visible = ref(false)

const value = ref('')
const cities = ref([])
const suggestions = ref([])
const history = ref([])

const autoCompleteRef = ref(null)

// Cargar municipios desde poblaciones.json
async function loadCities() {
  try {
    const res = await fetch('/poblaciones.json')
    if (!res.ok) throw new Error('No se pudo cargar las ciudades')
    const data = await res.json()
    // Guardamos solo los nombres en un array
    cities.value = data.map(item => item.label)
  } catch (e) {
    console.error(e)
  }
}

// Inicializa la ciudad desde la ruta
function setCityFromRoute() {
  const p = typeof route.params.city === 'string' ? route.params.city.trim() : ''
  city.value = p || 'Logroño'
}

// Carga el historial de localStorage y sincroniza con la lista de ciudades
function loadHistory() {
  const h = JSON.parse(localStorage.getItem('cityHistory') || '[]')
  history.value = h
  // Añadir al array de ciudades cualquier ciudad del historial que no exista
  h.forEach(c => {
    if (!cities.value.includes(c)) {
      cities.value.push(c)
    }
  })
}

// Guarda la ciudad en histórico y en la lista de ciudades si es nueva
function saveCityToHistory(c) {
  const idx = history.value.indexOf(c)
  if (idx !== -1) history.value.splice(idx, 1)  // eliminar duplicado
  history.value.unshift(c)                        // añadir al inicio
  if (history.value.length > 10) history.value.pop() // limitar a 10
  localStorage.setItem('cityHistory', JSON.stringify(history.value))

  // Añadir a la lista de ciudades si no existía
  if (!cities.value.includes(c)) {
    cities.value.push(c)
  }
}

// Filtra las ciudades para AutoComplete
function search(event) {
  const query = event.query.toLowerCase()
  suggestions.value = cities.value.filter(c => c.toLowerCase().includes(query))
}

// Confirma ciudad seleccionada (autocomplete o Enter)
function confirmCity() {
  if (!value.value) return
  saveCityToHistory(value.value)
  visible.value = false
  router.push({ path: `/${value.value}` })
  value.value = ''
}

// Selecciona ciudad desde el historial
function selectFromHistory(c) {
  saveCityToHistory(c)
  visible.value = false
  router.push({ path: `/${c}` })
  value.value = ''
}

async function fetchWeather() {
  loading.value = true
  error.value = null
  try {
    const q = encodeURIComponent(city.value)
    const res = await fetch(`${API_BASE}?city=${q}`)
    if (!res.ok) throw new Error('No se pudo obtener el tiempo')
    weather.value = await res.json()
    document.title = `${weather.value.city} · El tiempo`
  } catch (e) {
    error.value = e.message || String(e)
    weather.value = { days: [] }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadCities()
  setCityFromRoute()
  fetchWeather()
  loadHistory()
})

watch(() => route.params.city, () => {
  setCityFromRoute()
  fetchWeather()
  value.value = ''
})

// watch(visible, async (v) => {
//   if (v) {
//     await nextTick()
//     const input = autoCompleteRef.value?.$el.querySelector('input')
//     if (input) {
//       input.focus()
//       input.select() // opcional: selecciona todo el texto
//     }
//   }
// })
</script>

<template>
  <div class="p-2 flex flex-column align-items-center gap-2">
    <div class="title cursor-pointer" @click="visible = true">
      <h1 class="text-xl font-bold capitalize">{{ city }}</h1>
    </div>

    <div v-if="loading">Cargando…</div>
    <div v-else-if="error">❌ {{ error }}</div>

    <WeatherDayCard v-else v-for="(d, i) in weather.days" :key="i" :day="d" :city="weather.city" />
  </div>

  <Dialog v-model:visible="visible" modal dismissableMask class="dialog !border-0 !bg-transparent"
    maskClass="backdrop-blur-sm">
    <template #container="{ closeCallback }">
      <FloatLabel variant="on">
        <AutoComplete ref="autoCompleteRef" v-model="value" inputId="on_label" :suggestions="suggestions"
          @complete="search" @item-select="confirmCity" @keydown.enter.prevent="confirmCity" />
        <label for="on_label">Selecciona una ciudad</label>
      </FloatLabel>

      <div class="history mt-3">
        <div v-for="(h, i) in history" :key="i" class="cursor-pointer" @click="selectFromHistory(h)">
          {{ h }}
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.title {
  padding: .5rem 2rem;
  font-size: 1.5rem;
  line-height: 1.2;
  border-radius: 8px;
  background: var(--p-content-background);
}

h1 {
  margin: 0;
}

.history {
  display: grid;
  grid-template-columns: max-content;
  justify-content: center;
  gap: 0.5rem;
}

.history div {
  padding: 0.4rem 1rem;
  background: var(--p-content-background);
  border-radius: 0.5rem;
  text-align: center;
}

@media (prefers-color-scheme: dark) {
  .title {
    --p-content-background: #424242;
  }
}
</style>

<style>
/* Cambiar el borde y color del input */
.p-autocomplete .p-inputtext {
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: 1rem;
}

.dialog {
  --p-dialog-border-radius: 0.5rem;
  padding: 1rem;
}

@media (prefers-color-scheme: dark) {
  .dialog {
    --p-dialog-background: #424242;
  }
}
</style>