class Article {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly body: string,
    public readonly status: "draft" | "published" = "draft",
    public readonly createdAt: Date = new Date(),
    public readonly publishedAt?: Date
  ) {}

  public static withoutId(title: string, body: string): Article {
    return new Article(0, title, body);
  }

  public isPublished(): boolean {
    return this.status === "published" && !!this.publishedAt;
  }

  public publish(): Article {
    if (this.isPublished()) {
      return new Article(
        this.id,
        this.title,
        this.body,
        this.status,
        this.createdAt,
        this.publishedAt
      );
    }

    return new Article(
      this.id,
      this.title,
      this.body,
      "published",
      this.createdAt,
      new Date()
    );
  }
}

const articleMapper = {
  do: (article: Article) => {
    return {
      id: article.id,
      title: article.title,
      body: article.body,
      status: article.status,
      createdAt: article.createdAt,
      publishedAt: article.publishedAt,
    };
  },
};

const findArticleById = (
  id: number
): Promise<ReturnType<(typeof articleMapper)["do"]>> => {
  const article = new Article(id, "title", "body", "published"); // DUMMY
  return new Promise((resolve) => {
    resolve(articleMapper.do(article));
  });
};

const saveArticle = (article: Article): Promise<void> => {
  return new Promise((resolve) => {
    resolve();
  });
};
