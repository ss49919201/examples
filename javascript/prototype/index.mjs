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

// constructor function
function User(name, age) {
  this.name = name;
  this.age = age;
}

User.static = function () {
  console.log("static method");
};

console.log(new User("John", 30));
User.static();
