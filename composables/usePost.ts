import sanitizeHtml from "sanitize-html";
import hljs from "highlight.js";
import type { PostType } from "@/types/post";

export function usePost() {
  /**
   * WordPressのhighlight code blockで生成された要素をHTML要素に変換する
   * この対応を行うことでコードブロックにCSSが適用されるようになる
   */
  const convertHighlightElement = (
    isMounted: boolean,
    postData: PostType | undefined
  ) => {
    if (!isMounted || !postData) return;
    const dom = document.createElement("div");
    dom.innerHTML = postData.content.rendered ?? "";

    const ezTocCounter = dom.querySelectorAll(".ez-toc-counter li a");
    ezTocCounter.forEach((element) => {
      element.removeAttribute("href");
    });

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

  return {
    convertHighlightElement,
  };
}
