const Footer = () => {
  return (
    <footer className="mt-6 mb-8">
      <div className="flex items-center justify-between gap-4 font-bold text-black max-w-5xl mx-auto">
        <p>Invoicify &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
