<script setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Divider from 'primevue/divider'

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

// refs a cada pastilla de hora
const hourEls = ref([])
// índice de la hora actual (o la más cercana)
function findCurrentHourIndex() {
    if (!props.day?.hours?.length) return null
    const nowH = new Date().getHours()
    let idx = props.day.hours.findIndex(h => Number(h.datetime.slice(0, 2)) === nowH)
    if (idx !== -1) return idx
    // más cercano si no hay exacto
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

/* Si las horas llegan/actualizan después y está abierto, vuelve a ajustar el scroll */
watch(() => props.day?.hours, async () => {
    if (expanded.value) {
        hourEls.value = []
        await nextTick()
        triggerScrollToCurrentHour()
    }
})

/* Limpia refs al montar para evitar residuos si este componente se reusa */
onMounted(async () => {
    hourEls.value = []
})
</script>

<template>
    <Card class="weather-card compact">
        <!-- CABECERA: clickable para abrir/cerrar -->
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

        <!-- CONTENIDO: oculto por defecto, se despliega con animación -->
        <template #content>
            <transition name="collapse">
                <div v-show="expanded" id="card-content" class="content-wrap">
                    <!-- carrusel horizontal por horas -->
                    <div class="hours-scroller mt-1" aria-label="Predicción por horas">
                        <div v-for="(h, idx) in (day.hours || []).slice(0, 24)" :key="idx" class="hour-pill"
                            :ref="el => { if (el) hourEls[idx] = el }">
                            <span class="hour">{{ h.datetime.slice(0, 5) }}</span>
                            <img :src="h.icon" class="icon-hour" :alt="h.conditions" />
                            <span class="temp">{{ Math.round(h.temp) }}°</span>
                            <span class="pp" :title="'Prob. precipitación'">
                                <i class="fa-solid fa-cloud-rain"></i>{{ Math.round(h.precipprob || 0) }}%
                            </span>
                        </div>
                    </div>
                </div>
            </transition>
        </template>
    </Card>
</template>

<style scoped>
/* Botón accesible para el header (sin estilos de botón) */
.title-button {
    all: unset;
    cursor: pointer;
    display: flex;
    width: 100%;
}

/* Contenedor compacto y centrado, tope 350px */
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

/* Encabezado reducido */
.temp-day {
    font-size: 1.8rem;
    font-weight: 800;
    line-height: 1;
}

.temp-max {
    /* alto énfasis en cualquier tema */
    color: var(--p-text-color, currentColor);
}

.temp-min {
    /* secundario: se adapta a claro/oscuro */
    color: var(--p-text-color-secondary, color-mix(in oklab, currentColor 60%, transparent));
}

.cond {
    font-size: .75rem;
    color: var(--p-text-color-secondary, color-mix(in oklab, currentColor 60%, transparent));
    margin-top: .15rem;
}

/* Animación colapsable */
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
    /* suficiente para horas + meta */
    opacity: 1;
}

/* Meta compacta */
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

.chip {
    padding: 0 .4rem;
    height: 1.35rem;
    font-size: .7rem;
    /* Tag hereda colores del tema Prime */
}

/* Carrusel horas compacto */
.hours-scroller {
    display: flex;
    gap: .5rem;
    overflow-x: auto;
    padding: .25rem;
    scroll-snap-type: x proximity;

    /* aire lógico al inicio para no “comer” la sombra al anclar */
    scroll-padding-left: 0.15rem;

    /* scrollbar que se adapta al tema */
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

    /* Borde y sombra neutros que funcionan en claro y oscuro */
    border: 1px solid color-mix(in oklab, currentColor 12%, transparent);
    background: var(--p-content-background, var(--p-surface-0, #fff));
    box-shadow:
        0 2px 10px color-mix(in oklab, #000 12%, transparent),
        0 1px 0 color-mix(in oklab, #fff 6%, transparent);

    /* margen lógico de snap (complementa scroll-padding) */
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

.pp {
    display: inline-flex;
    align-items: center;
    gap: .25rem;
    font-size: .65rem;
    color: var(--p-text-color-secondary, color-mix(in oklab, currentColor 60%, transparent));
}

/* Ajustes para pantallas muy estrechas (≤320px) */
@media (max-width: 320px) {
    .temp-day {
        font-size: 1.35rem;
    }

    .hour-pill {
        min-width: 56px;
    }
}

@media (prefers-color-scheme: dark) {
    .weather-card.compact {
        --p-content-background: #424242;
    }
}
</style>