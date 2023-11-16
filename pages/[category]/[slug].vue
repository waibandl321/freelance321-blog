<template>
  <LoadingOverlay :loading="pending" />
  <div class="post-content" v-if="postData && formattedContent">
    <h1>{{ sanitizeHtml(postData?.[0]?.title.rendered ?? "") }}</h1>
    <div v-html="formattedContent"></div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import sanitizeHtml from "sanitize-html";
import type { PostType } from "@/types/post";
import { usePost } from "@/composables/usePost";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

const route = useRoute();
const slug = route.params.slug;

// 設定: envファイル読み込みに使用
const config = useRuntimeConfig();
// composable function
const { convertHighlightElement } = usePost();
// 初回描画フラグ
const isMounted = ref(false);

const { data: postData, pending } = await useAsyncData(
  `fetch-post-${slug}-key`,
  () =>
    $fetch<PostType[]>(
      `${config.public.WP_API_BASE_URL}/posts?_embed&slug=${slug}`
    ),
  {
    lazy: true,
  }
);

useSeoMeta({
  title: () => postData.value?.[0]?.title.rendered ?? "",
  description: () => postData.value?.[0]?.excerpt.rendered ?? "",
});

/**
 * 整形されたコンテンツを保存するためのリアクティブな変数
 */
const formattedContent = computed(() =>
  convertHighlightElement(isMounted.value, postData.value?.[0])
);

onMounted(async () => {
  isMounted.value = true;
});

// -- sanitizeHTMLホワイトリスト -------------- //
sanitizeHtml.defaults.allowedTags = sanitizeHtml.defaults.allowedTags.concat([
  "img",
  "iframe",
]);
sanitizeHtml.defaults.allowedAttributes["iframe"] = ["*"];
sanitizeHtml.defaults.allowedAttributes["*"] = ["class", "style"];
</script>
