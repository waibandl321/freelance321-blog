<template>
  <div v-if="categoryPosts.length > 0" class="pa-6">
    <v-card
      v-for="post in categoryPosts"
      :key="post.id"
      elevation="4"
      class="mb-6"
      @click="handleClickPost(post)"
    >
      <v-row>
        <v-col cols="2"><v-img :src="postFeatureImgPath(post)" cover /></v-col>
        <v-col>
          <v-card-title
            v-html="sanitizeHtml(post.title.rendered)"
          ></v-card-title>
          <v-card-subtitle>{{ post.date }}</v-card-subtitle>
          <v-card-text
            v-html="sanitizeHtml(post.excerpt.rendered)"
          ></v-card-text>
        </v-col>
      </v-row>
    </v-card>
    <InfiniteLoading @infinite="infiniteLoadPost" />
  </div>
  <div v-else class="pa-6">データはありません</div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import sanitizeHtml from "sanitize-html";
import type { PostType } from "@/types/post";
import { useCategoryStore } from "@/stores/categoryStore";
import { storeToRefs } from "pinia";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";

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
const { data } = await useFetch<PostType[]>(
  `${config.public.WP_API_BASE_URL}/posts?_embed&categories=${targetCategory.value?.id}&per_page=${perPageCount}&page=${currentPage.value}`
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
 * サムネイルURLを返す
 */
const postFeatureImgPath = (post: PostType) => {
  return (
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
    "/images/comming-soon.png"
  );
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
