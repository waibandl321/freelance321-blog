<template>
  <p>{{ category }}/{{ slug }}</p>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

type Post = {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
};

const route = useRoute();
const category = route.params.category;
const slug = route.params.slug;

const { data: postData } = await useFetch<Post[]>(
  `https://freelance321.com/wp-json/wp/v2/posts?_embed&slug=${slug}`
);

useSeoMeta({
  title: () => postData.value?.[0]?.title.rendered ?? "Default Title",
  description: () =>
    `description: ${
      postData.value?.[0]?.excerpt.rendered ?? "Default Description"
    }`,
});
</script>
