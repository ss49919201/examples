Array.from({ length: 3 }).forEach(async (_, idx) => {
  console.log(idx);
  const res = await fetch("https://google.com");
  console.log(res.status);
});
