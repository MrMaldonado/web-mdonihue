<template>
  <nav class="border-b border-border bg-secondary text-secondary-foreground">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      <!-- Logo y titulo -->
      <div class="flex items-center gap-3">
        <router-link to="/" class="flex items-center gap-2 text-primary hover:text-primary/80">
          <Shield class="h-6 w-6" />
          <span class="text-lg font-bold">Panel Funcionarios</span>
        </router-link>
      </div>

      <!-- Tabs de navegacion -->
      <div class="hidden items-center gap-1 md:flex">
        <button
          @click="$emit('changeTab', 'banner')"
          :class="[
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'banner'
              ? 'bg-primary text-primary-foreground'
              : 'text-secondary-foreground hover:bg-primary/20 hover:text-primary'
          ]"
        >
          <span class="flex items-center gap-2">
            <ImageIcon class="h-4 w-4" />
            Editar Banner
          </span>
        </button>
        <button
          v-if="isAdmin"
          @click="$emit('changeTab', 'admin')"
          :class="[
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'admin'
              ? 'bg-primary text-primary-foreground'
              : 'text-secondary-foreground hover:bg-primary/20 hover:text-primary'
          ]"
        >
          <span class="flex items-center gap-2">
            <Users class="h-4 w-4" />
            Funcionarios
          </span>
        </button>
      </div>

      <!-- Info del usuario -->
      <div class="flex items-center gap-4">
        <div class="hidden text-right sm:block">
          <p class="text-sm font-medium text-secondary-foreground">{{ userName }}</p>
          <p class="text-xs text-muted-foreground">{{ userDepartment }}</p>
        </div>
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {{ userInitials }}
        </div>
        <button
          @click="$emit('logout')"
          class="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
          aria-label="Cerrar sesion"
        >
          <LogOut class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Mobile tabs -->
    <div class="flex items-center gap-1 border-t border-border px-4 py-2 md:hidden">
      <button
        @click="$emit('changeTab', 'banner')"
        :class="[
          'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          activeTab === 'banner'
            ? 'bg-primary text-primary-foreground'
            : 'text-secondary-foreground hover:bg-primary/20'
        ]"
      >
        Editar Banner
      </button>
      <button
        v-if="isAdmin"
        @click="$emit('changeTab', 'admin')"
        :class="[
          'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          activeTab === 'admin'
            ? 'bg-primary text-primary-foreground'
            : 'text-secondary-foreground hover:bg-primary/20'
        ]"
      >
        Funcionarios
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Shield, ImageIcon, Users, LogOut } from 'lucide-vue-next'

const props = defineProps<{
  activeTab: string
  userName: string
  userDepartment: string
  isAdmin: boolean
}>()

defineEmits<{
  changeTab: [tab: string]
  logout: []
}>()

const userInitials = computed(() => {
  if (!props.userName) return '?'
  return props.userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})
</script>
