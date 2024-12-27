-- logical operator
logicalOperator = True && False || not False

-- 引数の文字列が Japan の場合のみ True を返す。
isJapan "Japan" = True
isJapan x = False

isJapan' x
  | x == "Japan" = True
  | otherwise = False

main = do
  print logicalOperator -- True
