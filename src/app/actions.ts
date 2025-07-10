"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

import { db } from "@/db";
import { Invoices, AvailableStatuses } from "@/db/schema";

export async function createAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

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
      clientId: userId,
      items: JSON.stringify(items),
      total: total.toFixed(2),
      status: "open",
    })
    .returning({
      id: Invoices.id,
    });

  console.log("Created invoice:", results);

  redirect(`/dashboard`);
}

export async function updateInvoiceStatus(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const id = parseInt(formData.get("id") as string);
  const status = formData.get("status") as AvailableStatuses;

  const results = await db
    .update(Invoices)
    .set({ status })
    .where(and(eq(Invoices.id, id), eq(Invoices.clientId, userId)));

  console.log("Updated invoice status:", results);

  redirect(`/invoices/${id}`);
}
