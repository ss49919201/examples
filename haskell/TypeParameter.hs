-- 型変数を持つ関数は多相的関数
id' :: a -> a
id' x = x 

main = do
  print $ id [1..10]
