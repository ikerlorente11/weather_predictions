<!--
    HourPill.vue
    Muestra la información meteorológica de una hora concreta.
    Props:
        - hour: Objeto con datos de la hora
        - activeKey: Métrica activa (temp, wind, rad, snow)
        - refEl: Referencia para scroll
-->
<script setup>
import { degToCompass } from './utils/dateUtils'

const props = defineProps({
    hour: { type: Object, required: true },
    activeKey: { type: String, default: 'temp' },
    refEl: { type: Function }
})
</script>

<template>
    <div class="hour-pill" :ref="refEl">
        <span class="hour">{{ hour.datetime.slice(0, 5) }}</span>

        <template v-if="activeKey === 'temp'">
            <img :src="hour.icon" class="icon-hour" :alt="hour.conditions" />
            <span class="temp">{{ Math.round(hour.temp) }}°</span>
            <span class="pp" :title="'Prob. precipitación'">
                <i class="fa-solid fa-cloud-rain"></i>{{ Math.round(hour.precipprob || 0) }}%
            </span>
        </template>

        <template v-else-if="activeKey === 'wind'">
            <i class="fa-solid fa-arrow-up big-icon" :style="{ transform: `rotate(${hour.winddir}deg)` }"></i>
            <span class="val flex flex-column">
                <span>{{ Math.round(hour.windspeed ?? 0) }}</span>
                <span>km/h</span>
            </span>
        </template>

        <template v-else-if="activeKey === 'rad'">
            <i class="fa-solid fa-sun big-icon"></i>
            <span class="val flex flex-column">
                <span>{{ Math.round(hour.solarradiation ?? 0) }}</span>
                <span>W/m²</span>
            </span>
            <span class="pp" :title="'Índice UV'">UV {{ Math.round(hour.uvindex ?? 0) }}</span>
        </template>

        <template v-else>
            <i class="fa-regular fa-snowflake big-icon"></i>
            <span class="val flex flex-row" style="justify-content: center; gap: 1px;">
                <span>{{ Math.round(hour.snow ?? 0) }}</span><span>mm</span>
            </span>
            <span class="pp" :title="'Espesor de nieve'">{{ hour.snowdepth ?? 0 }} mm</span>
        </template>
    </div>
</template>