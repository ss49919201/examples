interface Article {
  title: string;
  body: string;
  status: "draft" | "published";
}

export interface SavedArticle extends Article {
  id: number;
  createdAt: Date;
}

export interface PublishedArticle extends SavedArticle {
  status: "published";
  publishedAt: Date;
}

export function constructArticle(title: string, body: string): Article {
  return { title, body, status: "draft" };
}

export function reconstructArticle(
  id: number,
  article: Article,
  createdAt: Date
): SavedArticle {
  return { id, ...article, createdAt };
}

export function publish(article: SavedArticle): PublishedArticle {
  return { ...article, status: "published", publishedAt: new Date() };
}
