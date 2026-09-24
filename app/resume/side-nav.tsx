"use client";

import { useEffect, useState } from "react";
import { ProjectGlyph, type GlyphType } from "../project-glyph";

/** Sticky section index in the left gutter. Tracks whichever section's heading
 *  most recently crossed the upper third of the viewport. */
export function SideNav({ sections }: { sections: { id: string; glyph: GlyphType; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length) setActive(visible[visible.length - 1].target.id);
    }, { rootMargin: "0px 0px -66% 0px" });

    for (const { id } of sections) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <aside className="sideNav" aria-label="Resume sections">
      <p>{"// contents"}</p>
      <ol>
        {sections.map(({ id, glyph, label }) => (
          <li key={id}><a href={`#${id}`} aria-current={active === id ? "location" : undefined}><ProjectGlyph type={glyph} />{label}</a></li>
        ))}
      </ol>
    </aside>
  );
}
