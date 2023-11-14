export interface CategoryType {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  // 以下は表示用のカスタムプロパティ
  children?: Array<CategoryType>;
  linkTo?: string;
}
