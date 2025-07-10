import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col justify-center text-center h-full gap-6 ">
        <h1 className="text-5xl font-bold">Invoice App</h1>
        <div>
          <Button asChild>
            <Link href="/dashboard">Enter</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
