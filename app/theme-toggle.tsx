"use client";

/** The inline script in the root layout puts the stored theme on <html> before
 *  first paint, and the two glyphs below are swapped by CSS off that same
 *  attribute — so this button needs no state and never disagrees with the page
 *  it is sitting on, including on the very first render. */
export function ThemeToggle() {
  return (
    <button
      className="themeToggle"
      type="button"
      onClick={() => {
        const root = document.documentElement;
        const next = root.dataset.theme === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {
          // Private browsing can refuse storage; the theme still applies.
        }
      }}
      aria-label="Toggle between light and dark theme"
      title="Toggle theme"
    >
      <span aria-hidden="true" className="themeIconLight">
        ◐
      </span>
      <span aria-hidden="true" className="themeIconDark">
        ☼
      </span>
    </button>
  );
}
