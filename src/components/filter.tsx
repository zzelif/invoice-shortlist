"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AVAILABLE_STATUSES } from "@/data/invoices";

export default function StatusFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const current = searchParams.get("status") || "";

  const select = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status) params.set("status", status);
    else params.delete("status");

    console.log("searchParams = ", pathname, params.toString());

    router.push(pathname + "?" + params.toString());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="capitalize">
          {current
            ? AVAILABLE_STATUSES.find((s) => s.id === current)?.label
            : "All Statuses"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => select("")}>All</DropdownMenuItem>
        {AVAILABLE_STATUSES.map((s) => (
          <DropdownMenuItem key={s.id} onSelect={() => select(s.id)}>
            {s.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
