<template>
  <v-overlay
    v-if="pending"
    :model-value="pending"
    class="align-center justify-center"
    scroll-strategy="reposition"
  >
    <v-progress-circular
      color="white"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
  <template v-else>
    <div class="pa-6 post-content" v-if="pageData">
      <h1>{{ pageData?.[0]?.title.rendered ?? "" }}</h1>
      <div v-html="formattedContent"></div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import sanitizeHtml from "sanitize-html";
import type { PageType } from "@/types/page";

const route = useRoute();

// 設定: envファイル読み込みに使用
const config = useRuntimeConfig();

const { data: pageData, pending } = await useAsyncData(
  "fetch-privacy-page-data",
  () =>
    $fetch<PageType[]>(
      `${config.public.WP_API_BASE_URL}/pages?slug=${encodeURIComponent(
        String(route.name)
      )}`
    ),
  {
    lazy: true,
  }
);

// 整形されたコンテンツを保存するためのリアクティブな変数
const formattedContent = computed(() =>
  sanitizeHtml(pageData.value?.[0].content.rendered ?? "<div></div>")
);
useSeoMeta({
  title: () => pageData.value?.[0]?.title.rendered ?? "",
  description: () =>
    `description: ${pageData.value?.[0]?.excerpt.rendered ?? ""}`,
});
</script>
