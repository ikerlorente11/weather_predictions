<script setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import Card from 'primevue/card'
import Avatar from 'primevue/avatar'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

const props = defineProps({
    day: { type: Object, required: true },
    city: { type: String, default: '' },
    tz: { type: String, default: 'Europe/Madrid' }
})

const fmtDate = computed(() => {
    const d = new Date(props.day.datetime)
    return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: '2-digit', month: 'short' }).format(d)
})

const sunrise = computed(() => props.day.sunrise?.slice(0, 5) || '--:--')
const sunset = computed(() => props.day.sunset?.slice(0, 5) || '--:--')

/* ===== Tabs de métricas ===== */
const tabs = [
    { label: 'Temperatura', key: 'temp' },
    { label: 'Viento', key: 'wind' },
    { label: 'Radiación', key: 'rad' },
    { label: 'Nieve', key: 'snow' }
]
const activeIndex = ref(0)
const activeKey = computed(() => tabs[activeIndex.value]?.key ?? 'temp')

/* ===== Mostrar/ocultar contenido ===== */
const expanded = ref(false)
function toggle() {
    expanded.value = !expanded.value
    if (expanded.value) triggerScrollToCurrentHour()
}

/* ===== Scroll a la hora actual (solo hoy) ===== */
const toLocalYYYYMMDD = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const isToday = computed(() => props.day?.datetime === toLocalYYYYMMDD())

const hourEls = ref([])
function findCurrentHourIndex() {
    if (!props.day?.hours?.length) return null
    const nowH = new Date().getHours()
    let idx = props.day.hours.findIndex(h => Number(h.datetime.slice(0, 2)) === nowH)
    if (idx !== -1) return idx
    let best = 0, bestDiff = Infinity
    props.day.hours.forEach((h, i) => {
        const hh = Number(h.datetime.slice(0, 2))
        const diff = Math.abs(hh - nowH)
        if (diff < bestDiff) { best = i; bestDiff = diff }
    })
    return best
}

async function triggerScrollToCurrentHour() {
    if (!isToday.value) return
    await nextTick()
    const idx = findCurrentHourIndex()
    const el = idx != null ? hourEls.value[idx] : null
    if (el?.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    }
}

watch(() => props.day?.hours, async () => {
    if (expanded.value) {
        hourEls.value = []
        await nextTick()
        triggerScrollToCurrentHour()
    }
})

onMounted(async () => {
    hourEls.value = []
})

/* ===== Utilidades de representación por métrica ===== */
function degToCompass(deg) {
    if (deg == null || isNaN(deg)) return '—'
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO']
    return dirs[Math.round(deg / 22.5) % 16]
}
</script>

<template>
    <Card class="weather-card compact">
        <!-- CABECERA -->
        <template #title>
            <button type="button" class="title-button flex align-items-center justify-content-between w-full"
                @click="toggle" :aria-expanded="expanded" aria-controls="card-content">
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
                        <span class="temp-max">{{ Math.round(day.tempmax) }}°</span>/<span class="temp-min">{{
                            Math.round(day.tempmin) }}°</span>
                    </div>
                </div>
            </button>
        </template>

        <!-- CONTENIDO -->
        <template #content>
            <transition name="collapse">
                <div v-show="expanded" id="card-content" class="content-wrap">
                    <!-- Tabs PrimeVue -->
                    <TabView v-model:activeIndex="activeIndex" class="metric-tabs">
                        <TabPanel v-for="(t, i) in tabs" :key="t.key" :header="t.label" />
                    </TabView>

                    <!-- Carrusel horizontal por horas -->
                    <div class="hours-scroller mt-2" aria-label="Predicción por horas">
                        <div v-for="(h, idx) in (day.hours || []).slice(0, 24)" :key="idx" class="hour-pill"
                            :ref="el => { if (el) hourEls[idx] = el }">
                            <span class="hour">{{ h.datetime.slice(0, 5) }}</span>

                            <!-- Contenido dinámico según pestaña seleccionada -->
                            <template v-if="activeKey === 'temp'">
                                <img :src="h.icon" class="icon-hour" :alt="h.conditions" />
                                <span class="temp">{{ Math.round(h.temp) }}°</span>
                                <span class="pp" :title="'Prob. precipitación'">
                                    <i class="fa-solid fa-cloud-rain"></i>{{ Math.round(h.precipprob || 0) }}%
                                </span>
                            </template>

                            <template v-else-if="activeKey === 'wind'">
                                <i class="fa-solid fa-arrow-up big-icon" aria-hidden="true"
                                    :style="{ transform: `rotate(${h.winddir}deg)`, margin: '6px auto' }">
                                </i>
                                <span class="val flex flex-column">
                                    <span>{{ Math.round(h.windspeed ?? 0) }}</span>
                                    <span>km/h</span>
                                </span>
                            </template>

                            <template v-else-if="activeKey === 'rad'">
                                <i class="fa-solid fa-sun big-icon" aria-hidden="true"
                                    :style="{ margin: '6px auto' }"></i>
                                <span class="val flex flex-column">
                                    <span>{{ Math.round(h.solarradiation ?? 0) }}</span>
                                    <span>W/m²</span>
                                </span>
                                <span class="pp" :title="'Índice UV'">
                                    UV {{ Math.round(h.uvindex ?? 0) }}
                                </span>
                            </template>

                            <template v-else> <!-- snow -->
                                <i class="fa-regular fa-snowflake big-icon" aria-hidden="true"
                                    :style="{ margin: '6px auto' }"></i>
                                <span class="val flex flex-row" style="justify-content: center; gap: 1px;">
                                    <span>{{ Math.round(h.snow ?? 0) }}</span>
                                    <span>%</span>
                                </span>
                                <span class="pp" :title="'Espesor de nieve'">
                                    {{ h.snowdepth ?? 0 }} mm
                                </span>
                            </template>
                        </div>
                    </div>
                </div>
            </transition>
        </template>
    </Card>
</template>

<style scoped>
.title-button {
    all: unset;
    cursor: pointer;
    display: flex;
    width: 100%;
}

.weather-card.compact {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
    border-radius: 16px;
    overflow: hidden;
    background: var(--p-content-background, var(--p-surface-0, #fff));
    color: var(--p-text-color, inherit);
}

:deep(.p-card-body) {
    padding: 1.3rem;
    display: initial;
}

.temp-day {
    font-size: 1.8rem;
    font-weight: 800;
    line-height: 1;
}

.temp-max {
    color: var(--p-text-color, currentColor);
}

.temp-min {
    color: var(--p-text-color-secondary, color-mix(in oklab, currentColor 60%, transparent));
}

.collapse-enter-active,
.collapse-leave-active {
    transition: max-height .28s ease, opacity .2s ease;
    overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
    max-height: 0;
    opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
    max-height: 650px;
    opacity: 1;
}

.meta {
    margin-top: .5rem;
    font-size: .8rem;
}

.meta.row {
    display: flex;
    align-items: center;
    gap: .25rem;
    margin-top: .25rem;
    flex-wrap: wrap;
}

.metric-tabs {
    margin-top: .25rem;
}

/* Carrusel horas compacto */
.hours-scroller {
    display: flex;
    gap: .5rem;
    overflow-x: auto;
    padding: .25rem;
    scroll-snap-type: x proximity;
    scroll-padding-left: 0.15rem;
    scrollbar-color: color-mix(in oklab, currentColor 30%, transparent) transparent;
}

.hours-scroller::-webkit-scrollbar {
    height: 6px;
}

.hours-scroller::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: color-mix(in oklab, currentColor 30%, transparent);
}

.hour-pill {
    min-width: 60px;
    scroll-snap-align: start;
    border-radius: 12px;
    padding: .4rem .35rem;
    text-align: center;
    border: 1px solid color-mix(in oklab, currentColor 12%, transparent);
    background: var(--p-content-background, var(--p-surface-0, #fff));
    box-shadow:
        0 2px 10px color-mix(in oklab, #000 12%, transparent),
        0 1px 0 color-mix(in oklab, #fff 6%, transparent);
    scroll-margin-left: 0.15rem;
}

.hour-pill:hover {
    border-color: color-mix(in oklab, currentColor 20%, transparent);
    box-shadow: 0 3px 14px color-mix(in oklab, #000 16%, transparent);
}

.icon-hour {
    width: 24px;
    height: 24px;
    display: block;
    margin: .15rem auto;
}

.big-icon {
    font-size: 1.25rem;
    display: block;
    margin: .1rem auto .2rem;
}

.hour {
    font-size: .7rem;
    color: var(--p-text-color-secondary, color-mix(in oklab, currentColor 60%, transparent));
}

.temp {
    display: block;
    font-weight: 700;
    font-size: .85rem;
    margin-top: .05rem;
    color: var(--p-text-color, currentColor);
}

.val {
    display: block;
    font-weight: 700;
    font-size: .85rem;
    margin-top: .05rem;
    color: var(--p-text-color, currentColor);
}

.pp {
    display: inline-flex;
    align-items: center;
    gap: .25rem;
    font-size: .65rem;
    color: var(--p-text-color-secondary, color-mix(in oklab, currentColor 60%, transparent));
}

/* Ajustes móviles */
@media (max-width: 320px) {
    .temp-day {
        font-size: 1.35rem;
    }

    .hour-pill {
        min-width: 56px;
    }
}

@media (prefers-color-scheme: dark) {
    * {
        --p-content-background: #424242;
        --p-tabview-tab-list-background: #424242;
        --p-tabview-tab-panel-background: #424242;
    }
}
</style>

<style>
.p-tabview-tab-header {
    padding: 5px 8px !important;
}

.p-tabview-panels {
    display: none;
}
</style>