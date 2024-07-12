const buildQuery = (userName?: string, password?: string) => {
  // 基本クエリの構築
  let query = "SELECT * FROM users";

  // パラメータとプレースホルダ
  const params: string[] = [];

  // usernameが存在する場合の条件追加
  if (userName) {
    params.push("username = ?");
  }

  // passwordが存在する場合の条件追加
  if (password) {
    params.push("password = ?");
  }

  // パラメータが存在する場合のみWHERE句を追加
  if (params.length > 0) {
    query += " WHERE " + params.join(" AND ");
  }

  return { query, params };
};

const { query, params } = buildQuery("john_doe", "securepassword");
console.log("Query:", query);
console.log("Params:", params);
