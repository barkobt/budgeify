'use client';

/**
 * SkipNav — Accessibility skip navigation link.
 * Visible only on keyboard focus. Allows users to
 * skip directly to main content.
 */
export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999]
                 focus:rounded-xl focus:bg-accent-700 focus:px-6 focus:py-3 focus:text-sm
                 focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none"
    >
      Ana içeriğe atla
    </a>
  );
}
