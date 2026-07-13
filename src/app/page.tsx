import { PortalSearch } from "@/components/PortalSearch";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function PortalPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/orders" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Task Orders
        </Link>
      </div>

      {/* Branding */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
          Agila Task Portal
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto px-4">
          Search and update task orders
        </p>
      </div>

      <PortalSearch />
    </div>
  );
}