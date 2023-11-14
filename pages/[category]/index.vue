<template>
  <div v-if="categoryPosts.length > 0" class="pa-6">
    <v-card
      v-for="post in categoryPosts"
      :key="post.id"
      elevation="4"
      class="mb-6"
      @click="handleClickPost(post)"
    >
      <template v-slot:title>
        {{ post.title.rendered }}
      </template>

      <template v-slot:subtitle>
        {{ post.date }}
      </template>

      <template v-slot:text>
        <div v-html="sanitizeHtml(truncateText(post.excerpt.rendered))"></div>
      </template>
    </v-card>
  </div>
  <div v-else>データはありません</div>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import sanitizeHtml from "sanitize-html";

type Post = {
  id: number;
  date: string;
  slug: string;
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
const categoryId = route.query.id;
const categoryPosts = ref([]) as Ref<Post[]>;

console.log("categoryId", categoryId);

const { data } = await useFetch<Post[]>(
  `https://freelance321.com/wp-json/wp/v2/posts?categories=${encodeURIComponent(
    String(categoryId)
  )}&per_page=100&page=1`
);
categoryPosts.value = data.value ?? [];

const truncateText = (text: string, maxLength = 150) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substr(0, maxLength) + "...";
};

const handleClickPost = (post: Post) => {
  console.log(post);
};
</script>
