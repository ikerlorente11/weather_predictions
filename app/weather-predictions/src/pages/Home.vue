<!-- src/pages/Home.vue -->
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import WeatherDayCard from '../components/WeatherDayCard.vue'

const API_BASE = import.meta.env.VITE_API_URL

const route = useRoute()

const city = ref('')                // ciudad visible en la UI
const weather = ref({ days: [] })
const loading = ref(false)
const error = ref(null)

function setCityFromRoute() {
  const p = typeof route.params.city === 'string' ? route.params.city.trim() : ''
  city.value = p || 'Logroño'       // fallback si no hay city en la URL
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

onMounted(() => {
  setCityFromRoute()
  fetchWeather()
})

// Si navegas a otra ciudad (p.ej. /madrid), vuelve a cargar
watch(() => route.params.city, () => {
  setCityFromRoute()
  fetchWeather()
})
</script>

<template>
  <div class="p-2 flex flex-column align-items-center gap-2">
    <div class="title">
      <h1 class="text-xl font-bold capitalize">{{ city }}</h1>
    </div>

    <div v-if="loading">Cargando…</div>
    <div v-else-if="error">❌ {{ error }}</div>

    <WeatherDayCard v-else v-for="(d, i) in weather.days" :key="i" :day="d" :city="weather.city" />
  </div>
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

/* Si usas dark por sistema; si usas .dark, cámbialo por .dark .title */
@media (prefers-color-scheme: dark) {
  .title {
    --p-content-background: #424242;
  }
}
</style>