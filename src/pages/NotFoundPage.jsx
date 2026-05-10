import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="space-y-4 rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-stone-600">The page you requested does not exist.</p>
      <Link to="/" className="text-sm font-medium text-stone-900 underline">
        Back to home
      </Link>
    </div>
  );
}