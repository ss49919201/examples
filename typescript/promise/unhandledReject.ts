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
