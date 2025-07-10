export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { Invoices, InvoiceStatus } from "@/db/schema";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Container from "@/components/container";

import StatusFilter from "@/components/filter";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status: string }>;
}) {
  const { userId } = await auth();
  if (!userId) return null;

  const { status } = await searchParams;
  console.log("status =", status);

  const invoices = await db
    .select()
    .from(Invoices)
    .where(
      status
        ? and(
            eq(Invoices.clientId, userId),
            eq(Invoices.status, status as InvoiceStatus)
          )
        : eq(Invoices.clientId, userId)
    );
  console.log("invoices", invoices);

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Invoices</h1>
          <div className="flex gap-4">
            <StatusFilter />
            <Button asChild variant="ghost" className="inline-flex gap-2">
              <Link href="/invoices/new">
                <CirclePlus className="h-4 w-4" />
                Create New Invoice
              </Link>
            </Button>
          </div>
        </div>

        <Table>
          <TableCaption>Recent invoices</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] p-4">Invoice #</TableHead>
              <TableHead className="p-4">Client</TableHead>
              <TableHead className="p-4">Due Date</TableHead>
              <TableHead className="p-4">Amount</TableHead>
              <TableHead className="text-right p-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="p-0">
                  <Link href={`/invoices/${inv.id}`} className="block p-4">
                    {inv.invoiceNumber}
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link href={`/invoices/${inv.id}`} className="block p-4">
                    {inv.client}
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link href={`/invoices/${inv.id}`} className="block p-4">
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link href={`/invoices/${inv.id}`} className="block p-4">
                    ${inv.total}
                  </Link>
                </TableCell>
                <TableCell className="p-0 text-right">
                  <Badge
                    className={cn(
                      "rounded-full capitalize",
                      inv.status === "open" && "bg-blue-500",
                      inv.status === "paid" && "bg-green-600",
                      inv.status === "unpaid" && "bg-zinc-700",
                      inv.status === "void" && "bg-red-600"
                    )}
                  >
                    {inv.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </main>
  );
}
