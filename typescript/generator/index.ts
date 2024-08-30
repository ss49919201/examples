function* makeGenerator() {
  yield "hello";
  yield "world";
}

{
  const generator = makeGenerator();

  console.log(generator.next()); // { value: 'hello', done: false }
  console.log(generator.next()); // { value: 'world', done: false }
  console.log(generator.next()); // { value: undefined, done: true }
}

{
  const generator = makeGenerator();

  for (const value of generator) {
    console.log(value);
  }
}

function* makeGenerator2() {
  yield* ["hello", "world"];
}

{
  for (const value of makeGenerator2()) {
    console.log(value);
  }
}
