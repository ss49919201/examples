// O(√n)
function isPrime(n: number): boolean {
  if (n < 2) {
    return false;
  }

  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}

function assert(condition: boolean): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${condition} is not truthy`);
  }
}

assert(isPrime(2));
assert(isPrime(3));
assert(!isPrime(4));
assert(isPrime(5));
assert(!isPrime(99));
