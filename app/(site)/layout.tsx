import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/**
 * Chrome for the public marketing site only.
 *
 * The sticky Nav lives here rather than in the root layout so /admin
 * doesn't inherit it: a fixed public header would otherwise sit on top
 * of the admin toolbar.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-accent-400 focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
