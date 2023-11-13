<template>
  <v-navigation-drawer v-model="drawer">
    <v-sheet color="grey-lighten-4" class="pa-4">
      <v-avatar class="mb-4" color="grey-darken-1" size="64">
        <v-img src="/favicon.jpeg" />
      </v-avatar>
      <div>Jumpei Onishi</div>
    </v-sheet>
    <v-divider></v-divider>
    <v-list>
      <v-list-item
        v-for="[icon, text] in links"
        :key="icon"
        :prepend-icon="icon"
        :title="text"
        link
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
const links = [
  ["mdi-inbox-arrow-down", "Inbox"],
  ["mdi-send", "Send"],
  ["mdi-delete", "Trash"],
  ["mdi-alert-octagon", "Spam"],
];
const drawer = ref(null);
</script>
