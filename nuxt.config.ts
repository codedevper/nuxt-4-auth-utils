import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    experimental: {
      tasks: true,
      websocket: true,
      database: true
    },
    storage: {
      redis: {
        driver: 'redis',
        /* redis connector options */
      },
      db: {
        driver: 'fs',
        base: './.data/db'
      }
    },
    database: {
      default: {
        connector: 'sqlite',
        options: { name: 'db' }
      },
      users: {
        connector: 'sqlite',
        options: { name: 'db' }
      }
    }
  },

  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui'
  },
  modules: ['nuxt-auth-utils', 'shadcn-nuxt']
})