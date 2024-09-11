export type Article = PublishedArticle | DraftArticle;

interface _Article {
  title: string;
  body: string;
  status: "draft" | "published";
}

export interface SavedArticle extends _Article {
  id: number;
  createdAt: Date;
}

export interface PublishedArticle extends _Article {
  status: "published";
  publishedAt: Date;
}

export interface DraftArticle extends _Article {
  status: "draft";
}

export function constructArticle(title: string, body: string): Article {
  return { title, body, status: "draft" };
}

export function reconstructArticle(
  id: number,
  article: _Article,
  createdAt: Date
): SavedArticle {
  return { id, ...article, createdAt };
}

export function publishArticle(article: SavedArticle): PublishedArticle {
  return { ...article, status: "published", publishedAt: new Date() };
}

export function isArticlePublished(
  article: Article
): article is PublishedArticle {
  return article.status === "published";
}
