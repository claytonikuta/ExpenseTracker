import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { expensesRoute } from "./routes/expenses";

const app = new Hono();

app.use("*", logger());

app.route("/api/expenses", expensesRoute)

app.get("/api/me", (c) => {
  let loggedIn = true;
  if (!loggedIn) {
    return c.json({ error: "Not logged in" }, 401);
  }
  let user = {
    email: "test@test.test",
    given_name: "Test User",
  }

  return c.json({user});
})

app.get("*", serveStatic({ root: "./expense-frontend/dist" }));
app.get("*", serveStatic({ path: './expense-frontend/dist/index.html' }))

export default app;