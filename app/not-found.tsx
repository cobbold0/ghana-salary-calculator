import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-muted">That page does not exist.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-brand px-4 py-2.5 font-medium text-brand-contrast">
        Go to the salary calculator
      </Link>
    </div>
  );
}
