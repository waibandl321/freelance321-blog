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
    <div v-if="categoryPosts.length > 0" class="pa-6">
      <PostCard
        v-for="post in categoryPosts"
        :key="post.id"
        :post="post"
        @handleClickPost="handleClickPost"
      />
      <InfiniteLoading @infinite="infiniteLoadPost" />
    </div>
  </template>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import type { PostType } from "@/types/post";
import { useCategoryStore } from "@/stores/categoryStore";
import { storeToRefs } from "pinia";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import PostCard from "~/components/posts/PostCard.vue";

// vue-router
const route = useRoute();
const router = useRouter();
// 設定: envファイル読み込みに使用
const config = useRuntimeConfig();
// store
const categoryStore = useCategoryStore();
const { getgetCategoriesMap, categories } = storeToRefs(categoryStore);
// ページング
const perPageCount = 10;
const currentPage = ref(1);

/**
 * 対象のカテゴリー
 */
const targetCategory = computed(() =>
  categories.value.find((category) => category.slug === route.params.category)
);

/**
 * カテゴリの記事一覧取得処理
 */
const { data, pending } = await useAsyncData(
  `fetch-category-post-${route.params.category}-key`,
  () =>
    $fetch<PostType[]>(
      `${config.public.WP_API_BASE_URL}/posts?_embed&categories=${targetCategory.value?.id}&per_page=${perPageCount}&page=${currentPage.value}`
    ),
  {
    lazy: true,
  }
);

/**
 * カテゴリーの投稿一覧
 */
const categoryPosts = computed(() => data.value ?? []);

/**
 * infinite-loadingで記事を追加読み込みする
 * @param $state loadingの状態を管理するstate
 */
const infiniteLoadPost = async ($state: any) => {
  if (categoryPosts.value.length < perPageCount) {
    // 記事数が10未満の場合は取得処理を行わない
    $state.complete();
    return;
  }
  try {
    // ページカウントを加算
    currentPage.value++;
    const { data: posts } = await useFetch<PostType[]>(
      `${config.public.WP_API_BASE_URL}/posts?_embed&categories=${targetCategory.value?.id}&per_page=${perPageCount}&page=${currentPage.value}`
    );
    if (posts.value) {
      posts.value.forEach((post) => {
        categoryPosts.value.push(post);
      });
    } else {
      $state.complete();
    }
  } catch (error) {
    console.log(error);
    $state.complete();
  }
};

/**
 * 投稿画面への遷移
 * @param post 投稿データ
 */
const handleClickPost = (post: PostType) => {
  const categorySlug = getgetCategoriesMap.value[post.categories[0]].slug;
  router.push(`/${categorySlug}/${post.slug}/`);
};
</script>
