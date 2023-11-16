<template>
  <v-dialog v-model="isOpen" max-width="80%">
    <v-card elevation="10">
      <v-card-title class="pa-4"
        >検索結果: {{ searchResults.length }}件</v-card-title
      >
      <v-divider></v-divider>
      <v-list v-if="searchResults.length > 0">
        <v-list-item
          v-for="item in searchResults"
          :key="item.id"
          @click="handleClickPost(item)"
        >
          {{ item.title.rendered }}
        </v-list-item>
      </v-list>
      <v-card-text v-else class="pa-4"> データがありません </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-4 flex-end">
        <v-btn variant="outlined" size="large" @click="$emit('close')"
          >閉じる</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type { PostType } from "@/types/post";
import type { PropType } from "vue";
import { usePost } from "@/composables/usePost";

const { moveToPostPage } = usePost();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  searchResults: {
    type: Array as PropType<PostType[]>,
    default: [],
  },
});

const emits = defineEmits<{ (e: "close"): void }>();

const isOpen = computed(() => props.isOpen);

/**
 * 記事詳細画面への遷移
 */
const handleClickPost = (item: PostType) => {
  emits("close");
  moveToPostPage(item);
};
</script>
