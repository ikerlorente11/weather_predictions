<!--
    CityDialog.vue
    Diálogo para seleccionar ciudad, con autocompletado y selección de historial.
    Props:
        - visible: Controla la visibilidad del diálogo
        - cities: Array de nombres de ciudades
        - history: Array de ciudades recientes
    Eventos:
        - update:visible: Cambia la visibilidad
        - confirm: Confirma la selección de ciudad
        - selectHistory: Selecciona una ciudad del historial
-->
<script setup>

import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import AutoComplete from 'primevue/autocomplete'
import FloatLabel from 'primevue/floatlabel'


const props = defineProps({
    visible: Boolean,
    cities: { type: Array, default: () => [] },
    history: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:visible', 'confirm', 'selectHistory'])


/**
 * Proxy local para la visibilidad del diálogo, permite usar v-model.
 */
const modelVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})


/**
 * Valor del input de ciudad.
 */
const value = ref('')
/**
 * Sugerencias filtradas para el autocompletado.
 */
const suggestions = ref([])


/**
 * Filtra las ciudades según el texto introducido para autocompletar.
 * @param {Object} event - Evento de autocompletado de PrimeVue.
 */
function search(event) {
    const query = event.query.toLowerCase()
    suggestions.value = props.cities.filter(c =>
        c.toLowerCase().includes(query)
    )
}


/**
 * Confirma la ciudad seleccionada y la envía al componente padre.
 * Limpia el input tras confirmar.
 */
function confirmCity() {
    if (!value.value) return
    emit('confirm', value.value)
    value.value = ''
}
</script>

<template>
    <Dialog v-model:visible="modelVisible" modal dismissableMask class="dialog !border-0 !bg-transparent"
        maskClass="backdrop-blur-sm">
        <template #container>
            <FloatLabel variant="on">
                <AutoComplete v-model="value" inputId="on_label" :suggestions="suggestions" @complete="search"
                    @keydown.enter.prevent="confirmCity" />
                <label for="on_label">Selecciona una ciudad</label>
            </FloatLabel>

            <div class="history mt-3">
                <div v-for="(h, i) in history" :key="i" class="cursor-pointer" @click="$emit('selectHistory', h)">
                    {{ h }}
                </div>
            </div>
        </template>
    </Dialog>
</template>