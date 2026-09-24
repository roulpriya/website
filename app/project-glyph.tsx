export type GlyphType = "orbit" | "radar" | "cards" | "calendar" | "mic" | "briefcase" | "branch" | "layers" | "code" | "cap";

export function ProjectGlyph({ type }: { type: GlyphType }) {
  const paths = {
    orbit: <><ellipse cx="12" cy="12" rx="9" ry="4.25" transform="rotate(-28 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="4.25" transform="rotate(28 12 12)" /><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" /></>,
    radar: <><path d="M4 12a8 8 0 0 1 16 0" /><path d="M7 12a5 5 0 0 1 10 0" /><path d="M10 12a2 2 0 0 1 4 0" /><path d="M12 12 17.5 6.5" /><circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" /></>,
    cards: <><path d="m5.5 7 11.5-2 1.5 10.5-11.5 2z" /><path d="m4 9.5 11.5-2 1.5 10.5-11.5 2z" /><path d="M8 12.5h5.5M8.5 15h3.5" /></>,
    mic: <><rect x="9" y="2.5" width="6" height="12" rx="3" /><path d="M19 10v1.5a7 7 0 0 1-14 0V10" /><path d="M12 18.5v3" /></>,
    calendar: <><rect x="4.5" y="6" width="15" height="13" rx="1.5" /><path d="M8 4.5v3M16 4.5v3M4.5 10h15M8 13h.01M12 13h.01M16 13h.01M8 16h.01M12 16h.01" /></>,
    briefcase: <><rect x="3.5" y="7.5" width="17" height="12" rx="1.5" /><path d="M9 7.5v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3.5 12.5h17" /></>,
    branch: <><circle cx="7" cy="5.5" r="2" /><circle cx="7" cy="18.5" r="2" /><circle cx="17" cy="7.5" r="2" /><path d="M7 7.5v9" /><path d="M17 9.5c0 3.5-3 4.5-6 4.5-2.2 0-4 .9-4 2.5" /></>,
    layers: <><path d="m12 4 8.5 4.5L12 13 3.5 8.5z" /><path d="m3.5 12.5 8.5 4.5 8.5-4.5" /><path d="m3.5 16 8.5 4.5 8.5-4.5" /></>,
    code: <><path d="m8.5 7.5-5 4.5 5 4.5M15.5 7.5l5 4.5-5 4.5M13.5 5l-3 14" /></>,
    cap: <><path d="m12 5 9.5 4.5L12 14 2.5 9.5z" /><path d="M6.5 11.5V16c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.5M21.5 9.5v5" /></>,
  };

  return <svg className="projectGlyph" viewBox="0 0 24 24" aria-hidden="true">{paths[type]}</svg>;
}
