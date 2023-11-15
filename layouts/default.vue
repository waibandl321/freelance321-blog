<template>
  <v-app id="inspire">
    <AppBar />
    <NavigationDrawer />
    <v-main>
      <Suspense>
        <template #fallback>
          <NuxtLoadingIndicator />
        </template>
        <template #default>
          <slot />
        </template>
      </Suspense>
    </v-main>
  </v-app>
</template>
