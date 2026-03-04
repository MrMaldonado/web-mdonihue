<template>
  <div class="relative bg-primary text-primary-foreground overflow-hidden">
    <!-- Imagen de fondo del top banner (opcional) -->
    <img
      v-if="bannerImage"
      :src="bannerImage"
      alt="Banner superior"
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div
      v-if="bannerImage"
      class="absolute inset-0 bg-primary/85"
    />
    <div class="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm">
      <div class="flex items-center gap-6">
        <span class="flex items-center gap-1.5">
          <Phone class="h-3.5 w-3.5" />
          +56 72 123 4567
        </span>
        <span class="hidden items-center gap-1.5 sm:flex">
          <Mail class="h-3.5 w-3.5" />
          contacto@donihue.cl
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        <Clock class="h-3.5 w-3.5" />
        <span class="hidden sm:inline">Lunes a Viernes</span> 08:00 - 17:00
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Phone, Mail, Clock } from 'lucide-vue-next'

// Asigna la URL de tu imagen aqui para mostrarla como fondo del top banner
const bannerImage = ref('')
</script>
