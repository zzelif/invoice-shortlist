"use client";

import { useOptimistic } from "react";
import { updateInvoiceStatus } from "@/app/actions";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { AVAILABLE_STATUSES } from "@/data/invoices";

type Props = {
  invoiceId: number;
  currentStatus: string;
};

export default function InvoiceStatusForm({ invoiceId, currentStatus }: Props) {
  const [status, setStatus] = useOptimistic(currentStatus, (_, s) => s);

  async function handleChange(statusId: string) {
    const formData = new FormData();
    formData.append("id", String(invoiceId));
    formData.append("status", statusId);
    setStatus(statusId);
    try {
      await updateInvoiceStatus(formData);
    } catch (err) {
      console.error("Status update failed", err);
      setStatus(currentStatus); // rollback
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-2 items-center">
          {status} <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {AVAILABLE_STATUSES.map((s) => (
          <DropdownMenuItem key={s.id} onSelect={() => handleChange(s.id)}>
            {s.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
