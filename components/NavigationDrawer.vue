<template>
  <v-navigation-drawer v-model="drawer" v-if="!pending">
    <v-sheet color="grey-lighten-4" class="pa-4">
      <v-avatar class="mb-4" color="grey-darken-1" size="64">
        <v-img src="/favicon.jpeg" />
      </v-avatar>
      <div>Jumpei Onishi</div>
    </v-sheet>
    <v-divider></v-divider>

    <v-list>
      <!-- 子カテゴリがある場合は v-list-group を使用 -->
      <template v-for="category in structuredCategories" :key="category.id">
        <v-list-item :title="category.name" :to="category.linkTo">
        </v-list-item>
        <template v-if="category.children && category.children.length > 0">
          <v-list-item
            v-for="categoryChild in category.children"
            :key="categoryChild.id"
            :title="categoryChild.name"
            :to="categoryChild.linkTo"
            class="ml-4"
          ></v-list-item>
        </template>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import type { CategoryType } from "@/types/category";
import { useCategoryStore } from "@/stores/categoryStore";

// 設定: envファイル読み込みに使用
const config = useRuntimeConfig();
// store
const store = useCategoryStore();
/**
 * 階層構造に変換したカテゴリデータ
 */
const structuredCategories = ref<CategoryType[]>([]);

/**
 * 親子関係をマッピングする関数
 * @param categoryList カテゴリ一覧
 */
const mapCategories = (categoryList: CategoryType[]) => {
  // 親カテゴリを見つける
  const parentCategories = categoryList.filter((cat) => cat.parent === 0);
  // 各親カテゴリに対して子カテゴリを見つける
  return parentCategories
    .map((parentCategory) => {
      const children = categoryList
        .filter((cat) => cat.parent === parentCategory.id)
        .map((v: CategoryType) => {
          return {
            ...v,
            linkTo: `/${v.slug}/`,
          };
        });
      return {
        ...parentCategory,
        children,
        linkTo: `/${parentCategory.slug}/`,
      };
    })
    .filter((v) => v.id !== 14 && v.id !== 1);
};

/**
 * カテゴリ一覧取得
 */

const { data, pending } = await useAsyncData(
  "fetch-categories-key",
  () =>
    $fetch<CategoryType[]>(
      `${config.public.WP_API_BASE_URL}/categories?per_page=20`
    ),
  {
    lazy: true,
  }
);
structuredCategories.value = mapCategories(data.value ?? []);
store.storeSetCategories(data.value ?? []);
const drawer = ref(null);
</script>
