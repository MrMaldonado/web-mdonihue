import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Guard de navegacion para rutas protegidas
router.beforeEach(async (to, _from, next) => {
  if (to.meta.requiresAuth) {
    if (!isSupabaseConfigured || !supabase) {
      next({ name: 'login' })
      return
    }
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
