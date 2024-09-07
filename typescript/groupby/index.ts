{
  const arr = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 27 },
    { name: "Alice", age: 30 },
    { name: "Bob", age: 35 },
    { name: "Alice", age: 40 },
    { name: "Bob", age: 45 },
  ];

  console.log(Object.groupBy(arr, (item) => item.age));
  /**
   *
    [Object: null prototype] {
        '25': [ { name: 'Alice', age: 25 } ],
        '27': [ { name: 'Bob', age: 27 } ],
        '30': [ { name: 'Alice', age: 30 } ],
        '35': [ { name: 'Bob', age: 35 } ],
        '40': [ { name: 'Alice', age: 40 } ],
        '45': [ { name: 'Bob', age: 45 } ]
    }
   */
  console.log(Object.groupBy(arr, (item) => item.name));
  const g = Object.groupBy(arr, (item) => item.name);
  /**
   * 
    [Object: null prototype] {
    Alice: [
        { name: 'Alice', age: 25 },
        { name: 'Alice', age: 30 },
        { name: 'Alice', age: 40 }
    ],
    Bob: [
        { name: 'Bob', age: 27 },
        { name: 'Bob', age: 35 },
        { name: 'Bob', age: 45 }
    ]
    }
   */
}
