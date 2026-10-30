import { BusinessSkeletons } from "@/features/directory/components/directory-states";

export default function Loading() {
  return (
    <main className="mx-auto min-h-svh max-w-[var(--page-max)] px-[var(--page-x)] py-16">
      <div className="skeleton h-10 w-64" />
      <div className="mt-10">
        <BusinessSkeletons />
      </div>
    </main>
  );
}
