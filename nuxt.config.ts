import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  devServer: {
    host: "localhost",
    port: 80
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
  modules: ["@nuxt/eslint", "nuxt-auth-utils", "shadcn-nuxt"],
  eslint: {
    // options here
  },
  runtimeConfig: {
    session: {
      name: "nuxt-session",
      password: process.env.NUXT_SESSION_PASSWORD || "",
      cookie: {
        domain: '.localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      },
      maxAge: 60 * 60 * 24 * 7, // 1 week
    },
  },
  nitro: {
    experimental: {
      tasks: true,
      database: true,
      websocket: true,
    },
    storage: {
      redis: {
        driver: "redis",
        /* redis connector options */
      },
      db: {
        driver: "fs",
        base: "./.data/db",
      },
    },
    database: {
      default: {
        connector: "sqlite",
        options: { name: "db" },
      },
      users: {
        connector: "sqlite",
        options: { name: "db" },
      },
    },
    scheduledTasks: {
      // Run `cms:update` task every minute
      //'* * * * *': ['cms:update']
    },
  },
  auth: {
    webAuthn: true,
  },
});