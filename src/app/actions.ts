"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Invoices, InvoiceStatus } from "@/db/schema";

export async function createAction(formData: FormData) {
  const { userId } = await auth();
  const invoiceNumber = formData.get("invoiceNumber") as string;
  const issueDate = new Date(formData.get("issueDate") as string);
  const dueDate = new Date(formData.get("dueDate") as string);
  const client = formData.get("client") as string;
  const rawItems = formData.get("items") as string;
  const items = JSON.parse(rawItems);
  const total = parseFloat(formData.get("total") as string);

  if (!userId) {
    return;
  }

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

  redirect(`/dashboard`);
}

export async function updateInvoiceStatus(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const status = formData.get("status") as InvoiceStatus;

  if (!id || !status) throw new Error("Missing required data");

  await db.update(Invoices).set({ status }).where(eq(Invoices.id, id));

  redirect(`/invoices/${id}`);
}
