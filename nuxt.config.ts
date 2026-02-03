// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 1. ADICIONE O MÓDULO AQUI:
  modules: ['@nuxtjs/tailwindcss'],

  // 2. DIGA ONDE ESTÁ SEU CSS GLOBAL (Vamos criar jajá):
  css: ['~/assets/css/main.css']
})
