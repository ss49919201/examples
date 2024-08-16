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

function bubbleSort(array: Array<number>): Array<number> {
  const result: typeof array = [];
  let tmp: typeof array = array;
  for (let i = 0; i < array.length; i++) {
    let max = tmp[0];
    let maxIdx = 0;
    for (const [j, v] of tmp.entries()) {
      if (max < v) {
        maxIdx = j;
        max = v;
      }
    }
    result.push(max);
    tmp = [...tmp.slice(0, maxIdx), ...tmp.slice(maxIdx + 1)];
  }
  return result.reverse();
}

// console.log(quickSort([2]));
// console.log(quickSort([2, 4]));
// console.log(quickSort([2, 4, 6]));
// console.log(quickSort([2, 4, 6, 8]));
// console.log(quickSort([5, 2, 4, 6, 8, 1]));
// console.log(quickSort([5, 2, 9, 2, 1, 4, 6, 8, 1]));

console.log(bubbleSort([2]));
console.log(bubbleSort([2, 4]));
console.log(bubbleSort([2, 4, 6]));
console.log(bubbleSort([2, 4, 6, 8]));
console.log(bubbleSort([5, 2, 4, 6, 8, 1]));
console.log(bubbleSort([5, 2, 9, 2, 1, 4, 6, 8, 1]));
