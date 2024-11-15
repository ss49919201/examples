const superObj = {
  count: 0,
  increment() {
    this.count++;
  },
};

const subObj = Object.create(superObj);
subObj.decrement = function () {
  this.count--;
};

superObj.increment();
subObj.increment();
subObj.increment();
subObj.decrement();

console.log(superObj.count);
console.log(subObj.count);
