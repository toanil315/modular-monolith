export namespace CategoryCachingKey {
  export const CATEGORIES = 'CATEGORIES';
  export const CATEGORY = (categoryId: string) => `CATEGORY:${categoryId}`;
}
