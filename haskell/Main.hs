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

-- \ は λ に見えるのでラムダ式
filterNot1or3 = filter $ \x -> x /= 1 && x /= 3

-- 関数合成
composite = sum . filter (10 >) . take 3

-- ポイントフリースタイルで右端の変数を省略
-- fnUsingPointFreeStyle x = replicate 5 x
fnUsingPointFreeStyle = replicate 5

main = do
  print logicalOperator -- True
  print $ isJsonString ['"', 'a', '"']
  print $ isJsonString' ['"', 'a', '"']
