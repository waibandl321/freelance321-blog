<template>
  <v-app-bar elevation="1" class="px-4">
    <v-btn v-for="link in links" :key="link.to" :to="link.to" variant="text">{{
      link.text
    }}</v-btn>

    <v-spacer></v-spacer>

    <v-responsive max-width="250">
      <v-text-field
        density="compact"
        flat
        hide-details
        label="サイト内記事検索"
        rounded="lg"
        single-line
        variant="solo-filled"
      ></v-text-field>
    </v-responsive>
  </v-app-bar>
</template>

<script setup>
const links = [
  { text: "TOP", to: "/" },
  { text: "全記事一覧", to: "/sitemap" },
  { text: "プライバシーポリシー", to: "/privacy" },
  { text: "当サイトについて", to: "/about" },
];
</script>
