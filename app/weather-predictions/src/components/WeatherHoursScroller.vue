<!--
    WeatherHoursScroller.vue
    Scroller horizontal para mostrar las horas de un día.
    Props:
        - day: Objeto con datos del día
        - activeKey: Métrica activa
        - hourEls: Referencias a los elementos de hora
-->
<script setup>
import HourPill from './HourPill.vue'

const props = defineProps({
    day: { type: Object, required: true },
    activeKey: { type: String, default: 'temp' },
    hourEls: { type: Array, required: true }
})
</script>

<template>
    <div class="hours-scroller mt-2" aria-label="Predicción por horas">
        <HourPill v-for="(h, idx) in (day.hours || []).slice(0, 24)" :key="idx" :hour="h" :active-key="activeKey"
            :ref-el="el => { if (el) hourEls[idx] = el }" />
    </div>
</template>