import { Hono } from "hono";

import { expenses as expensesTable } from "../db/schema/expenses";
import { db } from "../db";
import { desc, eq, sum, and } from "drizzle-orm";

import { getUser } from "../auth";

type Expense = {
  title: string;
  amount: string;
  date: string;
};

export const expensesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.date));
    return c.json({ expenses });
  })
  .post("/", getUser, async (c) => {
    const user = c.var.user;
    const userId = user.id;
    const expense: Expense = await c.req.json();

    const databaseExpense = await db
      .insert(expensesTable)
      .values({ ...expense, userId })
      .returning()
      .then((rows) => rows[0]);

    return c.json({ expense: databaseExpense }, 201);
  })
  .get("/total-amount", getUser, async (c) => {
    const user = c.var.user;
    const total = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .then((rows) => rows[0]);

    return c.json(total);
  })
  .get("/:id{[0-9]+}", getUser, async (c) => {
    const user = c.var.user;
    const id = Number.parseInt(c.req.param("id"));
    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)))
      .then((rows) => rows[0]);
    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const user = c.var.user;
    const id = Number.parseInt(c.req.param("id"));
    const deletedExpense = await db
      .delete(expensesTable)
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)))
      .returning()
      .then((rows) => rows[0]);

    return c.json({ expense: deletedExpense });
  });