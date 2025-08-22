<!--
    WeatherHeader.vue
    Encabezado de la tarjeta de predicción diaria, muestra fecha, icono, amanecer y atardecer.
    Props:
        - day: Objeto con datos del día
        - expanded: Booleano para mostrar detalles
    Eventos:
        - toggle: Alterna la expansión de la tarjeta
-->
<script setup>
import { computed } from 'vue'
import Avatar from 'primevue/avatar'

const props = defineProps({
    day: { type: Object, required: true },
    expanded: Boolean
})
const emit = defineEmits(['toggle'])

const fmtDate = computed(() => {
    const d = new Date(props.day.datetime)
    return new Intl.DateTimeFormat('es-ES', {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }).format(d)
})
const sunrise = computed(() => props.day.sunrise?.slice(0, 5) || '--:--')
const sunset = computed(() => props.day.sunset?.slice(0, 5) || '--:--')
</script>

<template>
    <button type="button" class="title-button flex align-items-center justify-content-between w-full"
        @click="emit('toggle')" :aria-expanded="expanded" aria-controls="card-content">
        <div class="flex align-items-center gap-2">
            <Avatar :image="day.icon" shape="circle" size="large" />
            <div class="flex flex-column">
                <span class="text-l font-bold capitalize">{{ fmtDate }}</span>
                <div class="meta row">
                    <i class="fa-solid fa-sun"></i><span>{{ sunrise }}</span>
                    <i class="fa-solid fa-moon ml-1"></i><span>{{ sunset }}</span>
                </div>
            </div>
        </div>
        <div class="text-right">
            <div class="temp-day">
                <span class="temp-max">{{ Math.round(day.tempmax) }}°</span>/
                <span class="temp-min">{{ Math.round(day.tempmin) }}°</span>
            </div>
        </div>
    </button>
</template>