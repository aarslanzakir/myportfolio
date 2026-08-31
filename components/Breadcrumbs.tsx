import Link from "next/link";

/**
 * Visible trail matching the BreadcrumbList schema. Google wants both:
 * the markup tells it the hierarchy, the visible trail is what stops a
 * visitor landing on a deep page from feeling stranded.
 *
 * The last crumb is the current page, so it renders as plain text with
 * aria-current rather than a link back to itself.
 */
export default function Breadcrumbs({
  trail,
}: {
  trail: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-mist-500">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;

          return (
            <li key={crumb.label} className="flex items-center gap-2">
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-mist-200"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="text-mist-300">
                  {crumb.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-mist-600">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
