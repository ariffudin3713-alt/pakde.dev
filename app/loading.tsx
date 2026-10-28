import { BusinessSkeletons } from "@/features/directory/components/directory-states";

export default function Loading() {
  return <main className="mx-auto min-h-screen max-w-7xl px-5 py-16 sm:px-8"><div className="mb-10 h-10 w-64 animate-pulse rounded-xl bg-[#e8ece8]"/><BusinessSkeletons /></main>;
}
