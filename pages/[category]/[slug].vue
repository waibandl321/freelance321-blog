<template>
  <div class="post-content">
    <h1>{{ postData?.[0]?.title.rendered ?? "" }}</h1>
    <div v-html="formattedContent"></div>
  </div>
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

const { data: postData } = await useFetch<PostType[]>(
  `${config.public.WP_API_BASE_URL}/posts?_embed&slug=${slug}`
);

useSeoMeta({
  title: () => postData.value?.[0]?.title.rendered ?? "Default Title",
  description: () =>
    `description: ${
      postData.value?.[0]?.excerpt.rendered ?? "Default Description"
    }`,
});

const formattedContent = ref(""); // 整形されたコンテンツを保存するためのリアクティブな変数

onMounted(() => {
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

  formattedContent.value = sanitizeHtml(dom.outerHTML);
});

// -- sanitizeHTMLホワイトリスト -------------- //
sanitizeHtml.defaults.allowedTags = sanitizeHtml.defaults.allowedTags.concat([
  "img",
  "iframe",
]);
sanitizeHtml.defaults.allowedAttributes["iframe"] = ["*"];
sanitizeHtml.defaults.allowedAttributes["*"] = ["class", "style"];
</script>
