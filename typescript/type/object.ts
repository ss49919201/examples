function callToString(val: { toString: () => string } & object) {
  console.log(val.toString());
}

callToString({ toString: () => "Hello" }); // Hello
callToString("Hello"); // Error: Argument of type 'string' is not assignable to parameter of type '{ toString: () => string; } & object'.
