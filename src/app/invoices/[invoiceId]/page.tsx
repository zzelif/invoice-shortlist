import { notFound } from "next/navigation";

import { eq } from "drizzle-orm";
import { cn } from "@/lib/utils";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
import InvoiceStatusForm from "@/components/invoice-status";

type Props = {
  params: { invoiceId: string };
};

export default async function InvoicePage(props: Props) {
  const invoiceId = parseInt(props.params.invoiceId);

  if (isNaN(invoiceId)) {
    throw new Error("Invalid invoice ID");
  }

  const [result] = await db
    .select()
    .from(Invoices)
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  if (!result) {
    notFound();
  }

  const items = JSON.parse(result.items) as {
    name: string;
    quantity: number;
    price: number;
  }[];

  return (
    <main className="flex flex-col justify-center h-full text-center gap-10 max-w-5xl mx-auto my-12">
      <div className="flex justify-center">
        <h1 className="flex items-center gap-4 text-3xl font-semibold">
          Invoice #{result.invoiceNumber}
          {/* <Badge
            className={cn(
              "rounded-full capitalize",
              result.status === "open" && "bg-blue-500",
              result.status === "paid" && "bg-green-600",
              result.status === "unpaid" && "bg-zinc-700",
              result.status === "void" && "bg-red-600"
            )}
          >
            {result.status}
          </Badge> */}
          <InvoiceStatusForm
            invoiceId={result.id}
            currentStatus={result.status}
          />
        </h1>
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
    </main>
  );
}
