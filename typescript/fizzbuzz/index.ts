type FizzBuzzStrategy = {
  predicate: (n: number) => boolean;
  output: string;
};

const fizz: FizzBuzzStrategy = {
  predicate: (n) => n % 3 === 0,
  output: "Fizz",
};

const buzz: FizzBuzzStrategy = {
  predicate: (n) => n % 5 === 0,
  output: "Buzz",
};

const fizzbuzz = (
  numbers: number[],
  strategies: FizzBuzzStrategy[]
): string => {
  return numbers
    .map((n) => {
      const result = strategies
        .filter(({ predicate }) => predicate(n))
        .map(({ output }) => output)
        .join("");

      return result === "" ? n.toString() : result;
    })
    .join("\n");
};

const run = (n: number) => {
  const strategies: FizzBuzzStrategy[] = [fizz, buzz];

  const result = fizzbuzz(
    Array.from({ length: n }).map((_, n) => n + 1),
    strategies
  );

  console.log(result);
};

run(50);
