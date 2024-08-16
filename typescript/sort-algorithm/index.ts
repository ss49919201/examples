function assert(expr: boolean, msg?: string): void {
  if (!expr) throw new Error("Assertion Error" + (msg ? `: ${msg}` : ""));
}

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
  // 前から後ろに向かって大きい値を浮かび上がらせる
  for (let i = array.length - 1; i >= 0; i--) {
    for (let j = 0; j < i; j++) {
      if (array[j] > array[j + 1]) {
        let jv = array[j];
        array[j] = array[j + 1];
        array[j + 1] = jv;
      }
    }
  }

  return array;
}

console.log(quickSort([2]));
console.log(quickSort([2, 4]));
console.log(quickSort([2, 4, 6]));
console.log(quickSort([2, 4, 6, 8]));
console.log(quickSort([5, 2, 4, 6, 8, 1]));
console.log(quickSort([5, 2, 9, 2, 1, 4, 6, 8, 1]));

console.log(bubbleSort([2]));
console.log(bubbleSort([2, 4]));
console.log(bubbleSort([2, 4, 6]));
console.log(bubbleSort([2, 4, 6, 8]));
console.log(bubbleSort([5, 2, 4, 6, 8, 1]));
console.log(bubbleSort([5, 2, 9, 2, 1, 4, 6, 8, 1]));
