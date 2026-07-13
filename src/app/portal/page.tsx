import { PortalSearch } from "@/components/PortalSearch";

export const dynamic = "force-dynamic";

export default function PortalPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Agila Task Portal
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Search for a Task Order by its number and update its status, progress,
            and next steps.
        </p>
        </div>

      <PortalSearch />
    </div>
  );
}