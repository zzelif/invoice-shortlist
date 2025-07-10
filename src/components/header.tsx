import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Container from "@/components/container";
import Link from "next/link";

const Header = () => {
  return (
    <header className="mt-5 mb-8">
      <Container>
        <div className="flex justify-between items-center gap-4">
          <p className="font-bold text-black">
            <Link href="/dashboard">Invoicify</Link>
          </p>
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
