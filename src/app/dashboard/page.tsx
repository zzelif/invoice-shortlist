import { eq } from "drizzle-orm";
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

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function DashboardPage({ searchParams }: Props) {
  console.log("Server searchParams.status", searchParams.status);
  const selectedStatus = searchParams.status?.toString();
  const filtered = selectedStatus
    ? await db
        .select()
        .from(Invoices)
        .where(eq(Invoices.status, selectedStatus as InvoiceStatus))
    : await db.select().from(Invoices);
  console.log("Selected Status:", selectedStatus);
  console.log("Filtered Invoices:", filtered);
  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Invoices</h1>

          <div className="flex gap-4">
            <StatusFilter></StatusFilter>

            <Button asChild variant="ghost" className="inline-flex gap-2">
              <Link href="/invoices/new">
                <CirclePlus className="h-4 w-4" />
                Create New Invoice
              </Link>
            </Button>
          </div>
        </div>

        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] p-4">Invoice #</TableHead>
              <TableHead className="p-4">Client Name</TableHead>
              <TableHead className="p-4">Due Date</TableHead>
              <TableHead className="p-4">Amount</TableHead>
              <TableHead className="text-right p-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="p-0">
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="font-semibold block p-4 text-left"
                  >
                    {invoice.invoiceNumber}
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="font-semibold block p-4 text-left"
                  >
                    {invoice.client}
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="block p-4 text-left"
                  >
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="font-semibold block p-4 text-left"
                  >
                    ${invoice.total}
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="block p-4 text-right"
                  >
                    <Badge
                      className={cn(
                        "rounded-full capitalize",
                        invoice.status === "open" && "bg-blue-500",
                        invoice.status === "paid" && "bg-green-600",
                        invoice.status === "unpaid" && "bg-zinc-700",
                        invoice.status === "void" && "bg-red-600"
                      )}
                    >
                      {invoice.status}
                    </Badge>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </main>
  );
}
