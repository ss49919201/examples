function quickSort(array: Array<number>): Array<number> {
  if (array.length < 2) {
    return array;
  }

  // ピボットを決める
  const pivotIndex = Math.floor(array.length / 2);
  const pivot = array[pivotIndex];

  // ピボットより左側
  const left = array.slice(0, pivotIndex);

  // ピボットより右側
  const right = array.slice(pivotIndex + 1);

  // 左側にピボットより大きい値があれば抽出する
  const newLeft: number[] = [];
  const toRight: number[] = [];
  for (const v of left) {
    if (v > pivot) {
      toRight.push(v);
    } else {
      newLeft.push(v);
    }
  }

  // 右側にピボットより小さい値があれば抽出する
  const newRight: number[] = [];
  const toLeft: number[] = [];
  for (const v of right) {
    if (v < pivot) {
      toLeft.push(v);
    } else {
      newRight.push(v);
    }
  }

  newLeft.push(...toLeft);
  newRight.push(...toRight);

  return [...quickSort(newLeft), pivot, ...quickSort(newRight)];
}

console.log(quickSort([2]));
console.log(quickSort([2, 4]));
console.log(quickSort([2, 4, 6]));
console.log(quickSort([2, 4, 6, 8]));
console.log(quickSort([5, 2, 4, 6, 8, 1]));
console.log(quickSort([5, 2, 9, 2, 1, 4, 6, 8, 1]));
