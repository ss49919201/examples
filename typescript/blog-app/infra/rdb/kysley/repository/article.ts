import { GetArticleById } from "../../../../domain/repository/article";
import { db } from "../driver";

export const getArticleById: GetArticleById = async (id: number) => {
  const article = await db
    .selectFrom("article")
    .where("id", "=", id)
    .select(["id", "title", "body", "created_at"])
    .executeTakeFirst();

  return (
    article && {
      id: article.id,
      title: article.title,
      body: article.body,
      createdAt: article.created_at,
    }
  );
};
