import { eq } from "drizzle-orm";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  params: { invoiceId: string };
};

export default async function InvoicePage(props: Props) {
  const invoiceId = parseInt(props.params.invoiceId);

  const [result] = await db
    .select()
    .from(Invoices)
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  if (!result) {
    return <div className="text-center mt-12 text-xl">Invoice not found</div>;
  }

  const items = JSON.parse(result.items) as {
    name: string;
    quantity: number;
    price: number;
  }[];

  return (
    <main className="flex flex-col justify-center h-full text-center gap-10 max-w-5xl mx-auto my-12">
      <div className="flex justify-center gap-10">
        <h1 className="text-3xl font-semibold">
          Invoice #{result.invoiceNumber}
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{result.status}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-28" align="center">
            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>Open</DropdownMenuItem>
              <DropdownMenuItem>Paid</DropdownMenuItem>
              <DropdownMenuItem>Unpaid</DropdownMenuItem>
              <DropdownMenuItem>Void</DropdownMenuItem>
            </DropdownMenuGroup>
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
    </main>
  );
}
