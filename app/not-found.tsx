import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="py-24">
      <p className="font-display text-8xl leading-none text-accent">404</p>
      <h1 className="mt-4 font-display text-5xl leading-tight">
        Nothing was written here.
      </h1>
      <p className="mt-6 text-lg text-muted">
        This page does not exist. Maybe next year.
      </p>
      <Link
        href="/"
        className="mt-10 flex items-center text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft className="size-4 mr-2" />
        See posts that actually exist
      </Link>
    </section>
  );
}
