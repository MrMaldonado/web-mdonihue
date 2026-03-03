<template>
  <div class="fixed bottom-24 left-6 z-50 flex flex-col items-center gap-3">
    <!-- Boton circular del chatbot -->
    <button
      :class="[
        'flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all',
        chatOpen
          ? 'bg-foreground text-background'
          : 'bg-primary text-primary-foreground',
      ]"
      :aria-label="chatOpen ? 'Cerrar chat' : 'Abrir chat'"
      @click="chatOpen = !chatOpen"
    >
      <X v-if="chatOpen" class="h-6 w-6" />
      <MessageCircle v-else class="h-6 w-6" />
    </button>

    <!-- Panel del chat -->
    <Transition name="chat">
      <div
        v-if="chatOpen"
        class="absolute bottom-16 left-0 w-80 overflow-hidden rounded-xl border border-primary/40 bg-card shadow-2xl shadow-primary/10"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 bg-primary px-4 py-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20">
            <Bot class="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p class="text-sm font-bold text-primary-foreground">Asistente Municipal</p>
            <p class="text-xs text-primary-foreground/70">En linea</p>
          </div>
          <button
            class="ml-auto flex h-7 w-7 items-center justify-center rounded text-primary-foreground/80 transition-colors hover:bg-primary-foreground/20 hover:text-primary-foreground"
            aria-label="Cerrar chat"
            @click="chatOpen = false"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <!-- Mensajes -->
        <div ref="messagesContainer" class="flex flex-col gap-3 p-4 h-72 overflow-y-auto">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="[
              'max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
              msg.from === 'bot'
                ? 'self-start bg-secondary text-secondary-foreground rounded-bl-none'
                : 'self-end bg-primary text-primary-foreground rounded-br-none',
            ]"
          >
            {{ msg.text }}
          </div>
          <div v-if="isTyping" class="self-start flex items-center gap-1 bg-secondary rounded-xl rounded-bl-none px-3.5 py-2.5">
            <span class="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style="animation-delay: 0ms" />
            <span class="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style="animation-delay: 150ms" />
            <span class="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style="animation-delay: 300ms" />
          </div>
        </div>

        <!-- Opciones rapidas -->
        <div class="flex flex-wrap gap-1.5 border-t border-border px-4 py-2">
          <button
            v-for="option in quickOptions"
            :key="option"
            class="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/40"
            @click="sendQuick(option)"
          >
            {{ option }}
          </button>
        </div>

        <!-- Input -->
        <div class="flex items-center gap-2 border-t border-border px-4 py-3">
          <input
            v-model="userInput"
            type="text"
            placeholder="Escribe tu consulta..."
            class="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            @keydown.enter="sendMessage"
          />
          <button
            class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
            aria-label="Enviar mensaje"
            @click="sendMessage"
          >
            <Send class="h-4 w-4" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { MessageCircle, X, Bot, Send } from 'lucide-vue-next'

interface ChatMessage {
  from: 'bot' | 'user'
  text: string
}

const chatOpen = ref(false)
const userInput = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const messages = ref<ChatMessage[]>([
  { from: 'bot', text: 'Hola, soy el asistente virtual de la Municipalidad de Doñihue. ¿En que puedo ayudarte?' },
])

const quickOptions = ['Horarios', 'Tramites', 'Veterinaria', 'Contacto']

const botResponses: Record<string, string> = {
  horarios: 'Nuestro horario de atencion es de Lunes a Viernes de 08:00 a 17:00 hrs.',
  tramites: 'Puedes realizar tramites como permisos de circulacion y licencias de conducir en nuestra oficina o en linea.',
  veterinaria: 'La Veterinaria Municipal ofrece consultas, vacunacion y esterilizacion gratuita para mascotas de la comuna.',
  contacto: 'Puedes contactarnos al telefono +56 72 123 4567 o al correo contacto@donihue.cl.',
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function sendQuick(option: string) {
  userInput.value = option
  sendMessage()
}

function sendMessage() {
  const text = userInput.value.trim()
  if (!text) return
  messages.value.push({ from: 'user', text })
  userInput.value = ''
  scrollToBottom()

  isTyping.value = true
  setTimeout(() => {
    isTyping.value = false
    const key = text.toLowerCase()
    const matched = Object.keys(botResponses).find((k) => key.includes(k))
    messages.value.push({
      from: 'bot',
      text: matched
        ? botResponses[matched]
        : 'Gracias por tu consulta. Un funcionario se pondra en contacto contigo pronto. Tambien puedes llamarnos al +56 72 123 4567.',
    })
    scrollToBottom()
  }, 1200)
}
</script>

<style scoped>
.chat-enter-active,
.chat-leave-active {
  transition: all 0.3s ease;
}
.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
