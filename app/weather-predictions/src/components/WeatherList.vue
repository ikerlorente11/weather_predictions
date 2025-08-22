<!--
    WeatherList.vue
    Lista de tarjetas de predicción meteorológica por día.
    Props:
        - days: Array de objetos día
        - city: Nombre de la ciudad
-->
<script setup>
import WeatherDayCard from './WeatherDayCard.vue'

const props = defineProps({
    days: { type: Array, required: true },
    city: { type: String, default: '' }
})
</script>

<template>
    <div class="weather-list">
        <WeatherDayCard v-for="(d, i) in days" :key="i" :day="d" :city="city" />
    </div>
</template>

<style scoped>
.weather-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>