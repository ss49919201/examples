// カリー化された関数
function sum(x: number) {
  return function (y: number) {
    return function (z: number) {
      return x + y + z;
    };
  };
}

// 部分適用された関数が返る
const sum1 = sum(1);

console.log(sum1(2)(3));
