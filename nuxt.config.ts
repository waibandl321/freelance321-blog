// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      WP_API_BASE_URL: process.env.WP_API_BASE_URL,
    },
  },
  nitro: {
    preset: "aws-lambda",
    serveStatic: false,
  },
  modules: ["@invictus.codes/nuxt-vuetify", "@nuxt/image", "@pinia/nuxt"],
  pinia: {
    storesDirs: ["./stores/**"],
  },
  vuetify: {
    vuetifyOptions: {
      // @TODO: list all vuetify options
    },
    moduleOptions: {
      /* nuxt-vuetify module options */
      treeshaking: true,
      useIconCDN: true,
      /* vite-plugin-vuetify options */
      // styles: true | 'none' | 'expose' | 'sass' | { configFile: string },
      // autoImport: true | false,
      // useVuetifyLabs: true | false,
    },
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
  app: {
    head: {
      link: [{ rel: "icon", href: "/favicon.jpeg" }],
    },
  },
  css: ["/assets/css/post.css", "/assets/css/highlight.css"],
});
