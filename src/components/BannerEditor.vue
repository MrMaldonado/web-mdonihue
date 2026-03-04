<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-foreground">Editar Slides del Banner</h2>
      <button
        @click="addSlide"
        class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Plus class="h-4 w-4" />
        Agregar Slide
      </button>
    </div>

    <!-- Lista de slides -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <div v-else class="flex flex-col gap-6">
      <div
        v-for="(slide, index) in slides"
        :key="slide.id"
        class="rounded-xl border border-border bg-card p-6"
      >
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-muted-foreground">
            Slide {{ index + 1 }}
          </h3>
          <button
            @click="removeSlide(index)"
            class="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
            aria-label="Eliminar slide"
          >
            <Trash2 class="h-4 w-4" />
          </button>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Columna izquierda: Imagen -->
          <div class="flex flex-col gap-3">
            <label class="text-sm font-medium text-card-foreground">Imagen del banner</label>
            <!-- Preview -->
            <div
              class="relative flex h-48 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-background"
            >
              <img
                v-if="slide.image_url"
                :src="slide.image_url"
                :alt="slide.alt"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon class="h-10 w-10" />
                <span class="text-sm">Sin imagen</span>
              </div>
            </div>
            <!-- Upload -->
            <div class="flex items-center gap-3">
              <label
                :for="'file-' + index"
                class="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                <Upload class="h-4 w-4" />
                Subir foto
              </label>
              <input
                :id="'file-' + index"
                type="file"
                accept="image/*"
                class="hidden"
                @change="(e) => handleFileUpload(e, index)"
              />
              <span class="text-xs text-muted-foreground">
                Resolucion recomendada: 1920 x 600px
              </span>
            </div>
            <!-- Upload progress -->
            <div v-if="slide._uploading" class="flex items-center gap-2 text-sm text-primary">
              <Loader2 class="h-4 w-4 animate-spin" />
              Subiendo imagen...
            </div>
          </div>

          <!-- Columna derecha: Campos de texto -->
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-card-foreground">Etiqueta (badge)</label>
              <input
                v-model="slide.badge"
                type="text"
                placeholder="Ej: Bienvenidos"
                class="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-card-foreground">Titulo</label>
              <input
                v-model="slide.title"
                type="text"
                placeholder="Ej: Municipalidad de Donihue"
                class="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-card-foreground">Descripcion</label>
              <textarea
                v-model="slide.description"
                rows="3"
                placeholder="Descripcion del slide"
                class="resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje si no hay slides -->
      <div
        v-if="slides.length === 0"
        class="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-muted-foreground"
      >
        <ImageIcon class="mb-3 h-12 w-12" />
        <p class="text-sm">No hay slides. Agrega uno para empezar.</p>
      </div>
    </div>

    <!-- Boton guardar -->
    <div class="flex justify-end">
      <button
        @click="saveSlides"
        :disabled="saving"
        class="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
        <Save v-else class="h-4 w-4" />
        {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
      </button>
    </div>

    <!-- Mensaje exito -->
    <div
      v-if="successMsg"
      class="rounded-lg border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm text-green-400"
    >
      {{ successMsg }}
    </div>
    <div
      v-if="errorMsg"
      class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      {{ errorMsg }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Trash2, Upload, Save, Loader2, ImageIcon } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

interface Slide {
  id?: string
  image_url: string
  alt: string
  badge: string
  title: string
  description: string
  sort_order: number
  _uploading?: boolean
  _isNew?: boolean
}

const slides = ref<Slide[]>([])
const loading = ref(true)
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

onMounted(async () => {
  await fetchSlides()
})

async function fetchSlides() {
  loading.value = true
  const { data, error } = await supabase
    .from('banner_slides')
    .select('*')
    .order('sort_order', { ascending: true })

  if (!error && data) {
    slides.value = data.map((s) => ({ ...s, _uploading: false, _isNew: false }))
  }
  loading.value = false
}

function addSlide() {
  slides.value.push({
    image_url: '',
    alt: '',
    badge: '',
    title: '',
    description: '',
    sort_order: slides.value.length,
    _uploading: false,
    _isNew: true,
  })
}

function removeSlide(index: number) {
  const slide = slides.value[index]
  if (slide.id && !slide._isNew) {
    // Marcar para eliminar en Supabase al guardar
    slidesToDelete.push(slide.id)
  }
  slides.value.splice(index, 1)
}

const slidesToDelete: string[] = []

async function handleFileUpload(event: Event, index: number) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const slide = slides.value[index]
  slide._uploading = true
  errorMsg.value = ''

  try {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const { error: uploadError } = await supabase.storage
      .from('banner-images')
      .upload(fileName, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data: publicData } = supabase.storage
      .from('banner-images')
      .getPublicUrl(fileName)

    slide.image_url = publicData.publicUrl
    slide.alt = file.name
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Error al subir la imagen'
  } finally {
    slide._uploading = false
  }
}

async function saveSlides() {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''

  try {
    // Eliminar slides marcados
    for (const id of slidesToDelete) {
      await supabase.from('banner_slides').delete().eq('id', id)
    }
    slidesToDelete.length = 0

    // Upsert slides
    for (let i = 0; i < slides.value.length; i++) {
      const slide = slides.value[i]
      const payload = {
        image_url: slide.image_url,
        alt: slide.alt,
        badge: slide.badge,
        title: slide.title,
        description: slide.description,
        sort_order: i,
        updated_at: new Date().toISOString(),
      }

      if (slide._isNew || !slide.id) {
        const { data, error } = await supabase
          .from('banner_slides')
          .insert(payload)
          .select()
          .single()
        if (error) throw error
        if (data) {
          slides.value[i] = { ...data, _uploading: false, _isNew: false }
        }
      } else {
        const { error } = await supabase
          .from('banner_slides')
          .update(payload)
          .eq('id', slide.id)
        if (error) throw error
        slides.value[i]._isNew = false
      }
    }

    successMsg.value = 'Cambios guardados exitosamente.'
    setTimeout(() => { successMsg.value = '' }, 3000)
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Error al guardar los cambios'
  } finally {
    saving.value = false
  }
}
</script>
