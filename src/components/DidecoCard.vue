<template>
  <div class="flex h-full flex-col rounded-xl border border-border bg-card">
    <div class="border-b border-border bg-primary/10 px-5 py-4">
      <h2 class="text-lg font-bold text-primary">DIDECO</h2>
      <p class="text-xs text-muted-foreground">Direccion de Desarrollo Comunitario</p>
    </div>
    <div class="flex flex-1 flex-col gap-2 p-5">
      <a
        v-for="service in services"
        :key="service.label"
        href="#"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
      >
        <component :is="service.icon" class="h-5 w-5 text-primary" />
        {{ service.label }}
      </a>
    </div>
    <div class="border-t border-border p-4">
      <a
        href="#"
        class="block rounded-lg bg-primary/10 px-4 py-2 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
      >
        Ver todos los servicios
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, Heart, GraduationCap, Baby } from 'lucide-vue-next'

const services = [
  { icon: Users, label: 'Registro Social' },
  { icon: Heart, label: 'Salud' },
  { icon: GraduationCap, label: 'Educacion' },
  { icon: Baby, label: 'Infancia' },
]
</script>
