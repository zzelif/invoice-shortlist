import { CirclePlus } from "lucide-react";
import { db } from "@/db";
import { Invoices } from "@/db/schema";

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
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const results = await db.select().from(Invoices);
  console.log("Invoices:", results);

  return (
    <main className="flex flex-col justify-center h-full text-center gap-6 max-w-5xl mx-auto my-12">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Invoices</h1>
        <p>
          <Button className="inline-flex gap-2" variant="ghost" asChild>
            <Link href="/invoices/new">
              <CirclePlus className="h-4 w-4" />
              Create New Invoice
            </Link>
          </Button>
        </p>
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
          {results.map((result) => {
            return (
              <TableRow>
                <TableCell className="p-4 font-medium text-left">
                  <span className="font-semibold">INV001</span>
                </TableCell>
                <TableCell className="p-4 text-left">
                  <span className="font-semibold">Dan</span>
                </TableCell>
                <TableCell className="p-4 text-left">
                  <span className="">03/02/2026</span>
                </TableCell>
                <TableCell className="p-4 text-left">
                  <span className="font-semibold">$250.00</span>
                </TableCell>
                <TableCell className="p-4 text-right">
                  <Badge className="rounded-full">Paid</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </main>
  );
}
