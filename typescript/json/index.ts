{
  const obj = {
    b: 2,
    a: 1,
    c: {
      e: 4,
      d: 3,
      f: [
        {
          h: 6,
          g: 5,
        },
        {
          i: 7,
          j: 8,
        },
      ],
    },
  };

  // 再起的にソート
  const sortObject = (obj: any) => {
    if (Array.isArray(obj)) {
      return obj.map((item): any => sortObject(item));
    }
    if (typeof obj === "object") {
      return Object.keys(obj)
        .sort()
        .reduce((acc, key) => {
          acc[key] = sortObject(obj[key]);
          return acc;
        }, {} as any);
    }
    return obj;
  };

  console.log(JSON.stringify(obj, null, 2));
  console.log(JSON.stringify(sortObject(obj), null, 2));
}
