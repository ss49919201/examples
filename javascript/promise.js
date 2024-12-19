async function fA() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("fA");
      resolve();
    }, 1000);
  });
}
async function fB() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("fB");
      resolve();
    }, 1000);
  });
}
async function fC() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("fC");
      resolve();
    }, 4000);
  });
}
async function fD(a, b) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("fD");
      resolve();
    }, 1000);
  });
}
async function fE(b, c) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("fE");
      resolve();
    }, 1000);
  });
}
async function fF(d, e) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("fF");
      resolve();
    }, 1000);
  });
}

{
  const a = fA();
  const b = fB();
  const c = fC();
  b.then((b) => {
    return Promise.all([a.then((a) => fD(a, b)), c.then((c) => fE(b, c))]);
  }).then(async (v) => {
    return await fF(v.d, v.e);
  });
}

{
  const a = fA();
  const b = fB();
  const c = fC();
  await b;
  const [d, e] = await Promise.all([
    (async () => {
      const adash = await a;
      return fD(adash, b);
    })(),
    (async () => {
      const cdash = await c;
      return fE(b, cdash);
    })(),
  ]);
  await fF(d, e);
}

{
  const a = fA();
  const b = fB();
  const c = fC();
  await b;
  const [d, e] = await Promise.all([fD(await a, b), fE(b, await c)]);
  await fF(d, e);
}
