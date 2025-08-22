<script setup>
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import Card from 'primevue/card'
import WeatherHeader from './WeatherHeader.vue'
import WeatherTabs from './WeatherTabs.vue'
import WeatherHoursScroller from './WeatherHoursScroller.vue'
import { toLocalYYYYMMDD } from './utils/dateUtils'

const props = defineProps({
    day: { type: Object, required: true },
    city: { type: String, default: '' },
    tz: { type: String, default: 'Europe/Madrid' }
})

const tabs = [
    { label: 'Temperatura', key: 'temp', value: 0 },
    { label: 'Viento', key: 'wind', value: 1 },
    { label: 'Radiación', key: 'rad', value: 2 },
    { label: 'Nieve', key: 'snow', value: 3 }
]

const active = ref(0)
const expanded = ref(false)
const activeKey = computed(() => tabs.find(t => t.value === active.value)?.key ?? 'temp')

const isToday = computed(() => props.day?.datetime === toLocalYYYYMMDD())
const hourEls = ref([])

function toggle() {
    expanded.value = !expanded.value
    if (expanded.value) triggerScrollToCurrentHour()
}

async function triggerScrollToCurrentHour() {
    if (!isToday.value) return
    await nextTick()
    const nowH = new Date().getHours()
    const idx = props.day.hours?.findIndex(h => Number(h.datetime.slice(0, 2)) === nowH) ?? -1
    const el = idx >= 0 ? hourEls.value[idx] : null
    el?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
}

watch(() => props.day?.hours, async () => {
    if (expanded.value) {
        hourEls.value = []
        await nextTick()
        triggerScrollToCurrentHour()
    }
})
onMounted(() => { hourEls.value = [] })
</script>

<template>
    <Card class="weather-card compact">
        <template #title>
            <WeatherHeader :day="day" :expanded="expanded" @toggle="toggle" />
        </template>

        <template #content>
            <transition name="collapse">
                <div v-show="expanded" id="card-content" class="content-wrap">
                    <WeatherTabs v-model:active="active" :tabs="tabs" />
                    <WeatherHoursScroller :day="day" :active-key="activeKey" :hour-els="hourEls" />
                </div>
            </transition>
        </template>
    </Card>
</template>