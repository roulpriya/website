// Recorded runs. Each scenario replays as the real agent loop would report it:
// a progress label, tool calls that open in a "running" state and later resolve
// with their real output shape (bash results arrive as the JSON envelope
// `TerminalPanel` parses), a streamed response, then a terminal turn state.
export type Step =
  | { kind: "progress"; after: number; label: string }
  | { kind: "tool"; after: number; ref: string; tool: string; input: string; detail?: string }
  | { kind: "output"; after: number; ref: string; output: string; status?: "completed" | "failed" }
  | { kind: "say"; after: number; text: string }
  | { kind: "ask"; after: number; ref: string; prompt: string }
  | { kind: "finish"; after: number; result: string; state?: "completed" | "failed" };

export interface Scenario {
  id: string;
  chip: string;
  /** Text that lands in the composer and in the user's bubble. For voice runs
   *  this is the English translation, exactly as the app records it. */
  input: string;
  mode: "typed" | "voice";
  languageCode: string;
  /** Present on voice runs: what was actually spoken, before translation. */
  voice?: { heard: string; language: string; seconds: number };
  note: string;
  steps: Step[];
}

function bash(stdout: string, exitCode = 0, stderr = ""): string {
  return JSON.stringify({ output: [{ outcome: { exitCode, type: "exit" }, stderr, stdout }] });
}

export const scenarios: Scenario[] = [
  {
    id: "invoices",
    chip: "Total my last three invoices",
    input: "Add up the last three invoices in my Downloads folder and tell me the total",
    mode: "typed",
    languageCode: "en-IN",
    note: "Reads real files off disk and shows every command it ran to get there.",
    steps: [
      { kind: "progress", after: 350, label: "Starting agent" },
      { kind: "tool", after: 550, ref: "ls", tool: "bash", input: JSON.stringify({ command: "ls -t ~/Downloads/*.pdf | head -3" }) },
      {
        kind: "output",
        after: 900,
        ref: "ls",
        output: bash("/Users/priya/Downloads/invoice-hosting-aug.pdf\n/Users/priya/Downloads/invoice-domains-aug.pdf\n/Users/priya/Downloads/invoice-cowork-jul.pdf"),
      },
      { kind: "tool", after: 300, ref: "r1", tool: "read", input: JSON.stringify({ path: "~/Downloads/invoice-hosting-aug.pdf" }) },
      { kind: "output", after: 700, ref: "r1", output: "Invoice WH-2291 · 31 Aug 2026\nWeb hosting · Amount due ₹4,720.00" },
      { kind: "tool", after: 200, ref: "r2", tool: "read", input: JSON.stringify({ path: "~/Downloads/invoice-domains-aug.pdf" }) },
      { kind: "output", after: 650, ref: "r2", output: "Invoice DN-88134 · 28 Aug 2026\nDomain renewals · Amount due ₹1,660.00" },
      { kind: "tool", after: 200, ref: "r3", tool: "read", input: JSON.stringify({ path: "~/Downloads/invoice-cowork-jul.pdf" }) },
      { kind: "output", after: 650, ref: "r3", output: "Invoice CW-0417 · 30 Jul 2026\nCoworking desk · Amount due ₹2,000.00" },
      {
        kind: "say",
        after: 400,
        text:
          "Three invoices, **₹8,380.00** in total.\n\n" +
          "| Invoice | Date | Amount |\n| --- | --- | --- |\n" +
          "| WH-2291 | 31 Aug | ₹4,720.00 |\n| DN-88134 | 28 Aug | ₹1,660.00 |\n| CW-0417 | 30 Jul | ₹2,000.00 |\n\n" +
          "The coworking desk is a July invoice — say the word and I'll drop it from the total.",
      },
      { kind: "finish", after: 300, result: "Three invoices, ₹8,380.00 in total." },
    ],
  },
  {
    id: "reminder",
    chip: "कल 9 बजे dentist का reminder",
    input: "Set a reminder for the dentist tomorrow at 9 in the morning",
    mode: "voice",
    languageCode: "hi-IN",
    voice: { heard: "कल सुबह नौ बजे dentist का reminder लगा दो", language: "Hindi", seconds: 4 },
    note: "Speak Hindi, Hinglish or English. Bolo detects the language, works in English, and answers back in yours.",
    steps: [
      { kind: "progress", after: 300, label: "Starting agent" },
      {
        kind: "tool",
        after: 500,
        ref: "rem",
        tool: "create_reminder",
        input: JSON.stringify({ title: "Dentist", due: "2026-09-12T09:00:00+05:30", list: "Reminders" }),
      },
      { kind: "output", after: 900, ref: "rem", output: '{\n  "status": "created",\n  "list": "Reminders",\n  "due": "Sat 12 Sep 2026, 9:00 AM IST"\n}' },
      { kind: "say", after: 400, text: "ठीक है — कल सुबह **9:00 बजे** dentist का reminder लगा दिया है. Reminders app में दिख जाएगा." },
      { kind: "finish", after: 300, result: "Dentist reminder set for tomorrow at 9:00 AM." },
    ],
  },
  {
    id: "train",
    chip: "Find me a train to Mysuru",
    input: "Find me a morning train to Mysuru this Saturday and get the booking page open",
    mode: "typed",
    languageCode: "en-IN",
    note: "When a choice is yours to make, it stops and asks. Answer in the composer to carry on.",
    steps: [
      { kind: "progress", after: 350, label: "Starting agent" },
      { kind: "tool", after: 500, ref: "search", tool: "web_search", input: JSON.stringify({ query: "Bengaluru to Mysuru trains Saturday morning" }) },
      {
        kind: "output",
        after: 1100,
        ref: "search",
        output: "20607 Vande Bharat Express · SBC 05:45 → MYS 07:50 · 2h 05m · CC ₹900\n12007 Mysuru Shatabdi · SBC 06:10 → MYS 08:35 · 2h 25m · CC ₹700\n16022 Kaveri Express · SBC 07:30 → MYS 10:40 · 3h 10m · SL ₹180",
      },
      {
        kind: "ask",
        after: 400,
        ref: "ask",
        prompt: "Two good morning options: Vande Bharat 20607 at 05:45 (2h 05m, ₹900) or Shatabdi 12007 at 06:10 (2h 25m, ₹700). Which should I open?",
      },
      {
        kind: "tool",
        after: 300,
        ref: "browser",
        tool: "browser_use",
        input: JSON.stringify({ task: "Open IRCTC, search SBC → MYS for Sat 13 Sep, select train 20607 CC, stop at passenger details" }),
      },
      {
        kind: "output",
        after: 1600,
        ref: "browser",
        output: "Signed in as priyaroul. Selected 20607 · CC · Sat 13 Sep.\nStopped at the passenger details step — payment not attempted.",
      },
      {
        kind: "say",
        after: 300,
        text:
          "**Vande Bharat 20607**, Sat 13 Sep, 05:45 → 07:50.\n\n" +
          "The booking page is open at passenger details in Bolo's own browser window. I stopped before payment — type your card in there yourself. I never take credential values.",
      },
      { kind: "finish", after: 300, result: "Vande Bharat 20607 held at the passenger details step." },
    ],
  },
  {
    id: "screenshots",
    chip: "Tidy the screenshots off my Desktop",
    input: "Move every screenshot on my Desktop into a dated folder",
    mode: "typed",
    languageCode: "en-IN",
    note: "Tool calls fail in the open, not behind a spinner — and it works the problem from there.",
    steps: [
      { kind: "progress", after: 350, label: "Starting agent" },
      { kind: "tool", after: 500, ref: "count", tool: "bash", input: JSON.stringify({ command: "ls ~/Desktop/Screenshot*.png | wc -l" }) },
      { kind: "output", after: 750, ref: "count", output: bash("      37") },
      {
        kind: "tool",
        after: 300,
        ref: "move",
        tool: "bash",
        input: JSON.stringify({ command: "mkdir -p ~/Pictures/Screenshots/2026-09 && mv ~/Desktop/Screenshot*.png ~/Pictures/Screenshots/2026-09/" }),
      },
      {
        kind: "output",
        after: 950,
        ref: "move",
        status: "failed",
        output: bash("", 1, "mv: rename /Users/priya/Desktop/Screenshot 2026-09-04 at 11.21.08.png: No such file or directory"),
      },
      {
        kind: "tool",
        after: 350,
        ref: "loop",
        tool: "bash",
        input: JSON.stringify({ command: 'for f in ~/Desktop/Screenshot*.png; do mv "$f" ~/Pictures/Screenshots/2026-09/; done' }),
      },
      { kind: "output", after: 1200, ref: "loop", output: bash("") },
      { kind: "tool", after: 200, ref: "verify", tool: "bash", input: JSON.stringify({ command: "ls ~/Pictures/Screenshots/2026-09 | wc -l" }) },
      { kind: "output", after: 600, ref: "verify", output: bash("      37") },
      {
        kind: "say",
        after: 350,
        text:
          "All 37 screenshots are in `~/Pictures/Screenshots/2026-09` and your Desktop is clear.\n\n" +
          "The bulk `mv` broke on filenames containing spaces, so I moved them one at a time and counted the folder afterwards to be sure.",
      },
      { kind: "finish", after: 300, result: "37 screenshots moved to ~/Pictures/Screenshots/2026-09." },
    ],
  },
];

export function improvisedScenario(input: string): Scenario {
  return {
    id: "improvised",
    chip: input,
    input,
    mode: "typed",
    languageCode: "en-IN",
    note: "",
    steps: [
      { kind: "progress", after: 400, label: "Starting agent" },
      { kind: "progress", after: 700, label: "Preparing response" },
      {
        kind: "say",
        after: 500,
        text: "This one's a replay, so I can't actually go and do that here — the real Bolo can. Pick one of the recorded tasks below and watch a full run instead.",
      },
      { kind: "finish", after: 300, result: "Prototype replay — pick a recorded task." },
    ],
  };
}
