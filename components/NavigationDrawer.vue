<template>
  <v-navigation-drawer v-model="drawer">
    <v-sheet color="grey-lighten-4" class="pa-4">
      <v-avatar class="mb-4" color="grey-darken-1" size="64">
        <v-img src="/favicon.jpeg" />
      </v-avatar>
      <div>Jumpei Onishi</div>
    </v-sheet>
    <v-divider></v-divider>
    <v-list>
      <template v-for="category in structuredCategories" :key="category.id">
        <div v-if="category.children && category.children.length > 0">
          <!-- 子カテゴリがある場合は v-list-group を使用 -->
          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <v-list-item-content>
                  <v-list-item-title>{{ category.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item
              v-for="categoryChild in category.children"
              :key="categoryChild.id"
            >
              <v-list-item-content>
                <v-list-item-title>{{ categoryChild.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </div>
        <v-list-item v-else>
          <!-- 子カテゴリがない場合は通常のリストアイテムを表示 -->
          <v-list-item-content>
            <v-list-item-title>{{ category.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
type Category = {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
};

const { data: categories } = await useFetch<Category[]>(
  `https://freelance321.com/wp-json/wp/v2/categories?per_page=20`
);

// 親子関係をマッピングする関数
function mapCategories(categoryList: Category[]) {
  // 親カテゴリを見つける
  const parents = categoryList.filter((cat) => cat.parent === 0);
  // 各親カテゴリに対して子カテゴリを見つける
  return parents
    .map((parent) => {
      const children = categoryList.filter((cat) => cat.parent === parent.id);
      return { ...parent, children };
    })
    .filter((v) => v.id !== 14 && v.id !== 1);
}

// 階層構造に変換したカテゴリデータ
const structuredCategories = computed(() =>
  mapCategories(categories.value ?? [])
);

const drawer = ref(null);
</script>
