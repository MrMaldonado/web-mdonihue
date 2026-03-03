<template>
  <div class="flex min-h-screen flex-col bg-background">
    <!-- Banner Superior -->
    <TopBanner />

    <!-- Menu Principal -->
    <MainNav />

    <!-- Contenido Principal -->
    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
      <!-- Fila 1: Banner Principal + Dideco -->
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <HeroBanner />
        </div>
        <div class="lg:col-span-1">
          <DidecoCard />
        </div>
      </div>

      <!-- Fila 2: Noticias + Veterinaria -->
      <div class="mt-8 grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <NewsSection />
        </div>
        <div class="lg:col-span-1">
          <VeterinariaCard />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <SiteFooter />

    <!-- Elementos flotantes -->
    <ChatBot />
    <SocialFab />
    <LiveStreamWidget />
  </div>
</template>

<script setup lang="ts">
import TopBanner from '@/components/TopBanner.vue'
import MainNav from '@/components/MainNav.vue'
import HeroBanner from '@/components/HeroBanner.vue'
import DidecoCard from '@/components/DidecoCard.vue'
import NewsSection from '@/components/NewsSection.vue'
import VeterinariaCard from '@/components/VeterinariaCard.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import SocialFab from '@/components/SocialFab.vue'
import ChatBot from '@/components/ChatBot.vue'
import LiveStreamWidget from '@/components/LiveStreamWidget.vue'
</script>
