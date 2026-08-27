const projects = [
  { year: "2026", title: "AgentForge", description: "A Kanban board that spawns AI coding agents in isolated git worktrees — one agent per ticket.", href: "https://github.com/inputforge/agentforge", tags: "TypeScript · React · Bun · SQLite" },
  { year: "2025", title: "Source Radar", description: "Source-code analysis and metrics across multiple languages, built around an extensible plugin architecture.", href: "https://github.com/sourceradar/source-radar", tags: "TypeScript · Python" },
  { year: "2025", title: "DocKeeper", description: "An AI document agent that reads code changes and keeps documentation in sync automatically.", href: "https://github.com/roulpriya/dockeeper", tags: "TypeScript · Node.js · OpenAI" },
  { year: "2026", title: "Content Manager", description: "A multi-day content calendar with topic scheduling, AI-assisted writing, and memory management.", href: "https://github.com/roulpriya/content-manager", tags: "TypeScript · Docker" },
];

const articles = [
  { date: "Jun 22, 2025", title: "From Career Break to GSoC: My Open Source Journey", description: "From wiping my disk while installing Ubuntu to writing Swift and TypeScript used by thousands of developers.", href: "https://medium.com/@priyaroul99/from-career-break-to-gsoc-my-open-source-journey-24b908416ac5" },
  { date: "Mar 06, 2025", title: "The Internal Workings of a HashMap", description: "A visual, practical dive into how HashMaps make data access feel instant.", href: "https://medium.com/@priyaroul99/the-internal-workings-of-a-hashmap-a-deep-dive-15bf0580babb" },
  { date: "Feb 04, 2025", title: "REWORK: The Must-Read Business Book", description: "Stop planning, start building — lessons from a book made for modern makers.", href: "https://medium.com/@priyaroul99/rework-the-must-read-business-book-for-2025-08ade2e647c4" },
  { date: "Oct 26, 2024", title: "Introduction to Redis", description: "What the in-memory powerhouse is, how it works, and when to reach for it.", href: "https://medium.com/next-level-coding/introduction-to-redis-the-in-memory-powerhouse-8950265802e3" },
];

export default function Home() {
  return (
    <main>
      <nav aria-label="Primary navigation">
        <a className="brand" href="#top">~/priya</a>
        <div className="navLinks"><a href="#work">./work</a><a href="#writing">./writing</a></div>
      </nav>

      <section className="intro" id="top">
        <div className="eyebrow">Bangalore, India · building since 2017</div>
        <h1><span>&gt;</span> Priyambada Roul</h1>
        <p className="role">// software engineer &amp; open-source builder</p>
        <div className="bioGrid">
          <img className="portrait" src="/priya.jpg" alt="Priyambada Roul" />
          <div className="bio">
            <p>I’m a software engineer at <strong>Cashfree Payments</strong>, where I build scalable systems for post-payment processing and risk. I care about thoughtful infrastructure, useful developer tools, and products that hold up in the real world.</p>
            <p>I’ve contributed to open source through <strong>Google Summer of Code with Swift</strong>, working on toolchain management and the Swift extension for Visual Studio Code. Lately, I’ve been exploring how AI can turn ideas into working systems faster — without losing the craft in the process.</p>
            <p>Away from code, I’ve practised <strong>Bharatanatyam</strong> since I was five. It shaped how I think about structure, rhythm, and expression in everything I make.</p>
          </div>
        </div>
      </section>

      <section className="collection" id="work">
        <div className="sectionHeading"><h2><span>&gt;</span> Selected work</h2><p>// systems, tools, and experiments I’ve shipped</p></div>
        <div className="list">
          {projects.map((project) => (
            <a className="listItem" href={project.href} key={project.title} target="_blank" rel="noreferrer">
              <time>{project.year}</time><div><h3><span>&gt;</span>{project.title}</h3><p>{project.description}</p><small>{project.tags}</small></div><span className="arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="collection" id="writing">
        <div className="sectionHeading"><h2><span>&gt;</span> Notes &amp; writing</h2><p>// ideas about engineering, open source, and building</p></div>
        <div className="list">
          {articles.map((article) => (
            <a className="listItem" href={article.href} key={article.title} target="_blank" rel="noreferrer">
              <time>{article.date}</time><div><h3><span>&gt;</span>{article.title}</h3><p>{article.description}</p></div><span className="arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <footer><p><span>$</span> sendmail priyaroul99@gmail.com</p><div><a href="mailto:priyaroul99@gmail.com">email</a><a href="https://github.com/roulpriya" target="_blank" rel="noreferrer">github</a><a href="https://www.linkedin.com/in/priyambadaroul/" target="_blank" rel="noreferrer">linkedin</a><a href="https://twitter.com/tarntism_priya" target="_blank" rel="noreferrer">twitter</a></div></footer>
    </main>
  );
}
