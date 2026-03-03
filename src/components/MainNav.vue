<template>
  <nav class="bg-secondary text-secondary-foreground shadow-lg">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4">
      <!-- Logo - reemplaza el src con tu imagen -->
      <a href="#" class="flex items-center py-2">
        <div v-if="logoSrc" class="h-12 w-auto">
          <img :src="logoSrc" alt="Logo Municipalidad de Doñihue" class="h-full w-auto object-contain" />
        </div>
        <div v-else class="flex h-12 w-28 items-center justify-center rounded-lg border border-dashed border-muted-foreground/40 bg-secondary/50">
          <ImageIcon class="h-5 w-5 text-muted-foreground/40" />
        </div>
      </a>

      <!-- Desktop Nav -->
      <ul class="hidden items-center gap-1 lg:flex">
        <li
          v-for="item in navItems"
          :key="item.label"
          class="relative"
          @mouseenter="item.children ? openDropdown = item.label : null"
          @mouseleave="openDropdown = null"
        >
          <a
            :href="item.href"
            class="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary"
          >
            {{ item.label }}
            <ChevronDown v-if="item.children" class="h-3.5 w-3.5" />
          </a>
          <ul
            v-if="item.children && openDropdown === item.label"
            class="absolute left-0 top-full z-50 min-w-48 rounded-md border border-border bg-card p-1 shadow-xl"
          >
            <li v-for="child in item.children" :key="child.label">
              <a
                :href="child.href"
                class="block rounded-sm px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-primary/20 hover:text-primary"
              >
                {{ child.label }}
              </a>
            </li>
          </ul>
        </li>
      </ul>

      <!-- Mobile toggle -->
      <button
        class="rounded-md p-2 text-secondary-foreground lg:hidden hover:bg-primary/20"
        :aria-label="mobileOpen ? 'Cerrar menu' : 'Abrir menu'"
        @click="mobileOpen = !mobileOpen"
      >
        <X v-if="mobileOpen" class="h-6 w-6" />
        <Menu v-else class="h-6 w-6" />
      </button>
    </div>

    <!-- Mobile Nav -->
    <div v-if="mobileOpen" class="border-t border-border px-4 pb-4 lg:hidden">
      <ul class="flex flex-col gap-1 pt-2">
        <li v-for="item in navItems" :key="item.label">
          <a
            :href="item.href"
            class="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary"
          >
            {{ item.label }}
          </a>
          <ul v-if="item.children" class="ml-4 flex flex-col gap-1">
            <li v-for="child in item.children" :key="child.label">
              <a
                :href="child.href"
                class="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {{ child.label }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X, ChevronDown, ImageIcon } from 'lucide-vue-next'

const mobileOpen = ref(false)
const openDropdown = ref<string | null>(null)

// Asigna aqui la URL de la imagen del logo
const logoSrc = ref('src/assets/logo-donihue.png')

const navItems = [
  { label: 'Inicio', href: '#' },
  {
    label: 'Municipalidad',
    href: '#',
    children: [
      { label: 'Alcalde', href: '#' },
      { label: 'Concejo Municipal', href: '#' },
      { label: 'Organigrama', href: '#' },
    ],
  },
  {
    label: 'Servicios',
    href: '#',
    children: [
      { label: 'Licencias de conducir', href: '#' },
      { label: 'Permisos de circulacion', href: '#' },
      { label: 'Aseo y ornato', href: '#' },
    ],
  },
  { label: 'Dideco', href: '#' },
  { label: 'Veterinaria', href: '#' },
  { label: 'Noticias', href: '#' },
  { label: 'Contacto', href: '#' },
]
</script>
