<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-primary">Noticias y Notificaciones</h2>
      <div class="flex items-center gap-2">
        <button
          class="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
          aria-label="Noticia anterior"
          @click="scrollPrev"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>
        <button
          class="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
          aria-label="Noticia siguiente"
          @click="scrollNext"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
        <a
          href="#"
          class="ml-2 flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Ver todas
          <ArrowRight class="h-4 w-4" />
        </a>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
      <span class="ml-3 text-sm text-muted-foreground">Cargando noticias...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
      <AlertCircle class="mx-auto h-8 w-8 text-destructive" />
      <p class="mt-2 text-sm text-destructive">{{ error }}</p>
      <button
        class="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        @click="fetchNews"
      >
        Reintentar
      </button>
    </div>

    <!-- Carrusel de noticias -->
    <template v-else>
      <div ref="emblaRef" class="overflow-hidden rounded-xl">
        <div class="flex gap-4">
          <article
            v-for="item in newsItems"
            :key="item.id"
            class="min-w-0 flex-[0_0_100%] sm:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(33.333%-11px)]"
          >
            <div class="group flex h-full flex-col rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-primary/40">
              <!-- Imagen -->
              <div class="relative h-40 w-full bg-secondary overflow-hidden">
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.title"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div v-else class="flex h-full items-center justify-center">
                  <ImageIcon class="h-10 w-10 text-muted-foreground/30" />
                </div>
              </div>
              <div class="flex flex-1 flex-col p-5">
                <span
                  v-if="item.category"
                  class="mb-2 inline-block w-fit rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary"
                >
                  {{ item.category }}
                </span>
                <h3 class="mb-2 text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {{ item.title }}
                </h3>
                <p class="mb-3 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {{ item.excerpt }}
                </p>
                <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays class="h-3.5 w-3.5" />
                  {{ item.date }}
                </div>
                <a
                  v-if="item.permalink"
                  :href="item.permalink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Ver en Facebook
                  <ExternalLink class="h-3 w-3" />
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Indicadores -->
      <div class="flex justify-center gap-1.5">
        <button
          v-for="(_, i) in scrollSnaps"
          :key="i"
          :class="[
            'h-1.5 rounded-full transition-all',
            i === selectedIndex
              ? 'w-5 bg-primary'
              : 'w-1.5 bg-foreground/20 hover:bg-foreground/40',
          ]"
          :aria-label="`Ir a grupo ${i + 1}`"
          @click="scrollTo(i)"
        />
      </div>

      <!-- Indicador de fuente -->
      <div v-if="source === 'facebook'" class="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Facebook class="h-3.5 w-3.5" />
        Noticias desde Facebook
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import {
  CalendarDays,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  ExternalLink,
  Loader2,
  AlertCircle,
  Facebook,
} from 'lucide-vue-next'

// ===== CONFIGURACION DE LA API DE FACEBOOK =====
// Pon aqui tu Page ID y Access Token de Facebook
const FB_PAGE_ID = ''
const FB_ACCESS_TOKEN = ''
const FB_API_VERSION = 'v25.0'
// ================================================

interface NewsItem {
  id: string
  title: string
  date: string
  category?: string
  excerpt: string
  image?: string
  permalink?: string
}

const newsItems = ref<NewsItem[]>([])
const loading = ref(true)
const error = ref('')
const source = ref<'facebook' | 'local'>('local')

const [emblaRef, emblaApi] = emblaCarouselVue({ loop: true, align: 'start', slidesToScroll: 1 })
const selectedIndex = ref(0)
const scrollSnaps = ref<number[]>([])

let autoplayInterval: ReturnType<typeof setInterval> | null = null

function scrollPrev() { emblaApi.value?.scrollPrev() }
function scrollNext() { emblaApi.value?.scrollNext() }
function scrollTo(index: number) { emblaApi.value?.scrollTo(index) }

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
}

function extractTitle(message: string): string {
  const firstLine = message.split('\n')[0]
  return firstLine.length > 80 ? firstLine.slice(0, 80) + '...' : firstLine
}

function extractExcerpt(message: string): string {
  const lines = message.split('\n').filter(l => l.trim())
  const text = lines.length > 1 ? lines.slice(1).join(' ') : lines[0]
  return text.length > 150 ? text.slice(0, 150) + '...' : text
}

async function fetchFromFacebook(): Promise<NewsItem[]> {
  const fields = 'id,message,created_time,full_picture,permalink_url,attachments'
  const url = `https://graph.facebook.com/${FB_API_VERSION}/${FB_PAGE_ID}/feed?fields=${fields}&limit=10&access_token=${FB_ACCESS_TOKEN}`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Error al obtener publicaciones de Facebook')

  const json = await res.json()
  const posts = json.data || []

  return posts
    .filter((p: Record<string, unknown>) => p.message)
    .map((p: Record<string, unknown>) => ({
      id: p.id as string,
      title: extractTitle(p.message as string),
      date: formatDate(p.created_time as string),
      category: 'Facebook',
      excerpt: extractExcerpt(p.message as string),
      image: (p.full_picture as string) || '',
      permalink: (p.permalink_url as string) || '',
    }))
}

function getLocalNews(): NewsItem[] {
  return [
    {
      id: '1',
      title: 'Mejoras en el alumbrado publico del sector centro',
      date: '28 Feb 2026',
      category: 'Obras',
      excerpt: 'Se inician obras de modernizacion del alumbrado publico en las principales calles del centro de Doñihue.',
      image: '',
    },
    {
      id: '2',
      title: 'Inscripciones abiertas para talleres de verano',
      date: '25 Feb 2026',
      category: 'Comunidad',
      excerpt: 'La municipalidad abre inscripciones para talleres deportivos y culturales durante la temporada estival.',
      image: '',
    },
    {
      id: '3',
      title: 'Campaña de vacunacion para mascotas',
      date: '22 Feb 2026',
      category: 'Veterinaria',
      excerpt: 'Jornada gratuita de vacunacion antirrabica para perros y gatos de la comuna.',
      image: '',
    },
    {
      id: '4',
      title: 'Nuevo centro comunitario en sector sur',
      date: '20 Feb 2026',
      category: 'Infraestructura',
      excerpt: 'Se inaugura nuevo centro comunitario con espacios para actividades deportivas y culturales.',
      image: '',
    },
    {
      id: '5',
      title: 'Plan de emergencia invernal 2026',
      date: '18 Feb 2026',
      category: 'Seguridad',
      excerpt: 'La municipalidad presenta su plan de contingencia para enfrentar la temporada de lluvias.',
      image: '',
    },
  ]
}

async function fetchNews() {
  loading.value = true
  error.value = ''

  try {
    if (FB_PAGE_ID && FB_ACCESS_TOKEN) {
      newsItems.value = await fetchFromFacebook()
      source.value = 'facebook'
    } else {
      newsItems.value = getLocalNews()
      source.value = 'local'
    }
  } catch (e) {
    console.error('Error cargando noticias:', e)
    // Fallback a noticias locales si falla Facebook
    newsItems.value = getLocalNews()
    source.value = 'local'
  } finally {
    loading.value = false
    await nextTick()
    initCarousel()
  }
}

function initCarousel() {
  const api = emblaApi.value
  if (!api) return
  api.reInit()
  const onSelect = () => { selectedIndex.value = api.selectedScrollSnap() }
  scrollSnaps.value = api.scrollSnapList()
  api.on('select', onSelect)
  onSelect()
  if (autoplayInterval) clearInterval(autoplayInterval)
  autoplayInterval = setInterval(() => { api.scrollNext() }, 6000)
}

onMounted(() => {
  fetchNews()
})

onUnmounted(() => {
  if (autoplayInterval) clearInterval(autoplayInterval)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
