<!--
    WeatherTabs.vue
    Componente de pestañas reutilizable para mostrar diferentes métricas meteorológicas.
    Props:
        - tabs: Array de objetos { label, key, value }
        - active: Índice de la pestaña activa
    Eventos:
        - update:active: Emite el índice de la pestaña seleccionada
-->
<script setup>
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'

const props = defineProps({
    tabs: { type: Array, required: true },
    active: { type: Number, default: 0 }
})
const emit = defineEmits(['update:active'])
</script>

<template>
    <Tabs v-model:value="props.active" @update:value="emit('update:active', $event)" scrollable class="metric-tabs">
        <TabList>
            <Tab v-for="t in tabs" :key="t.key" :value="t.value">{{ t.label }}</Tab>
        </TabList>
        <TabPanels>
            <TabPanel v-for="t in tabs" :key="t.key" :value="t.value" />
        </TabPanels>
    </Tabs>
</template>