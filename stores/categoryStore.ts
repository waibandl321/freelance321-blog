import { defineStore } from "pinia";
import type { CategoryType } from "@/types/category";

interface ItemMap {
  [key: number]: CategoryType;
}

export const useCategoryStore = defineStore("category-store", {
  state: () => ({
    categories: [] as CategoryType[],
  }),
  getters: {
    getCategories: (state) => state.categories,
    /**
     * カテゴリIDをキーとするオブジェクトの配列
     */
    getgetCategoriesMap: (state) => {
      return state.categories.reduce((obj: ItemMap, item: CategoryType) => {
        obj[item.id] = item;
        return obj;
      }, {});
    },
  },
  actions: {
    storeSetCategories(categories: CategoryType[]) {
      this.categories = categories;
    },
  },
});
