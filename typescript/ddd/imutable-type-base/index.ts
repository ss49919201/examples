type Article = {
  title: string;
  body: string;
  status: "draft" | "published";
};

export type SavedArticle = Article & {
  id: number;
  createdAt: Date;
};

export type PublishedArticle = SavedArticle & {
  status: "published";
  publishedAt: Date;
};

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
