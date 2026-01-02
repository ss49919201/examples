-- Merge Sort Implementation
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

-- Quick Sort Implementation
quickSort :: (Ord a) => [a] -> [a]
quickSort [] = []
quickSort (x:xs) = quickSort smaller ++ [x] ++ quickSort larger
  where
    smaller = [a | a <- xs, a <= x]
    larger = [b | b <- xs, b > x]

main :: IO ()
main = do
  let unsorted = [64, 34, 25, 12, 22, 11, 90]
  putStrLn "Original list:"
  print unsorted
  
  putStrLn "\nMerge Sort:"
  print (mergeSort unsorted)
  
  putStrLn "\nQuick Sort:"
  print (quickSort unsorted)
  
  let stringList = ["banana", "apple", "cherry", "date"]
  putStrLn "\nOriginal string list:"
  print stringList
  putStrLn "Merge Sort (strings):"
  print (mergeSort stringList)
  putStrLn "Quick Sort (strings):"
  print (quickSort stringList)
