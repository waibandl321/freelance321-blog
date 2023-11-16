<template>
  <v-app-bar elevation="1" class="px-4">
    <v-btn v-for="link in links" :key="link.to" :to="link.to" variant="text">{{
      link.text
    }}</v-btn>
    <v-spacer></v-spacer>
    <v-responsive max-width="250">
      <v-text-field
        density="compact"
        flat
        hide-details
        label="サイト内記事検索"
        rounded="lg"
        single-line
        variant="solo-filled"
        v-model.trim="state.searchText"
        @input="state.debouncedSearch"
      ></v-text-field>
    </v-responsive>
  </v-app-bar>

  <LoadingOverlay v-if="state.searchLoading" :loading="state.searchLoading" />

  <SearchResultDialog
    v-if="state.isDisplaySearchResult"
    :searchResults="state.searchResults"
    :isOpen="state.isDisplaySearchResult"
    @close="
      () => {
        state.isDisplaySearchResult = false;
        state.searchText = '';
      }
    "
  />
</template>

<script setup lang="ts">
import type { PostType } from "~/types/post";
import { useSearchPost } from "@/composables/useSearchPost";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import SearchResultDialog from "@/components/search/SearchResultDialog.vue";

const { fetchSearchPosts } = useSearchPost();

const state = reactive({
  searchText: "",
  searchResults: [] as PostType[],
  isDisplaySearchResult: false,
  searchLoading: false,
  debouncedSearch: null as (() => void) | null,
});

/**
 * 検索処理を実行
 */
const searchArticles = async () => {
  if (!state.searchText) return;
  state.searchLoading = true;
  try {
    state.searchResults = await fetchSearchPosts(state.searchText);
    state.isDisplaySearchResult = true;
  } catch (error) {
    console.log(`Error #searchArticles: ${error}`);
  } finally {
    state.searchLoading = false;
  }
};

onBeforeMount(async () => {
  // Debounce 関数の設定
  state.debouncedSearch = useDebounce(searchArticles, 500);
});

/**
 * ナビゲーションリンク
 */
const links = [
  { text: "TOP", to: "/" },
  { text: "プライバシーポリシー", to: "/privacy/" },
  { text: "当サイトについて", to: "/profile/" },
  { text: "全記事一覧", to: "/sitemap/" },
];
</script>
