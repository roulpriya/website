import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import { ProjectGlyph, type GlyphType } from "../project-glyph";
import { SketchCircle } from "../sketch-circle";
import { SiteFooter } from "../site-footer";
import { SiteNav } from "../site-nav";
import { SideNav } from "./side-nav";

const title = "Resume — Priyambada Roul";
const description = "Experience, open source, projects and skills of Priyambada Roul, a software engineer in Bangalore.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "priyaroul.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  const image = `${protocol}://${host}/og.png`;

  return {
    title,
    description,
    openGraph: { title, description, type: "profile", images: [{ url: image, width: 2400, height: 1260, alt: "Priya Roul — software engineer and open-source builder" }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

const experience = [
  {
    start: "Jul 2025", end: "present", company: "Cashfree Payments", logo: "/logos/cashfree.png", position: "Software Development Engineer II", location: "Bangalore, India",
    highlights: [
      "Built an agent that helps merchants author risk rules for fraud prevention. Completed end-to-end development, evals and deployment single-handedly.",
      "Implemented Cashfree’s agentic code-review system that runs for pull requests and locally in Claude Code, reviewing 20–30 PRs per week and slowly ramping up.",
      "Solely designed and delivered the Chargeback Protection Plan subsystem, spanning merchant onboarding, eligibility evaluation, limit management, and dispute tracking.",
      "Owned validation and aggregation for a real-time rule engine, keeping rule-evaluation latency at 50ms p90. Migrated legacy rule filters to the new architecture and built historical backtesting for block-impact and dispute-loss analysis.",
      "Developed payment-risk analytics APIs and a streaming transaction-enrichment pipeline processing 250 transactions/sec for dispute sources, dispute-to-sales ratio, and topline risk metrics.",
    ],
  },
  {
    start: "Jul 2022", end: "Mar 2025", company: "Baton Systems", logo: "/logos/baton.png", position: "Software Engineer II", location: "Remote",
    highlights: [
      "Designed and built a Java and Spring Boot configuration service that delivered on-demand configuration and change notifications to dependent services.",
      "Implemented fine-grained role-based access control with JWT, Spring Security, and platform-wide authorization policies.",
      "Built event-driven Apache Camel workflows for asynchronous FX-settlement processing and extended settlement logic to support new trade-scheduling controls.",
      "Developed configurable approval workflows for transaction processing and rule changes; enhanced cash-flow suppression, manual force-matching, and settlement execution.",
    ],
  },
  {
    start: "Sep 2021", end: "Jun 2022", company: "Accenture", logo: "/logos/accenture.svg", position: "Software Engineer", location: "Bangalore, India",
    highlights: [
      "Developed Node.js services to ingest, validate, and transform clinical-study data for downstream analytics.",
      "Built ETL workflows feeding Snowflake and added automated data-quality checks, fixing pipeline defects that caused ingestion failures.",
    ],
  },
  {
    start: "Nov 2020", end: "Jun 2021", company: "Subconscious Compute", logo: undefined, position: "Intern", location: "Remote",
    highlights: [
      "Developed Python and FastAPI services for voice-sample extraction from incoming audio streams and customer analysis.",
      "Created Grafana monitoring dashboards backed by Cassandra.",
    ],
  },
];

const openSource: { start: string; end: string; title: string; subtitle: string; logo: string; href: string; highlights: string[] }[] = [
  {
    start: "May 2025", end: "Dec 2025", title: "Swift", subtitle: "GSoC 2025 Contributor · swiftlang/vscode-swift", logo: "/logos/swift.svg", href: "https://github.com/swiftlang/vscode-swift",
    highlights: [
      "Contributed to the Swift extension for Visual Studio Code through Google Summer of Code 2025.",
      "Refactored Swiftly for JSON output and implemented toolchain selection and management.",
    ],
  },
];

const projects: { year: string; title: string; glyph: GlyphType; href: string; highlights: string[] }[] = [
  {
    year: "2026", title: "AgentForge", glyph: "orbit", href: "https://www.inputforge.com/agentforge",
    highlights: [
      "Built a Kanban application that runs parallel AI coding agents in isolated Git worktrees.",
      "Integrated GitHub and Linear issue import, code review, change requests, merging, automatic rebasing, and conflict resolution.",
      "Built with Bun, React, TypeScript, and Tailwind CSS.",
    ],
  },
  {
    year: "2025", title: "CodeWiki", glyph: "cards", href: "https://github.com/roulpriya/codewiki",
    highlights: [
      "Built a system that generates and maintains code documentation and a cross-repository knowledge graph from source code and Git history.",
      "Implemented a web-based interface to read and run queries against the generated documentation.",
      "Implemented an MCP interface to query the knowledge base from coding agents.",
    ],
  },
  {
    year: "2025", title: "Source Radar", glyph: "radar", href: "https://github.com/sourceradar/source-radar",
    highlights: [
      "Built a configurable platform for continuous inspection of code quality, security vulnerabilities, and linter findings across multiple static-analysis tools.",
    ],
  },
];

const skills = [
  { category: "Languages", values: ["Java", "Python", "SQL", "Swift", "TypeScript", "JavaScript"] },
  { category: "Backend & data", values: ["Spring Boot", "Node.js", "FastAPI", "REST APIs", "Apache Camel", "Snowflake", "Cassandra"] },
  { category: "Platform & domain", values: ["Event-driven architecture", "JWT", "Spring Security", "RBAC", "GenAI", "LLMs", "Payment risk", "FX settlement"] },
];

const sections: { id: string; glyph: GlyphType; label: string }[] = [
  { id: "experience", glyph: "briefcase", label: "experience" },
  { id: "open-source", glyph: "branch", label: "open source" },
  { id: "projects", glyph: "layers", label: "projects" },
  { id: "skills", glyph: "code", label: "skills" },
  { id: "education", glyph: "cap", label: "education" },
];

/** An organisation's logo in its own colours, set inline before its name at
 *  the heading's size. Without one it falls back to the name's initials. */
function OrgLogo({ name, src }: { name: string; src?: string }) {
  if (src) return <Image className="orgLogo" src={src} alt="" width={22} height={22} unoptimized />;
  return <span className="orgLogo orgMonogram" aria-hidden="true">{name.split(" ").map((word) => word[0]).join("")}</span>;
}

function Highlights({ items }: { items: string[] }) {
  return <ul className="highlights">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function Period({ start, end }: { start: string; end: string }) {
  return <time>{start} –<br />{" "}{end}</time>;
}

function SectionHeading({ title }: { title: string }) {
  return <div className="sectionHeading"><h2><span>&gt;</span> {title}</h2></div>;
}

export default function ResumePage() {
  return (
    <main className="resume">
      <SiteNav />
      <SideNav sections={sections} />

      <section className="intro">
        <div className="bio">
          <h1><SketchCircle>Priyambada Roul</SketchCircle> is a software engineer at Cashfree Payments, working on payment risk and fraud prevention.</h1>
          <p>Previously at Baton Systems and Accenture. Google Summer of Code 2025 contributor to Swift<span className="cursor" aria-hidden="true">▍</span></p>
        </div>
      </section>

      <section className="collection" id="experience">
        <SectionHeading title="Experience" />
        <div className="list">
          {experience.map((job) => (
            <article className="resumeRow" key={job.company}>
              <Period start={job.start} end={job.end} />
              <div><h3><OrgLogo name={job.company} src={job.logo} />{job.company}</h3><small>{job.position} · {job.location}</small><Highlights items={job.highlights} /></div>
            </article>
          ))}
        </div>
      </section>

      <section className="collection" id="open-source">
        <SectionHeading title="Open source" />
        <div className="list">
          {openSource.map((item) => (
            <a className="listItem" href={item.href} key={item.title} target="_blank" rel="noreferrer">
              <Period start={item.start} end={item.end} />
              <div><h3><OrgLogo name={item.title} src={item.logo} />{item.title}</h3><small>{item.subtitle}</small><Highlights items={item.highlights} /></div>
              <span className="arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="collection" id="projects">
        <SectionHeading title="Projects" />
        <div className="list">
          {projects.map((project) => (
            <a className="listItem" href={project.href} key={project.title} target="_blank" rel="noreferrer">
              <time>{project.year}</time>
              <div><h3><ProjectGlyph type={project.glyph} />{project.title}</h3><Highlights items={project.highlights} /></div>
              <span className="arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="collection" id="skills">
        <SectionHeading title="Skills" />
        <div className="list">
          {skills.map((group) => (
            <div className="resumeRow" key={group.category}>
              <span className="rowLabel">{group.category}</span>
              <p>{group.values.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="collection" id="education">
        <SectionHeading title="Education" />
        <div className="list">
          <article className="resumeRow">
            <Period start="2017" end="2021" />
            <div><h3>Shivaji University</h3><small>Kolhapur, Maharashtra</small><p>B.Tech in Computer Science and Technology · GPA 9.1/10</p></div>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
