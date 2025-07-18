mergeSort :: (Ord a) => [a] -> [a]
mergeSort [] = []
mergeSort [x] = [x]
mergeSort xs = merge (mergeSort left) (mergeSort right)
  where
    (left, right) = splitAt (length xs `div` 2) xs

merge :: (Ord a) => [a] -> [a] -> [a]
merge [] ys = ys
merge xs [] = xs
merge (x:xs) (y:ys)
  | x <= y = x : merge xs (y:ys)
  | otherwise = y : merge (x:xs) ys

main :: IO ()
main = do
  let unsorted = [64, 34, 25, 12, 22, 11, 90]
  putStrLn "Original list:"
  print unsorted
  putStrLn "Sorted list:"
  print (mergeSort unsorted)
  
  let stringList = ["banana", "apple", "cherry", "date"]
  putStrLn "Original string list:"
  print stringList
  putStrLn "Sorted string list:"
  print (mergeSort stringList)
