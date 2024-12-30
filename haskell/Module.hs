import Data.Char
import Data.Map qualified as M

filterMap = M.filter

encoded = chr . (+) 1 . ord

decoded = chr . flip (-) 1 . ord

main = do
  print 1
  let enced = encoded 'a'
  print enced
  print $ decoded enced