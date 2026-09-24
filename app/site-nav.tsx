"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { label: "./work", href: "/#work" },
  { label: "./writing", href: "/#writing" },
  { label: "./bolo", href: "/bolo" },
  { label: "./resume", href: "/resume" },
];

/** The same top bar on every page. The brand reads `$~/priya` and grows a `/route` suffix off the
 *  home page, and the link for the page you're on is marked current. */
export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation">
      <Link className="brand" href="/">$~/priya{pathname !== "/" && <span>{pathname}</span>}</Link>
      <div className="navLinks">
        {links.map((link) => (
          <Link href={link.href} key={link.href} aria-current={link.href === pathname ? "page" : undefined} style={{ "--chars": link.label.length } as CSSProperties}>{link.label}</Link>
        ))}
        <ThemeToggle />
      </div>
    </nav>
  );
}
