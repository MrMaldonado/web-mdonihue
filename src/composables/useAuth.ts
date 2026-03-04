import { ref, readonly } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'funcionario'
  department: string | null
  created_at: string
}

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const profile = ref<Profile | null>(null)
const loading = ref(true)

let initialized = false

function initAuth() {
  if (initialized) return
  initialized = true

  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
    user.value = data.session?.user ?? null
    if (user.value) {
      fetchProfile(user.value.id)
    }
    loading.value = false
  })

  supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession
    user.value = newSession?.user ?? null
    if (user.value) {
      fetchProfile(user.value.id)
    } else {
      profile.value = null
    }
  })
}

async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (!error && data) {
    profile.value = data as Profile
  }
}

async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  user.value = null
  session.value = null
  profile.value = null
}

export function useAuth() {
  initAuth()

  return {
    user: readonly(user),
    session: readonly(session),
    profile: readonly(profile),
    loading: readonly(loading),
    signIn,
    signOut,
    fetchProfile,
  }
}
