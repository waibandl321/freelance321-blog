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
    <div class="pa-6" v-if="postList.length > 0">
      <v-list>
        <v-list-item
          v-for="post in postList"
          :key="post.id"
          @click="handleClickPost(post)"
          density="compact"
          lines="two"
          color="primary"
        >
          <v-list-item-title>{{ post.title.rendered }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ post.date }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <InfiniteLoading v-if="!pending" @infinite="infiniteLoadPost" />
    </div>
  </template>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import type { PostType } from "@/types/post";
import type { PageType } from "~/types/page";
import InfiniteLoading from "v3-infinite-loading";
import { storeToRefs } from "pinia";

// vue-router
const route = useRoute();
const router = useRouter();
// 設定: envファイル読み込みに使用
const config = useRuntimeConfig();
// ページング
const perPageCount = 100;
const currentPage = ref(1);
// store
const categoryStore = useCategoryStore();
const { getgetCategoriesMap } = storeToRefs(categoryStore);

const fetchPosts = () =>
  $fetch<PostType[]>(`${config.public.WP_API_BASE_URL}/posts`, {
    params: { per_page: perPageCount, page: currentPage.value },
  });

const fetchData = async () => {
  const pagePromise = $fetch<PageType[]>(
    `${config.public.WP_API_BASE_URL}/pages?slug=${encodeURIComponent(
      String(route.name)
    )}`
  );
  const postsPromise = fetchPosts();
  const [pageData, posts] = await Promise.all([pagePromise, postsPromise]);
  return { pageData, posts };
};
const { data, pending } = await useAsyncData(
  "fetch-sitemap-page-data",
  fetchData,
  {
    lazy: true,
  }
);

/**
 * カテゴリーの投稿一覧
 */
const postList = computed(() => data.value?.posts ?? []);
/**
 * infinite-loadingで記事を追加読み込みする
 * @param $state loadingの状態を管理するstate
 */
const infiniteLoadPost = async ($state: any) => {
  if (postList.value.length < perPageCount) {
    // 記事数が10未満の場合は取得処理を行わない
    $state.complete();
    return;
  }
  try {
    // ページカウントを加算
    currentPage.value++;
    const { data } = await useAsyncData(() => fetchPosts());
    if (data.value) {
      data.value.forEach((post) => {
        postList.value.push(post);
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

useSeoMeta({
  title: () => data.value?.pageData?.[0]?.title.rendered ?? "",
  description: () =>
    `description: ${data.value?.pageData?.[0]?.excerpt.rendered ?? ""}`,
});
</script>
