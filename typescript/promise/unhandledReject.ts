// UnhandledPromiseRejection が発生するとプロセスが強制終了

{
  // UnhandledPromiseRejection が発生する
  new Promise((_, reject) => {
    reject("REJECT");
  });
}

{
  // catch しているので、UnhandledPromiseRejection は発生しない
  new Promise((_, reject) => {
    reject("REJECT");
  }).catch((e) => {
    console.log(e);
  });
}

{
  // then でハンドラを登録しているが、ハンドラの戻り値も連鎖的に reject になるため、UnhandledPromiseRejection は発生する
  new Promise((_, reject) => {
    reject("REJECT");
  }).then((e) => {
    console.log(e);
  });
}

{
  // async 無名関数内で発生する error を関数内で catch しておらず、呼び出し元でもハンドラ登録していないので、UnhandledPromiseRejection は発生する
  (async () => {
    await new Promise((_, reject) => {
      reject("REJECT");
    });
  })();
}

{
  // UnhandledPromiseRejection は発生しない
  const promise = (async () => {
    try {
      await new Promise((_, reject) => {
        reject("REJECT");
      });
    } catch (err) {
      throw err;
    }
  })().catch((err) => console.error(err));
}

{
  // UnhandledPromiseRejection は発生しない
  (async () => {
    try {
      await new Promise((_, reject) => {
        reject("REJECT");
      });
    } catch (err) {
      console.error(err);
    }
  })();
}
