import { connection } from "next/server";

/** Defer work until a real request so `next build` can run without a live database. */
export async function waitForRequest(): Promise<void> {
  await connection();
}
