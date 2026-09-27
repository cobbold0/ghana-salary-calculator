"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-muted">The page could not be displayed. Please try again.</p>
      <button type="button" onClick={reset} className="mt-6 rounded-lg bg-brand px-4 py-2.5 font-medium text-brand-contrast">
        Try again
      </button>
    </div>
  );
}
