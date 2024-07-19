import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface Database {
  article: ArticleTable;
}

export interface ArticleTable {
  id: Generated<number>;

  title: string;
  body: string;

  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, never>;
}

export type Article = Selectable<ArticleTable>;
export type NewArticle = Insertable<ArticleTable>;
export type ArticleUpdate = Updateable<ArticleTable>;
