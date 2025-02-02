import Cloudflare from "cloudflare";

const CLOUDFLARE_ACCOUNT_ID = (() => {
  const email = process.env["CLOUDFLARE_ACCOUNT_ID"];
  if (typeof email === "undefined")
    throw new Error("CLOUDFLARE_ACCOUNT_ID is undefined");
  return email;
})();
const CLOUDFLARE_EMAIL = (() => {
  const email = process.env["CLOUDFLARE_EMAIL"];
  if (typeof email === "undefined")
    throw new Error("CLOUDFLARE_EMAIL is undefined");
  return email;
})();

const client = new Cloudflare({
  apiEmail: CLOUDFLARE_EMAIL,
});

async function main() {
  const scripts = await client.workers.scripts.list({
    account_id: CLOUDFLARE_ACCOUNT_ID,
  });

  console.log(scripts);
}

main();
