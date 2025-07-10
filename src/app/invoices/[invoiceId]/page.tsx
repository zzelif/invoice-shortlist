import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { Invoices } from "@/db/schema";

import { cn } from "@/lib/utils";
import { eq, and } from "drizzle-orm";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Container from "@/components/container";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { AVAILABLE_STATUSES } from "@/data/invoices";
import { updateInvoiceStatus } from "@/app/actions";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const invoiceId = await params;

  if (!invoiceId) {
    notFound();
  }

  const [result] = await db
    .select()
    .from(Invoices)
    .where(
      and(eq(Invoices.id, Number(invoiceId)), eq(Invoices.clientId, userId))
    )
    .limit(1);

  if (!result) {
    notFound();
  }

  console.log("result.status", result.status);

  const items = JSON.parse(result.items) as {
    name: string;
    quantity: number;
    price: number;
  }[];

  return (
    <main className="h-full">
      <Container className="flex flex-col h-full text-center gap-10 ">
        <div className="flex justify-center gap-24 items-center">
          <h1 className="flex items-center gap-4 text-3xl font-semibold">
            Invoice #{result.invoiceNumber}
            <Badge
              className={cn(
                "rounded-full capitalize",
                result.status === "open" && "bg-blue-500",
                result.status === "paid" && "bg-green-600",
                result.status === "unpaid" && "bg-zinc-700",
                result.status === "void" && "bg-red-600"
              )}
            >
              {result.status}
            </Badge>
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>Change Status</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {AVAILABLE_STATUSES.map((status) => {
                return (
                  <DropdownMenuItem key={status.id}>
                    <form action={updateInvoiceStatus}>
                      <input type="hidden" name="id" value={result.id}></input>
                      <input
                        type="hidden"
                        name="status"
                        value={status.id}
                      ></input>
                      <button>{status.label}</button>
                    </form>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid gap-4 max-w-xl place-self-center text-left">
          <div>
            <Label className="block font-semibold mb-2">Client</Label>
            <Input disabled value={result.client} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block font-semibold mb-2">Issue Date</Label>
              <Input
                disabled
                value={new Date(result.issueDate).toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label className="block font-semibold mb-2">Due Date</Label>
              <Input
                disabled
                value={new Date(result.dueDate).toISOString().split("T")[0]}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="font-semibold">Invoice Items</h2>
            {items.map((item, index) => (
              <div
                key={index}
                className="grid gap-4 grid-cols-[1fr_1fr_1fr_100px]"
              >
                <div>
                  <Label className="block font-semibold mb-2">Item Name</Label>
                  <Input disabled value={item.name} />
                </div>
                <div>
                  <Label className="block font-semibold mb-2">Quantity</Label>
                  <Input disabled value={item.quantity} />
                </div>
                <div>
                  <Label className="block font-semibold mb-2">Unit Price</Label>
                  <Input disabled value={item.price} />
                </div>
                <div>
                  <Label className="block font-semibold mb-2">Total</Label>
                  <Input
                    disabled
                    value={(item.quantity * item.price).toFixed(2)}
                  />
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="text-right text-xl font-bold">
            Total: ${Number(result.total).toFixed(2)}
          </div>
        </div>
      </Container>
    </main>
  );
}
