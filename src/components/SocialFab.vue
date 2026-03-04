<template>
  <div class="fixed bottom-6 left-6 z-50 flex flex-col-reverse items-center gap-3">
    <!-- Boton principal -->
    <button
      :class="[
        'flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all',
        open
          ? 'bg-foreground text-background'
          : 'bg-primary text-primary-foreground',
      ]"
      :aria-label="open ? 'Cerrar redes sociales' : 'Abrir redes sociales'"
      @click="open = !open"
    >
      <X v-if="open" class="h-6 w-6" />
      <Share2 v-else class="h-6 w-6" />
    </button>

    <!-- Links de redes sociales -->
    <div
      :class="[
        'flex flex-col gap-3 transition-all duration-300',
        open
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-4 opacity-0 pointer-events-none',
      ]"
    >
      <a
        href="https://www.facebook.com/municipalidaddedonihue"
        target="_blank"
        rel="noopener noreferrer"
        class="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-lg transition-transform hover:scale-110"
        aria-label="Facebook"
      >
        <Facebook class="h-5 w-5" />
      </a>
      <a
        href="https://www.instagram.com/munidonihue/"
        target="_blank"
        rel="noopener noreferrer"
        class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-lg transition-transform hover:scale-110"
        aria-label="Instagram"
      >
        <Instagram class="h-5 w-5" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Facebook, Instagram, Share2, X } from 'lucide-vue-next'

const open = ref(false)
</script>
