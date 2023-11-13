<template>
  <p>{{ category }}/{{ slug }}</p>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const category = route.params.category;
const slug = route.params.slug;

const { data: postData } = await useFetch(
  `https://freelance321.com/wp-json/wp/v2/posts?_embed&slug=${slug}`
);

useSeoMeta({
  title: () => postData.value[0].title.rendered,
  description: () => `description: ${postData.value[0].title.rendered}`,
});
console.log(postData.value[0]);
</script>
