import Container from "@/components/container";

const Footer = () => {
  return (
    <footer className="mt-6 mb-4">
      <Container className="flex justify-between gap-4">
        <p className="text-sm font-semibold">
          Invoicify &copy; {new Date().getFullYear()}
        </p>
        <p className="text-sm">Created by Dan with Next.js, Xata, and Clerk</p>
      </Container>
    </footer>
  );
};

export default Footer;
