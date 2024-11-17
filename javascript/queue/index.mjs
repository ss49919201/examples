const newQueue = () => {
  const queue = [];
  return {
    enqueue: (item) => queue.push(item),
    dequeue: () => queue.shift(),
  };
};

const q = newQueue();
const q2 = newQueue();

q.enqueue(1);
q.enqueue(2);
q.enqueue(3);

q2.enqueue(4);

console.log(q.dequeue()); // 1
console.log(q.dequeue()); // 2

console.log(q2.dequeue()); // 4
console.log(q2.dequeue()); // undefined

console.log(q.dequeue()); // 3
