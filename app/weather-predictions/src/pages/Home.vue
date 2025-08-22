<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WeatherList from '../components/WeatherList.vue'
import CityDialog from '../components/CityDialog.vue'

const API_BASE = import.meta.env.VITE_API_URL
const route = useRoute()
const router = useRouter()

const city = ref('')
const weather = ref({ days: [] })
const loading = ref(false)
const error = ref(null)
const visible = ref(false)

const cities = ref([])
const history = ref([])

async function loadCities() {
  try {
    const res = await fetch('/poblaciones.json')
    if (!res.ok) throw new Error('No se pudo cargar las ciudades')
    const data = await res.json()
    cities.value = data.map(item => item.label)
  } catch (e) {
    console.error(e)
  }
}

function setCityFromRoute() {
  const p = typeof route.params.city === 'string' ? route.params.city.trim() : ''
  city.value = p || 'Logroño'
}

function loadHistory() {
  history.value = JSON.parse(localStorage.getItem('cityHistory') || '[]')
}

function saveCityToHistory(c) {
  const idx = history.value.indexOf(c)
  if (idx !== -1) history.value.splice(idx, 1)
  history.value.unshift(c)
  if (history.value.length > 10) history.value.pop()
  localStorage.setItem('cityHistory', JSON.stringify(history.value))
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

function confirmCity(c) {
  saveCityToHistory(c)
  visible.value = false
  router.push({ path: `/${c}` })
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
})
</script>

<template>
  <div class="p-2 flex flex-column align-items-center gap-2">
    <div class="title cursor-pointer" @click="visible = true">
      <h1 class="text-xl font-bold capitalize">{{ city }}</h1>
    </div>

    <div v-if="loading">Cargando…</div>
    <div v-else-if="error">❌ {{ error }}</div>
    <WeatherList v-else :days="weather.days" :city="weather.city" />
  </div>

  <CityDialog v-model:visible="visible" :cities="cities" :history="history" @confirm="confirmCity"
    @selectHistory="confirmCity" />
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

@media (prefers-color-scheme: dark) {
  .title {
    --p-content-background: #424242;
  }
}
</style>