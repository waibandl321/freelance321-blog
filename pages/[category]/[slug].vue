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
    <div class="post-content" v-if="postData && formattedContent">
      <h1>{{ sanitizeHtml(postData?.[0]?.title.rendered ?? "") }}</h1>
      <div v-html="formattedContent"></div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import sanitizeHtml from "sanitize-html";
import hljs from "highlight.js";
import type { PostType } from "@/types/post";

const route = useRoute();
const slug = route.params.slug;

// 設定: envファイル読み込みに使用
const config = useRuntimeConfig();
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
  description: () =>
    `description: ${postData.value?.[0]?.excerpt.rendered ?? ""}`,
});

/**
 * 整形されたコンテンツを保存するためのリアクティブな変数
 */
const formattedContent = computed(() => convertHighlightElement());

/**
 * WordPressのhighlight code blockで生成された要素をHTML要素に変換する
 * この対応を行うことでコードブロックにCSSが適用されるようになる
 */
const convertHighlightElement = () => {
  if (!isMounted.value) return;
  const dom = document.createElement("div");
  dom.innerHTML = postData.value?.[0].content.rendered ?? "";
  const hcb_elements = dom.querySelectorAll(".hcb_wrap pre");

  for (const element of Array.from(hcb_elements)) {
    const code = element.querySelector("code");
    const lang = element.getAttribute("data-lang");
    if (!lang || !code || !element.textContent) {
      continue;
    }
    // highlight.jsでハイライト
    const result = hljs.highlightAuto(element.textContent);
    code.innerHTML = result.value;

    // 行番号の追加
    const lineNumbersWrapper = document.createElement("span");
    lineNumbersWrapper.setAttribute("aria-hidden", "true");
    lineNumbersWrapper.classList.add("line-numbers-rows");
    const lineCount = element.textContent.split("\n").length;

    for (let i = 0; i < lineCount; i++) {
      const lineNumberSpan = document.createElement("span");
      lineNumbersWrapper.appendChild(lineNumberSpan);
    }

    code.appendChild(lineNumbersWrapper);
  }

  return sanitizeHtml(dom.outerHTML);
};

onMounted(() => {
  isMounted.value = true;
  convertHighlightElement();
});

// -- sanitizeHTMLホワイトリスト -------------- //
sanitizeHtml.defaults.allowedTags = sanitizeHtml.defaults.allowedTags.concat([
  "img",
  "iframe",
]);
sanitizeHtml.defaults.allowedAttributes["iframe"] = ["*"];
sanitizeHtml.defaults.allowedAttributes["*"] = ["class", "style"];
</script>
