import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

const app = new Elysia({ prefix: "/api", aot: false })
  .use(swagger())
  .get("/:calendar", async ({ params: { calendar } }) => {
    

    // if (!tokenMatch) {
    //   return {
    //     error: `Token ${token} not found`,
    //   };
    // }

    // return {
    //   ...tokenMetadata,
    //   icon: "",
    // };
  })
  .compile();

export const GET = app.handle;
export const POST = app.handle;
