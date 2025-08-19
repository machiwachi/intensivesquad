import { getUsers } from "@/lib/data";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { handle } from "hono/vercel";
import { decode } from "next-auth/jwt";

const jwt = createMiddleware<{
  Variables: {
    address?: `0x${string}`;
  };
}>(async (c, next) => {
  const token = await decode({
    token: getCookie(c, "next-auth.session-token"),
    secret: process.env.NEXTAUTH_SECRET!,
  });

  c.set("address", token?.address as `0x${string}`);
  await next();
});

const app = new Hono()
  .basePath("/api")
  .use(jwt)
  .get("/hello", async (c) => {
    const address = c.var.address;

    return c.json({ message: "hello", address });
  })
  .get("/users", async (c) => {
    const users = await getUsers();

    return c.json(users);
  });

export const GET = handle(app);
export const POST = handle(app);
