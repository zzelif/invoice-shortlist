"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AVAILABLE_STATUSES } from "@/data/invoices";

export default function StatusFilter() {
  const params = useSearchParams();
  const router = useRouter();
  const status = params.get("status") || "";

  const handleSelect = (newStatus: string) => {
    const url = new URL(window.location.href);
    if (newStatus) url.searchParams.set("status", newStatus);
    else url.searchParams.delete("status");
    router.push(url.toString());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="capitalize">
          {status
            ? AVAILABLE_STATUSES.find((s) => s.id === status)?.label || status
            : "All Statuses"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => handleSelect("")}>
          All
        </DropdownMenuItem>
        {AVAILABLE_STATUSES.map((s) => (
          <DropdownMenuItem key={s.id} onSelect={() => handleSelect(s.id)}>
            {s.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
