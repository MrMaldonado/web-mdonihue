<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-foreground">Gestionar Funcionarios</h2>
    </div>

    <!-- Formulario para agregar funcionario -->
    <div class="rounded-xl border border-border bg-card p-6">
      <h3 class="mb-4 text-sm font-semibold text-muted-foreground">Agregar nuevo funcionario</h3>
      <form @submit.prevent="handleAddUser" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-card-foreground">Correo</label>
          <input
            v-model="newUser.email"
            type="email"
            placeholder="nombre@municipalidad.cl"
            required
            class="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-card-foreground">Nombre completo</label>
          <input
            v-model="newUser.fullName"
            type="text"
            placeholder="Nombre del funcionario"
            required
            class="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-card-foreground">Departamento</label>
          <select
            v-model="newUser.department"
            required
            class="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            <option value="" disabled>Seleccionar...</option>
            <option value="cesfam">CESFAM</option>
            <option value="educacion">Educacion</option>
            <option value="registro_civil">Registro Civil</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-card-foreground">Contrasena temporal</label>
          <input
            v-model="newUser.password"
            type="text"
            placeholder="Contrasena inicial"
            required
            minlength="6"
            class="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div class="flex items-end sm:col-span-2 lg:col-span-4">
          <button
            type="submit"
            :disabled="adding"
            class="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Loader2 v-if="adding" class="h-4 w-4 animate-spin" />
            <UserPlus v-else class="h-4 w-4" />
            {{ adding ? 'Creando...' : 'Agregar Funcionario' }}
          </button>
        </div>
      </form>

      <!-- Mensajes -->
      <div
        v-if="addSuccessMsg"
        class="mt-4 rounded-lg border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm text-green-400"
      >
        {{ addSuccessMsg }}
      </div>
      <div
        v-if="addErrorMsg"
        class="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        {{ addErrorMsg }}
      </div>
    </div>

    <!-- Lista de funcionarios -->
    <div class="rounded-xl border border-border bg-card p-6">
      <h3 class="mb-4 text-sm font-semibold text-muted-foreground">Funcionarios actuales</h3>

      <div v-if="loadingUsers" class="flex items-center justify-center py-8">
        <Loader2 class="h-6 w-6 animate-spin text-primary" />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border text-left">
              <th class="px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">Nombre</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">Correo</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">Departamento</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">Rol</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-b border-border/50 transition-colors hover:bg-secondary/30"
            >
              <td class="px-4 py-3 text-sm text-card-foreground">{{ user.full_name || 'Sin nombre' }}</td>
              <td class="px-4 py-3 text-sm text-muted-foreground">{{ user.email }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {{ formatDepartment(user.department) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
                    user.role === 'admin'
                      ? 'bg-accent/20 text-accent'
                      : 'bg-secondary text-secondary-foreground'
                  ]"
                >
                  {{ user.role === 'admin' ? 'Admin' : 'Funcionario' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <button
                  v-if="user.role !== 'admin'"
                  @click="deleteUser(user.id)"
                  class="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
                  aria-label="Eliminar funcionario"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="users.length === 0"
          class="py-8 text-center text-sm text-muted-foreground"
        >
          No hay funcionarios registrados.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserPlus, Trash2, Loader2 } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: string
  department: string | null
}

const users = ref<UserProfile[]>([])
const loadingUsers = ref(true)
const adding = ref(false)
const addSuccessMsg = ref('')
const addErrorMsg = ref('')

const newUser = ref({
  email: '',
  fullName: '',
  department: '',
  password: '',
})

onMounted(async () => {
  await fetchUsers()
})

async function fetchUsers() {
  loadingUsers.value = true
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true })

  if (!error && data) {
    users.value = data
  }
  loadingUsers.value = false
}

async function handleAddUser() {
  adding.value = true
  addSuccessMsg.value = ''
  addErrorMsg.value = ''

  try {
    // Crear usuario via Supabase Auth signUp
    const { error } = await supabase.auth.signUp({
      email: newUser.value.email,
      password: newUser.value.password,
      options: {
        data: {
          full_name: newUser.value.fullName,
          role: 'funcionario',
          department: newUser.value.department,
        },
      },
    })

    if (error) throw error

    addSuccessMsg.value = `Funcionario ${newUser.value.fullName} creado exitosamente.`
    newUser.value = { email: '', fullName: '', department: '', password: '' }

    // Refrescar lista despues de un breve delay para que el trigger cree el perfil
    setTimeout(() => fetchUsers(), 1500)
    setTimeout(() => { addSuccessMsg.value = '' }, 3000)
  } catch (err: unknown) {
    addErrorMsg.value = err instanceof Error ? err.message : 'Error al crear funcionario'
  } finally {
    adding.value = false
  }
}

async function deleteUser(userId: string) {
  if (!confirm('Esta seguro de eliminar este funcionario?')) return

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (!error) {
    users.value = users.value.filter((u) => u.id !== userId)
  }
}

function formatDepartment(dept: string | null): string {
  const map: Record<string, string> = {
    cesfam: 'CESFAM',
    educacion: 'Educacion',
    registro_civil: 'Registro Civil',
    otro: 'Otro',
  }
  return dept ? (map[dept] || dept) : 'Sin asignar'
}
</script>
