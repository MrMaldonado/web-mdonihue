<template>
  <div class="relative overflow-hidden rounded-xl border border-border bg-card">
    <div ref="emblaRef" class="overflow-hidden">
      <div class="flex">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="min-w-0 flex-[0_0_100%]"
        >
          <div class="relative min-h-[320px] md:min-h-[380px] overflow-hidden">
            <!-- Imagen del slide -->
            <img
              v-if="slide.image"
              :src="slide.image"
              :alt="slide.alt"
              class="absolute inset-0 h-full w-full object-cover"
            />
            <!-- Placeholder cuando no hay imagen -->
            <div
              v-else
              class="absolute inset-0 flex flex-col items-center justify-center bg-secondary"
            >
              <ImageIcon class="h-16 w-16 text-muted-foreground/30" />
              <span class="mt-2 text-sm text-muted-foreground/50">Slide {{ index + 1 }} - Agregar imagen</span>
            </div>
            <!-- Overlay oscuro para legibilidad -->
            <div v-if="slide.title" class="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
            <!-- Contenido superpuesto -->
            <div v-if="slide.title" class="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8">
              <span
                v-if="slide.badge"
                class="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
              >
                {{ slide.badge }}
              </span>
              <h2 class="mb-2 text-2xl font-bold leading-tight text-foreground md:text-3xl text-balance">
                {{ slide.title }}
              </h2>
              <p v-if="slide.description" class="max-w-lg text-sm leading-relaxed text-muted-foreground">
                {{ slide.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Controles -->
    <button
      class="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
      aria-label="Anterior"
      @click="scrollPrev"
    >
      <ChevronLeft class="h-5 w-5" />
    </button>
    <button
      class="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
      aria-label="Siguiente"
      @click="scrollNext"
    >
      <ChevronRight class="h-5 w-5" />
    </button>

    <!-- Indicadores -->
    <div class="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
      <button
        v-for="(_, i) in slides"
        :key="i"
        :class="[
          'h-2 rounded-full transition-all',
          i === selectedIndex
            ? 'w-6 bg-primary'
            : 'w-2 bg-foreground/30 hover:bg-foreground/50',
        ]"
        :aria-label="`Ir a slide ${i + 1}`"
        @click="scrollTo(i)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

interface Slide {
  image?: string
  alt: string
  badge?: string
  title?: string
  description?: string
}

// Fallback por defecto
const defaultSlides: Slide[] = [
  {
    alt: 'Banner principal 1',
    badge: 'Bienvenidos',
    title: 'Municipalidad de Donihue',
    description: 'Trabajamos por el bienestar y desarrollo de nuestra comuna.',
  },
  {
    alt: 'Banner principal 2',
    badge: 'Servicios',
    title: 'Tramites en linea',
    description: 'Realiza tus tramites municipales de forma rapida y segura.',
  },
  {
    alt: 'Banner principal 3',
    badge: 'Comunidad',
    title: 'Programas Sociales',
    description: 'Descubre los programas y beneficios disponibles para tu familia.',
  },
]

const slides = ref<Slide[]>(defaultSlides)

const [emblaRef, emblaApi] = emblaCarouselVue({ loop: true })
const selectedIndex = ref(0)

let autoplayInterval: ReturnType<typeof setInterval> | null = null

function scrollPrev() { emblaApi.value?.scrollPrev() }
function scrollNext() { emblaApi.value?.scrollNext() }
function scrollTo(index: number) { emblaApi.value?.scrollTo(index) }

async function loadSlidesFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('banner_slides')
      .select('*')
      .order('sort_order', { ascending: true })

    if (!error && data && data.length > 0) {
      slides.value = data.map((s) => ({
        image: s.image_url || undefined,
        alt: s.alt || '',
        badge: s.badge || undefined,
        title: s.title || undefined,
        description: s.description || undefined,
      }))
      // Reiniciar embla despues de actualizar slides
      await nextTick()
      emblaApi.value?.reInit()
    }
  } catch {
    // Si falla la carga, usa los slides por defecto
  }
}

onMounted(async () => {
  await loadSlidesFromSupabase()

  const api = emblaApi.value
  if (!api) return
  const onSelect = () => { selectedIndex.value = api.selectedScrollSnap() }
  api.on('select', onSelect)
  onSelect()
  autoplayInterval = setInterval(() => { api.scrollNext() }, 5000)
})

onUnmounted(() => {
  if (autoplayInterval) clearInterval(autoplayInterval)
})
</script>
