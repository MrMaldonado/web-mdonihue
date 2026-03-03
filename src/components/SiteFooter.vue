<template>
  <footer class="border-t border-border bg-secondary">
    <div class="mx-auto max-w-7xl px-4 py-10">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <!-- About -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              MD
            </div>
            <span class="text-base font-bold text-primary">Doñihue</span>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground">
            Municipalidad de Doñihue, comprometida con el desarrollo y bienestar de nuestra comunidad.
          </p>
        </div>

        <!-- Enlaces -->
        <div class="flex flex-col gap-3">
          <h3 class="text-sm font-bold text-foreground">Enlaces</h3>
          <ul class="flex flex-col gap-2">
            <li v-for="link in enlaces" :key="link">
              <a href="#" class="text-sm text-muted-foreground transition-colors hover:text-primary">
                {{ link }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Servicios -->
        <div class="flex flex-col gap-3">
          <h3 class="text-sm font-bold text-foreground">Servicios</h3>
          <ul class="flex flex-col gap-2">
            <li v-for="link in servicios" :key="link">
              <a href="#" class="text-sm text-muted-foreground transition-colors hover:text-primary">
                {{ link }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contacto -->
        <div class="flex flex-col gap-3">
          <h3 class="text-sm font-bold text-foreground">Contacto</h3>
          <ul class="flex flex-col gap-2.5">
            <li class="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Av. OHiggins 123, Doñihue
            </li>
            <li class="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone class="h-4 w-4 shrink-0 text-primary" />
              +56 72 123 4567
            </li>
            <li class="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail class="h-4 w-4 shrink-0 text-primary" />
              contacto@donihue.cl
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-border">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row">
        <p class="text-xs text-muted-foreground">
          &copy; 2026 Municipalidad de Doñihue. Todos los derechos reservados.
        </p>
        <div class="flex gap-4">
          <a href="#" class="text-xs text-muted-foreground transition-colors hover:text-primary">
            Politica de privacidad
          </a>
          <a href="#" class="text-xs text-muted-foreground transition-colors hover:text-primary">
            Accesibilidad
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { MapPin, Phone, Mail } from 'lucide-vue-next'

const enlaces = ['Transparencia', 'Tramites en linea', 'Licitaciones', 'Empleo']
const servicios = ['DIDECO', 'Veterinaria', 'Obras Municipales', 'Educacion']
</script>
