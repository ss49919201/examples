function quickSort(array: Array<number>): Array<number> {
  if (array.length < 2) {
    return array;
  }

  // ピボットを決める
  const pivotIndex = Math.floor(array.length / 2);
  const pivot = array[pivotIndex];

  const left: typeof array = [];
  const right: typeof array = [];

  for (const [i, v] of array.entries()) {
    if (i === pivotIndex) continue;

    if (v < pivot) {
      left.push(v);
    } else {
      right.push(v);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

console.log(quickSort([2]));
console.log(quickSort([2, 4]));
console.log(quickSort([2, 4, 6]));
console.log(quickSort([2, 4, 6, 8]));
console.log(quickSort([5, 2, 4, 6, 8, 1]));
console.log(quickSort([5, 2, 9, 2, 1, 4, 6, 8, 1]));
