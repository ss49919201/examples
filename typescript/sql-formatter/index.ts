import { format } from "sql-formatter";

console.log(
  format(
    `SELECT * FROM
        tbl
    WHERE 1 = 1
    
    
    
    AND 2 = 2
    
    AND 3 = 3
`
  )
);

/*
Output:
SELECT
  *
FROM
  tbl
WHERE
  1 = 1
  AND 2 = 2
  AND 3 = 3
*/
