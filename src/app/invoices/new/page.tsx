"use client";

import { type SyntheticEvent, useState } from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { v4 as uuidv4 } from "uuid";

import { createAction } from "@/app/actions";

type Item = {
  name: string;
  quantity: number;
  price: number;
};

export default function InvoiceForm() {
  const [invoiceNumber] = useState(`INV-${uuidv4().slice(0, 8)}`);
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [client, setClient] = useState("");
  const [items, setItems] = useState<Item[]>([
    { name: "", quantity: 0, price: 0 },
  ]);
  const total = items.reduce(
    (acc, item) => acc + (item.quantity || 0) * (item.price || 0),
    0
  );

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", quantity: 0, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return; // prevent removing the last item
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = (e: SyntheticEvent) => {
    if (!issueDate || !dueDate || !client) {
      e.preventDefault();
      alert("Please fill all required fields.");
      return;
    }

    // Submit logic here (e.g. call Server Action or API)
    console.log({
      invoiceNumber,
      issueDate,
      dueDate,
      client,
      items,
      total,
    });
  };

  return (
    <main className="flex flex-col justify-center h-full text-center gap-10 max-w-5xl mx-auto my-12">
      <div className="flex justify-center">
        <h1 className="text-3xl font-semibold">Create Invoice</h1>
      </div>

      <form
        action={createAction}
        onSubmit={handleSubmit}
        className="grid gap-4 max-w-xl place-self-center"
      >
        <div>
          <Label className="block font-semibold mb-2">Invoice Number</Label>
          <Input disabled value={invoiceNumber} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="block font-semibold mb-2" htmlFor="issueDate">
              Issue Date
            </Label>
            <Input
              type="date"
              id="issueDate"
              name="issueDate"
              required
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>
          <div>
            <Label className="block font-semibold mb-2" htmlFor="dueDate">
              Due Date
            </Label>
            <Input
              type="date"
              id="dueDate"
              name="dueDate"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label className="block font-semibold mb-2" htmlFor="client">
            Client
          </Label>
          <Input
            id="client"
            placeholder="Client Name"
            name="client"
            required
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
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
                <Label
                  className="block font-semibold mb-2"
                  htmlFor={`item-name-${index}`}
                >
                  Item Name
                </Label>
                <Input
                  id={`item-name-${index}`}
                  placeholder="Item Name"
                  name={`item-name-${index}`}
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label
                  className="block font-semibold mb-2"
                  htmlFor={`item-qty-${index}`}
                >
                  Quantity
                </Label>
                <Input
                  id={`item-qty-${index}`}
                  placeholder="0"
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                />
              </div>
              <div>
                <Label
                  className="block font-semibold mb-2"
                  htmlFor={`item-price-${index}`}
                >
                  Unit Price
                </Label>
                <Input
                  id={`item-price-${index}`}
                  placeholder="0.00"
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center h-full justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  <Trash2 /> Remove
                </Button>
              </div>
            </div>
          ))}

          <Button type="button" variant="secondary" onClick={addItem}>
            Add Item
          </Button>
        </div>

        <Separator />

        <div className="text-right text-xl font-bold">
          Total: ${total.toFixed(2)}
        </div>

        <input type="hidden" name="invoiceNumber" value={invoiceNumber} />
        <input type="hidden" name="total" value={total.toFixed(2)} />
        <input type="hidden" name="items" value={JSON.stringify(items)} />

        <Button type="submit">Submit Invoice</Button>
      </form>
    </main>
  );
}
