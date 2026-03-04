<template>
  <div class="flex min-h-screen flex-col bg-background">
    <!-- Loading state -->
    <div v-if="authLoading" class="flex min-h-screen items-center justify-center">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <template v-else>
      <!-- Dashboard Nav -->
      <DashboardNav
        :active-tab="activeTab"
        :user-name="profile?.full_name || 'Funcionario'"
        :user-department="formatDepartment(profile?.department || '')"
        :is-admin="profile?.role === 'admin'"
        @change-tab="activeTab = $event"
        @logout="handleLogout"
      />

      <!-- Contenido -->
      <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <BannerEditor v-if="activeTab === 'banner'" />
        <AdminPanel v-else-if="activeTab === 'admin' && profile?.role === 'admin'" />
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import DashboardNav from '@/components/DashboardNav.vue'
import BannerEditor from '@/components/BannerEditor.vue'
import AdminPanel from '@/components/AdminPanel.vue'

const router = useRouter()
const { profile, loading: authLoading, signOut } = useAuth()

const activeTab = ref('banner')

async function handleLogout() {
  await signOut()
  router.push('/login')
}

function formatDepartment(dept: string): string {
  const map: Record<string, string> = {
    cesfam: 'CESFAM',
    educacion: 'Educacion',
    registro_civil: 'Registro Civil',
    otro: 'Otro',
  }
  return map[dept] || dept || 'Sin asignar'
}
</script>
