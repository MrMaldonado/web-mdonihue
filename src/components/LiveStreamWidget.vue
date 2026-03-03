<template>
  <div
    v-if="isVisible"
    class="fixed z-[60] select-none"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    <div
      :class="[
        'overflow-hidden rounded-xl border border-primary/40 bg-card shadow-2xl shadow-primary/10 transition-all',
        isMinimized ? 'w-56' : 'w-[340px]',
      ]"
    >
      <!-- Barra de titulo - arrastrable -->
      <div
        class="flex cursor-grab items-center justify-between gap-2 bg-primary px-3 py-2 active:cursor-grabbing"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
      >
        <div class="flex items-center gap-2">
          <GripHorizontal class="h-4 w-4 text-primary-foreground/60" />
          <Radio class="h-4 w-4 animate-pulse text-red-600" />
          <span class="text-sm font-bold text-primary-foreground">Transmision en Vivo</span>
        </div>
        <div class="flex items-center gap-1">
          <button
            class="flex h-6 w-6 items-center justify-center rounded text-primary-foreground/80 transition-colors hover:bg-primary-foreground/20 hover:text-primary-foreground"
            :aria-label="isMinimized ? 'Expandir' : 'Minimizar'"
            @click="isMinimized = !isMinimized"
          >
            <Maximize2 v-if="isMinimized" class="h-3.5 w-3.5" />
            <Minimize2 v-else class="h-3.5 w-3.5" />
          </button>
          <button
            class="flex h-6 w-6 items-center justify-center rounded text-primary-foreground/80 transition-colors hover:bg-red-500/80 hover:text-white"
            aria-label="Cerrar transmision"
            @click="isVisible = false"
          >
            <X class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <!-- Contenido del stream -->
      <div v-if="!isMinimized" class="flex flex-col">
        <div class="relative flex aspect-video w-full items-center justify-center bg-black/80">
          <div class="flex flex-col items-center gap-2">
            <Radio class="h-8 w-8 text-red-500 animate-pulse" />
            <span class="text-xs text-foreground/60">Esperando transmision...</span>
          </div>
          <div class="absolute left-2 top-2 flex items-center gap-1 rounded bg-red-600 px-2 py-0.5">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            <span class="text-[10px] font-bold text-white uppercase tracking-wider">En Vivo</span>
          </div>
        </div>
        <div class="border-t border-border px-3 py-2">
          <p class="text-xs text-muted-foreground">
            Transmision oficial de la Municipalidad de Doñihue. Sesiones de concejo, eventos y mas.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Radio, Minimize2, Maximize2, X, GripHorizontal } from 'lucide-vue-next'

const isVisible = ref(true)
const isMinimized = ref(false)
const position = ref({ x: 0, y: 0 })
const initialized = ref(false)
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

onMounted(() => {
  position.value = {
    x: window.innerWidth - 380,
    y: window.innerHeight - 320,
  }
  initialized.value = true
})

function handlePointerDown(e: PointerEvent) {
  isDragging.value = true
  dragOffset.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y,
  }
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
}

function handlePointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  position.value = {
    x: Math.max(0, Math.min(e.clientX - dragOffset.value.x, window.innerWidth - 60)),
    y: Math.max(0, Math.min(e.clientY - dragOffset.value.y, window.innerHeight - 40)),
  }
}

function handlePointerUp() {
  isDragging.value = false
}
</script>
