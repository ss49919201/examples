const sql = `SELECT
    *
FROM users
WHERE id = 1

AND name = 'John'
`;

console.log(sql.replace(/\s+/g, " "));
