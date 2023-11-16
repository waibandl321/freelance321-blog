import type { PostType } from "~/types/post";

export function useSearchPost() {
  const config = useRuntimeConfig();

  const fetchSearchPosts = async (searchText: string) => {
    const perPageCount = 20;
    return await $fetch<PostType[]>(
      `${config.public.WP_API_BASE_URL}/posts?search=${encodeURIComponent(
        searchText
      )}`,
      {
        params: { per_page: perPageCount },
      }
    );
  };

  return {
    fetchSearchPosts,
  };
}
