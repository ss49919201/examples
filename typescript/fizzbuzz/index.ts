type FizzBuzzStrategy = (n: number) => string;

const fizz: FizzBuzzStrategy = (n: number) => {
  if (n % 3 !== 0) {
    return "";
  }
  return "Fizz";
};
const buzz: FizzBuzzStrategy = (n: number) => {
  if (n % 5 !== 0) {
    return "";
  }
  return "Buzz";
};

const fizzbuzz = (
  numbers: number[],
  strategies: FizzBuzzStrategy[]
): string => {
  return numbers
    .map((n) => {
      const result = strategies.map((strategy) => strategy(n)).join("");
      if (result === "") {
        return n.toString();
      }
      return result;
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
