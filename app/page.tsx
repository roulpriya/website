"use client";

import Image from "next/image";
import Link from "next/link";
import { ProjectGlyph } from "./project-glyph";
import { SketchCircle } from "./sketch-circle";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";

const projects = [
  { year: "2026", title: "Bolo", glyph: "mic", description: "A voice-first computer assistant for macOS — speak in Hindi, Hinglish or English and it runs the task on your machine.", href: "/bolo", tags: "TypeScript · Electron · React · macOS", internal: true },
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

export default function Home() {
  return (
    <main>
      <SiteNav />

      <section className="intro" id="top">
        <div className="bio">
          <span className="portraitFrame"><Image className="portrait" src="/priya.jpg" alt="Priyambada Roul" width={700} height={1050} priority /></span>
          <h1><SketchCircle>Priyambada Roul</SketchCircle> is an engineer who builds scalable platforms, useful developer tools, and fun little experiments.</h1>
          <p>I currently work at Cashfree Payments on the Risk team, helping prevent fraudulent transactions. I’ve worked on systems handling thousands of transactions per second and helped resolve infrastructure challenges at scale.</p>
          <p>As part of Google Summer of Code 2025, I contributed to Swift and built the Swiftly extension for VS Code. It introduced me to a new world of development tooling and ecosystems.</p>
          <p>Over the past year, I’ve been building AI agents to make everyday work lighter and improve developer productivity for me and my team.</p>
          <p>Apart from code, I’ve practiced Bharatanatyam since I was five. It has shaped how I think about structure, rhythm, and expression in everything I make<span className="cursor" aria-hidden="true">▍</span></p>
        </div>
      </section>

      <section className="collection" id="work">
        <div className="sectionHeading"><h2><span>&gt;</span> Work</h2><p>{"// systems, tools, and experiments I’ve shipped"}</p></div>
        <div className="list">
          {projects.map((project) => {
            const body = <><time>{project.year}</time><div><h3><ProjectGlyph type={project.glyph} />{project.title}</h3><p>{project.description}</p><small>{project.tags}</small></div><span className="arrow" aria-hidden="true">{"internal" in project ? "→" : "↗"}</span></>;

            return "internal" in project
              ? <Link className="listItem" href={project.href} key={project.title}>{body}</Link>
              : <a className="listItem" href={project.href} key={project.title} target="_blank" rel="noreferrer">{body}</a>;
          })}
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

      <SiteFooter />
    </main>
  );
}
