<template>
  <v-card elevation="4" class="mb-6" @click="$emit('handleClickPost', post)">
    <v-row>
      <v-col cols="2"><v-img :src="postFeatureImgPath(post)" cover /></v-col>
      <v-col>
        <v-card-title v-html="sanitizeHtml(post.title.rendered)"></v-card-title>
        <v-card-subtitle>{{ post.date }}</v-card-subtitle>
        <v-card-text v-html="sanitizeHtml(post.excerpt.rendered)"></v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import type { PostType } from "@/types/post";
import sanitizeHtml from "sanitize-html";

/**
 * props
 */
defineProps<{
  post: PostType;
}>();

/**
 * サムネイルURLを返す
 */
const postFeatureImgPath = (post: PostType) => {
  return (
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
    "/images/comming-soon.png"
  );
};
</script>
