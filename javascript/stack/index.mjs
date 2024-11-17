function newStack() {
  const stack = [];
  return {
    push: function push(item) {
      stack.push(item);
    },
    pop: function pop() {
      return stack.pop();
    },
    get length() {
      return stack.length;
    },
  };
}

const s = newStack();

s.push(1);
s.push(2);
s.push(3);

console.log(s.length); // 3
console.log(s.pop()); // 3
console.log(s.pop()); // 2
console.log(s.pop()); // 1
console.log(s.pop()); // undefined
