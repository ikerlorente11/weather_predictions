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

// ✅ proxy local: se comporta como un v-model
const modelVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})

const value = ref('')
const suggestions = ref([])

function search(event) {
    const query = event.query.toLowerCase()
    suggestions.value = props.cities.filter(c =>
        c.toLowerCase().includes(query)
    )
}

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