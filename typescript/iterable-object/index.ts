const iterable = {
  [Symbol.iterator]() {
    let counter = 1;
    return {
      next() {
        return {
          done: counter > 5,
          value: counter++,
        };
      },
    };
  },
};

for (const value of iterable) {
  console.log(value);
}

console.log([...iterable]);

const [first, second, ...rest] = iterable;
console.log(first, second, rest);

Promise.all(iterable).then((values) => console.log(values));
