import { Article } from "../model/article";

export type GetArticleById = (id: number) => Promise<Article | undefined>;
export type GetArticlesByIds = (ids: number[]) => Promise<Article[]>;
export type GetArticlesPaginated = (
  page: number,
  perPage: number
) => Promise<{ articles: Article[]; total: number }>;
