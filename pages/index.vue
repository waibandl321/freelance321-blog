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
  <div v-else class="pa-6">
    <v-card flat>
      <v-card-title>新着記事</v-card-title>
      <PostCard
        v-for="post in postList"
        :key="post.id"
        :post="post"
        @handleClickPost="handleClickPost"
      />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { PostType } from "@/types/post";
import { useCategoryStore } from "@/stores/categoryStore";
import { storeToRefs } from "pinia";
import PostCard from "@/components/posts/PostCard.vue";

// 設定: envファイル読み込みに使用
const config = useRuntimeConfig();
// vue-router
const router = useRouter();
// store
const categoryStore = useCategoryStore();
const { getgetCategoriesMap } = storeToRefs(categoryStore);

/**
 * 投稿一覧を取得
 */
const fetchPosts = () =>
  $fetch<PostType[]>(`${config.public.WP_API_BASE_URL}/posts?_embed`);

/**
 * データ取得: 並列処理
 */
const fetchData = async () => {
  const postsPromise = fetchPosts();
  const [posts] = await Promise.all([postsPromise]);
  return { posts };
};

const { data, pending } = await useAsyncData(
  "fetch-sitemap-page-data",
  fetchData,
  {
    lazy: true,
  }
);

/**
 * 投稿一覧
 */
const postList = computed(() => data.value?.posts ?? []);

/**
 * metaタグ設定
 */
useHead({
  title: "トップ",
  meta: [{ name: "description", content: "HOMEページのdescriptionです。" }],
});

/**
 * 投稿画面への遷移
 * @param post 投稿データ
 */
const handleClickPost = (post: PostType) => {
  const categorySlug = getgetCategoriesMap.value[post.categories[0]].slug;
  router.push(`/${categorySlug}/${post.slug}/`);
};
</script>
