<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <div class="w-full max-w-md">
      <!-- Card de login -->
      <div class="rounded-xl border border-border bg-card p-8 shadow-xl">
        <!-- Header -->
        <div class="mb-8 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Shield class="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 class="text-2xl font-bold text-card-foreground">
            Portal Funcionarios
          </h1>
          <p class="mt-2 text-sm text-muted-foreground">
            Municipalidad de Donihue
          </p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
          <div class="flex flex-col gap-2">
            <label for="email" class="text-sm font-medium text-card-foreground">
              Correo institucional
            </label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="nombre@municipalidad.cl"
                required
                class="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="text-sm font-medium text-card-foreground">
              Contrasena
            </label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Ingresa tu contrasena"
                required
                class="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'"
              >
                <EyeOff v-if="showPassword" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Error -->
          <div
            v-if="errorMsg"
            class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {{ errorMsg }}
          </div>

          <!-- Boton login -->
          <button
            type="submit"
            :disabled="isLoading"
            class="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
            <span>{{ isLoading ? 'Ingresando...' : 'Ingresar' }}</span>
          </button>
        </form>

        <!-- Link a pagina principal -->
        <div class="mt-6 text-center">
          <router-link
            to="/"
            class="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Volver a la pagina principal
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Shield, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  isLoading.value = true
  errorMsg.value = ''

  try {
    await signIn(email.value, password.value)
    router.push('/dashboard')
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('Invalid login credentials')) {
        errorMsg.value = 'Correo o contrasena incorrectos. Intenta de nuevo.'
      } else {
        errorMsg.value = error.message
      }
    } else {
      errorMsg.value = 'Ocurrio un error inesperado. Intenta de nuevo.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
