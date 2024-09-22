import { type PlatformProxy } from "wrangler";
import { ExampleService } from "../worker/src/index";

interface Env {
  SERVICE: Service<ExampleService>;
}

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}
