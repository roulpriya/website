"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const projects = [
  { year: "2026", title: "AgentForge", glyph: "orbit", description: "A Kanban board that spawns AI coding agents in isolated git worktrees — one agent per ticket.", href: "https://github.com/inputforge/agentforge", tags: "TypeScript · React · Bun · SQLite" },
  { year: "2025", title: "Source Radar", glyph: "radar", description: "Source-code analysis and metrics across multiple languages, built around an extensible plugin architecture.", href: "https://github.com/sourceradar/source-radar", tags: "TypeScript · Python" },
  { year: "2025", title: "CodeWiki", glyph: "cards", description: "A personal, source-cited wiki for GitHub repositories with searchable snapshots and synced documentation.", href: "https://github.com/roulpriya/codewiki", tags: "TypeScript · Bun · Docker" },
  { year: "2026", title: "Content Manager", glyph: "calendar", description: "A multi-day content calendar with topic scheduling, AI-assisted writing, and memory management.", href: "https://github.com/roulpriya/content-manager", tags: "TypeScript · Docker" },
] as const;

const articles = [
  { date: "Jun 22, 2025", title: "From Career Break to GSoC: My Open Source Journey", description: "From wiping my disk while installing Ubuntu to writing Swift and TypeScript used by thousands of developers.", href: "https://medium.com/@priyaroul99/from-career-break-to-gsoc-my-open-source-journey-24b908416ac5" },
  { date: "Mar 06, 2025", title: "The Internal Workings of a HashMap", description: "A visual, practical dive into how HashMaps make data access feel instant.", href: "https://medium.com/@priyaroul99/the-internal-workings-of-a-hashmap-a-deep-dive-15bf0580babb" },
  { date: "Feb 04, 2025", title: "REWORK: The Must-Read Business Book", description: "Stop planning, start building — lessons from a book made for modern makers.", href: "https://medium.com/@priyaroul99/rework-the-must-read-business-book-for-2025-08ade2e647c4" },
  { date: "Oct 26, 2024", title: "Introduction to Redis", description: "What the in-memory powerhouse is, how it works, and when to reach for it.", href: "https://medium.com/next-level-coding/introduction-to-redis-the-in-memory-powerhouse-8950265802e3" },
];

const mailCommand = "$ priyaroul99@gmail.com";

function ProjectGlyph({ type }: { type: "orbit" | "radar" | "cards" | "calendar" }) {
  const paths = {
    orbit: <><ellipse cx="12" cy="12" rx="9" ry="4.25" transform="rotate(-28 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="4.25" transform="rotate(28 12 12)" /><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" /></>,
    radar: <><path d="M4 12a8 8 0 0 1 16 0" /><path d="M7 12a5 5 0 0 1 10 0" /><path d="M10 12a2 2 0 0 1 4 0" /><path d="M12 12 17.5 6.5" /><circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" /></>,
    cards: <><path d="m5.5 7 11.5-2 1.5 10.5-11.5 2z" /><path d="m4 9.5 11.5-2 1.5 10.5-11.5 2z" /><path d="M8 12.5h5.5M8.5 15h3.5" /></>,
    calendar: <><rect x="4.5" y="6" width="15" height="13" rx="1.5" /><path d="M8 4.5v3M16 4.5v3M4.5 10h15M8 13h.01M12 13h.01M16 13h.01M8 16h.01M12 16h.01" /></>,
  };

  return <svg className="projectGlyph" viewBox="0 0 24 24" aria-hidden="true">{paths[type]}</svg>;
}

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [typedMailCommand, setTypedMailCommand] = useState("");
  const [showMailCommand, setShowMailCommand] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShowMailCommand(true);
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!showMailCommand) return;

    let character = 0;
    const timer = window.setInterval(() => {
      character += 1;
      setTypedMailCommand(mailCommand.slice(0, character));

      if (character === mailCommand.length) window.clearInterval(timer);
    }, 42);

    return () => window.clearInterval(timer);
  }, [showMailCommand]);

  return (
    <main>
      <nav aria-label="Primary navigation">
        <a className="brand" href="#top">~/priya</a>
        <div className="navLinks"><a href="#work">./work</a><a href="#writing">./writing</a><button className="themeToggle" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}><span aria-hidden="true">{theme === "dark" ? "☼" : "◐"}</span></button></div>
      </nav>

      <section className="intro" id="top">
        <div className="introHeader">
          <div><h1><span>&gt;</span> Priyambada Roul</h1><p className="role">{"// engineer"}</p></div>
          <span className="portraitFrame"><Image className="portrait" src="/priya.jpg" alt="Priyambada Roul" width={700} height={1050} priority /></span>
        </div>
        <div className="bio">
          <p>I’m an engineer who builds scalable platforms, useful developer tools, and fun little experiments.</p>
          <p>I currently work at Cashfree Payments on the Risk team, helping prevent fraudulent transactions. I’ve worked on systems handling thousands of transactions per second and helped resolve infrastructure challenges at scale.</p>
          <p>As part of Google Summer of Code 2025, I contributed to Swift and built the Swiftly extension for VS Code. It introduced me to a new world of development tooling and ecosystems.</p>
          <p>Over the past year, I’ve been building AI agents to make everyday work lighter and improve developer productivity for me and my team.</p>
          <p>Apart from code, I’ve practiced Bharatanatyam since I was five. It has shaped how I think about structure, rhythm, and expression in everything I make<span className="cursor" aria-hidden="true">▍</span></p>
        </div>
      </section>

      <section className="collection" id="work">
        <div className="sectionHeading"><h2><span>&gt;</span> Work</h2><p>{"// systems, tools, and experiments I’ve shipped"}</p></div>
        <div className="list">
          {projects.map((project) => (
            <a className="listItem" href={project.href} key={project.title} target="_blank" rel="noreferrer">
              <time>{project.year}</time><div><h3><ProjectGlyph type={project.glyph} />{project.title}</h3><p>{project.description}</p><small>{project.tags}</small></div><span className="arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="collection" id="writing">
        <div className="sectionHeading"><h2><span>&gt;</span> Writing</h2><p>{"// ideas about engineering, open source, and building"}</p></div>
        <div className="list">
          {articles.map((article) => (
            <a className="listItem" href={article.href} key={article.title} target="_blank" rel="noreferrer">
              <time>{article.date}</time><div><h3><span>&gt;</span>{" "}{article.title}</h3><p>{article.description}</p></div><span className="arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <footer ref={footerRef}><div className="footerTop"><p><a className={`mailCommand${showMailCommand ? " isVisible" : ""}`} href="mailto:priyaroul99@gmail.com" aria-label="Email Priyambada Roul"><span className="mailCommandText" aria-hidden="true">{typedMailCommand}</span>{showMailCommand && <span className="cursor" aria-hidden="true">▍</span>}</a></p><div><a href="https://github.com/roulpriya" target="_blank" rel="noreferrer">github</a><a href="https://www.linkedin.com/in/priyambadaroul/" target="_blank" rel="noreferrer">linkedin</a><a href="https://twitter.com/tarntism_priya" target="_blank" rel="noreferrer">twitter</a></div></div><small className="location">bengaluru · IST</small></footer>
    </main>
  );
}
