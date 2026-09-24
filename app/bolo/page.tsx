import type { Metadata } from "next";
import { headers } from "next/headers";
import { SiteFooter } from "../site-footer";
import { SiteNav } from "../site-nav";
import "./bolo.css";
import { Prototype } from "./prototype";

const title = "Bolo — a voice assistant for macOS";
const description = "A voice-first computer assistant for macOS. Speak in Hindi, Hinglish or English; it works your files, terminal, browser and desktop apps, then answers back in your language.";

const repo = "https://github.com/roulpriya/bolo_hackathon";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "priyaroul.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  const image = `${protocol}://${host}/og.png`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", images: [{ url: image, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

const features = [
  { lead: "Voice", name: "control" },
  { lead: "Runs", name: "terminal commands" },
  { lead: "Reads and writes", name: "files" },
  { lead: "Controls", name: "a browser" },
  { lead: "Operates", name: "macOS apps" },
  { lead: "Creates", name: "reminders" },
  { lead: "Asks", name: "before deciding for you" },
  { lead: "Replies", name: "in your language" },
];

const stack = [
  { label: "Speech", detail: "Speech is transcribed and translated as you talk. Bolo detects the language and speaks its answer back in it." },
  { label: "Agent", detail: "A single agent plans the task and calls tools until it finishes. If it needs a decision from you, it stops and asks." },
  { label: "Isolation", detail: "Tools, API keys, and cancellation run in the main process. The UI window has no filesystem access and talks to it through a validated IPC bridge." },
  { label: "Browser", detail: "A visible browser window with its own profile, so logins persist. You enter passwords yourself; the agent never sees them." },
  { label: "MCP", detail: "MCP servers connect over stdio or HTTP with OAuth, and their tools become available to the agent." },
];

export default function BoloPage() {
  return (
    <main>
      <SiteNav />

      <section className="boloHero" id="top">
        <h1>Bolo</h1>
        <p className="boloLede">
          A voice assistant for macOS. You speak to it in Hindi, Hinglish, or English, and it carries out the task using your files, the terminal, a browser, and your
          desktop apps. It replies in the language you spoke.
        </p>
        <div className="boloActions">
          <a className="boloCta" href={repo} target="_blank" rel="noreferrer">
            View on GitHub
          </a>
          <a className="boloCta boloCtaGhost" href="#demo">
            Demo
          </a>
          <span className="boloMeta">macOS 14+ · apple silicon &amp; intel</span>
        </div>
      </section>

      <section className="collection" id="demo">
        <div className="sectionHeading">
          <h2>
            <span>&gt;</span> Demo
          </h2>
        </div>
        <div className="boloDemo">
          <Prototype />
        </div>
      </section>

      <section className="collection" id="does">
        <div className="sectionHeading">
          <h2>
            <span>&gt;</span> What it does
          </h2>
        </div>
        <div className="boloGrid">
          {features.map((feature) => (
            <div className="boloTile" key={feature.name}>
              <span>{feature.lead}</span>
              <strong>{feature.name}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="collection" id="internals">
        <div className="sectionHeading">
          <h2>
            <span>&gt;</span> Under the hood
          </h2>
        </div>
        <dl className="boloStack">
          {stack.map((entry) => (
            <div key={entry.label} style={{ display: "contents" }}>
              <dt>{entry.label}</dt>
              <dd>{entry.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="collection" id="get">
        <div className="sectionHeading">
          <h2>
            <span>&gt;</span> Source
          </h2>
        </div>
        <div className="boloGet">
          <a className="boloCta boloCtaLarge" href={repo} target="_blank" rel="noreferrer">
            View Bolo on GitHub
          </a>
          <p className="boloMeta">macOS 14 or newer · apple silicon &amp; intel</p>
        </div>
        <p className="boloNote">
          Bolo runs from the menu bar. Press <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>Space</kbd> to open it. It asks for microphone access the first time you speak, and for
          Accessibility and Screen Recording the first time a task needs to control another app.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
