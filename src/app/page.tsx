import Image from "next/image";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold">Invoice App</h1>
      <p>
        <a href="/dashboard">Sign In</a>
      </p>
    </main>
  );
}
