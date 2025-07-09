"use server";

import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
//

export async function createAction(formData: FormData) {
  const invoiceNumber = formData.get("invoiceNumber") as string;
  const issueDate = new Date(formData.get("issueDate") as string);
  const dueDate = new Date(formData.get("dueDate") as string);
  const client = formData.get("client") as string;
  const rawItems = formData.get("items") as string;
  const items = JSON.parse(rawItems);
  const total = parseFloat(formData.get("total") as string);

  const results = await db
    .insert(Invoices)
    .values({
      invoiceNumber,
      issueDate,
      dueDate,
      client,
      items: JSON.stringify(items),
      total,
      status: "open",
    })
    .returning({
      id: Invoices.id,
    });

  redirect(`/dashboard`); // Redirect to the newly created invoice
}

export async function updateInvoiceStatus(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const status = formData.get("status") as "open" | "paid" | "unpaid" | "void";

  await db.update(Invoices).set({ status }).where(eq(Invoices.id, id));
}
