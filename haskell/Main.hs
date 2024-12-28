-- logical operator
logicalOperator = True && False || not False

-- 引数の文字列が Japan の場合のみ True を返す。
isJapan "Japan" = True
isJapan x = False

isJapan' x
  | x == "Japan" = True
  | otherwise = False

-- 複数回登場する計算結果は where 節で変数に束縛する。
isHideyoNoguchi firstName lastName
  | name == "HideyoNoguchi" = True
  | otherwise = False
  where
    name = firstName ++ lastName

isJsonString s =
  let jsonStringHead = '"'
      jsonStringLast = '"'
   in head s == jsonStringHead && last s == jsonStringLast

isJsonString' s = head s == jsonStringHead && last s == jsonStringLast
  where
    jsonStringHead = '"'
    jsonStringLast = '"'

main = do
  print logicalOperator -- True
  print (isJsonString ['"', 'a', '"'])
  print (isJsonString' ['"', 'a', '"'])
