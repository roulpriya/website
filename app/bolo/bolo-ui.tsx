"use client";

// Bolo's renderer components, ported from bolo_hackathon/src/renderer with the
// DOM and class names left intact so `bolo.css` — which is that app's own
// stylesheet — applies unchanged. The only substitution is react-aria-components
// (Button / TextArea / Disclosure) for plain elements rendering the same
// markup; the desktop app needs react-aria's press handling under a strict CSP,
// a web page does not.
import type { FormEventHandler, KeyboardEventHandler, ReactNode, RefObject } from "react";
import { Fragment, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bell, BookOpen, Globe, MessageCircleQuestionMark, Mic, PencilLine, Search, Send, Settings, Square, Terminal } from "./icons";
import { isTerminalTurn, type ToolActivityEntry, type Turn } from "./turn";

type IconComponent = (props: { className?: string }) => ReactNode;

// --- ui/button.tsx -------------------------------------------------------
type ButtonVariant = "icon" | "icon-only" | "send" | "stop" | "quiet" | "row";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  icon: "btn-icon",
  "icon-only": "btn-icon-only",
  quiet: "btn-quiet",
  row: "btn-row",
  send: "btn-send",
  stop: "btn-stop",
};

function Button({
  children,
  className,
  hidden,
  isDisabled,
  onPress,
  title,
  type = "button",
  variant,
  ...props
}: {
  children: ReactNode;
  className?: string;
  hidden?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
  title?: string;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  "aria-current"?: "true" | undefined;
  "aria-controls"?: string;
  "aria-expanded"?: boolean;
  "aria-label"?: string;
}) {
  const classes = [variant ? VARIANT_CLASS[variant] : "", className].filter(Boolean).join(" ");
  return (
    <button className={classes || undefined} disabled={isDisabled} hidden={hidden} onClick={onPress} title={title} type={type} {...props}>
      {children}
    </button>
  );
}

// --- ui/text-area.tsx ----------------------------------------------------
function TextArea({
  isDisabled,
  onChange,
  ref,
  ...props
}: {
  "aria-label": string;
  isDisabled?: boolean;
  maxLength?: number;
  onChange: (value: string) => void;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
  placeholder: string;
  ref: RefObject<HTMLTextAreaElement | null>;
  rows: number;
  value: string;
}) {
  return (
    <div className="field-inline">
      <textarea className="text-area" disabled={isDisabled} onChange={(event) => onChange(event.target.value)} ref={ref} {...props} />
    </div>
  );
}

// --- ui/disclosure.tsx ---------------------------------------------------
function Disclosure({
  children,
  className,
  isExpanded,
  onExpandedChange,
  trigger,
  triggerClassName,
}: {
  children: ReactNode;
  className?: string;
  isExpanded?: boolean;
  onExpandedChange?: (isExpanded: boolean) => void;
  trigger: ReactNode;
  triggerClassName?: string;
}) {
  return (
    <div className={["disclosure-root", className].filter(Boolean).join(" ")} data-expanded={isExpanded ? "true" : undefined}>
      <button className={["disclosure-trigger", triggerClassName].filter(Boolean).join(" ")} aria-expanded={isExpanded} onClick={() => onExpandedChange?.(!isExpanded)} type="button">
        {trigger}
      </button>
      {isExpanded ? <div>{children}</div> : null}
    </div>
  );
}

// --- app/components/composer.tsx ----------------------------------------
export function Composer({
  canAnswer,
  canInput,
  input,
  inputRef,
  onChange,
  onKeyDown,
  onRecord,
  onSettings,
  onStop,
  onSubmit,
  showStop,
}: {
  canAnswer: boolean;
  canInput: boolean;
  input: string;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
  onRecord: () => void;
  onSettings: () => void;
  onStop: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  showStop: boolean;
}) {
  return (
    <form className="composer" onSubmit={onSubmit}>
      <span aria-hidden="true" className="composer-orb">
        <i />
      </span>
      <TextArea
        aria-label="Task or answer"
        isDisabled={!canInput}
        maxLength={4000}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={canAnswer ? "Type your answer…" : "What do you want to get done?"}
        ref={inputRef}
        rows={1}
        value={input}
      />
      <Button aria-label="Open settings" onPress={onSettings} title="Settings" variant="icon">
        <Settings />
      </Button>
      <Button aria-label="Start a voice request" isDisabled={!canInput} onPress={onRecord} title="Start voice" variant="icon">
        <Mic />
      </Button>
      {showStop ? (
        <Button aria-label="Stop task" className="composer-stop-button" onPress={onStop} title="Stop task" variant="stop">
          <Square />
          Stop
        </Button>
      ) : null}
      <Button aria-label={canAnswer ? "Send answer" : "Run task"} hidden={!(input.trim() && canInput)} type="submit" variant="send">
        <Send />
      </Button>
    </form>
  );
}

// --- app/components/recording-bar.tsx -----------------------------------
export function RecordingBar({ recording, onCancel }: { recording: { label: string; seconds: number } | null; onCancel: () => void }) {
  if (!recording) {
    return null;
  }
  return (
    <section className="recording-bar">
      <span className="recording-pulse" />
      <strong>{recording.label}</strong>
      <span>
        {Math.floor(recording.seconds / 60)}:{String(recording.seconds % 60).padStart(2, "0")}
      </span>
      <Button className="recording-bar-cancel" onPress={onCancel} variant="quiet">
        Cancel
      </Button>
    </section>
  );
}

// --- app/components/progress.tsx ----------------------------------------
interface TerminalResult {
  outcome?: { exitCode?: number | null; type?: string };
  stderr?: string;
  stdout?: string;
}

function terminalResults(output?: string | null): TerminalResult[] | null {
  if (!output) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(output);
    if (typeof parsed === "object" && parsed && "output" in parsed && Array.isArray(parsed.output)) {
      return parsed.output as TerminalResult[];
    }
    if (typeof parsed === "object" && parsed && ("stdout" in parsed || "stderr" in parsed)) {
      return [parsed as TerminalResult];
    }
  } catch {
    // Some tool failures are plain text rather than JSON.
  }
  return null;
}

function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        a: ({ children: linkChildren, href }) => (
          <a href={href} rel="noopener noreferrer" target="_blank">
            {linkChildren}
          </a>
        ),
      }}
      remarkPlugins={[remarkGfm]}
    >
      {children}
    </ReactMarkdown>
  );
}

function AgentResponse({ children }: { children: string }) {
  return (
    <div className="agent-response">
      <Markdown>{children}</Markdown>
    </div>
  );
}

function TerminalPanel({ command, output, state }: { command: string; output?: string | null; state: string }) {
  const results = terminalResults(output);
  return (
    <div className="terminal-panel">
      <div className="terminal-line">
        <span aria-hidden="true" className="terminal-prompt">
          $
        </span>
        {command}
      </div>
      {results?.map((result) => (
        <Fragment key={`${result.outcome?.exitCode}-${result.stdout}-${result.stderr}`}>
          {Boolean(result.stdout) && <div className="terminal-line terminal-stdout">{result.stdout}</div>}
          {Boolean(result.stderr) && <div className="terminal-line terminal-stderr">{result.stderr}</div>}
          {result.outcome?.type === "exit" && <div className="terminal-line terminal-exit">exit {result.outcome.exitCode ?? "unknown"}</div>}
        </Fragment>
      ))}
      {Boolean(output) && !results && <div className="terminal-line terminal-stderr">{output}</div>}
      {state === "running" && <div className="terminal-line tool-pending">Awaiting command output…</div>}
    </div>
  );
}

function ToolContent({ command, isBash, item, state }: { command: string; isBash: boolean; item: ToolActivityEntry; state: string }) {
  if (isBash) {
    return <TerminalPanel command={command} output={item.output} state={state} />;
  }
  return (
    <>
      {Boolean(item.input) && (
        <section>
          <span>Input</span>
          <pre>{item.input}</pre>
        </section>
      )}
      {Boolean(item.output) && (
        <section>
          <span>{state === "failed" ? "Error" : "Output"}</span>
          <pre>{item.output}</pre>
        </section>
      )}
      {state === "running" && <p className="tool-pending">Awaiting tool output…</p>}
    </>
  );
}

const TOOL_VERBS: Record<string, string> = {
  ask_user_question: "Asked",
  bash: "Ran",
  browser_use: "Used browser for",
  computer_use: "Controlled",
  create_reminder: "Created reminder",
  edit: "Edited",
  read: "Read",
  web_search: "Searched",
  write: "Wrote",
};
const TOOL_ICONS: Record<string, IconComponent> = {
  ask_user_question: MessageCircleQuestionMark,
  bash: Terminal,
  browser_use: Globe,
  computer_use: Square,
  create_reminder: Bell,
  edit: PencilLine,
  read: BookOpen,
  web_search: Search,
  write: PencilLine,
};
const FILE_REF_TOOLS = new Set(["edit", "read", "write"]);

function ToolCall({ item }: { item: ToolActivityEntry & { kind: "tool_call" } }) {
  const [isOpen, setIsOpen] = useState(false);
  const state = item.status || "running";
  const isBash = item.tool === "bash";
  let input: unknown = item.input;
  try {
    input = item.input ? JSON.parse(item.input) : null;
  } catch {
    // Tool inputs may be plain text rather than serialized JSON.
  }
  const verb = TOOL_VERBS[item.tool] || `Used ${item.tool}`;
  const IconComponent = TOOL_ICONS[item.tool] || Terminal;
  const isFileRef = FILE_REF_TOOLS.has(item.tool);
  const preview =
    typeof input === "object" && input
      ? (input as Record<string, unknown>).command ||
        (input as Record<string, unknown>).path ||
        (input as Record<string, unknown>).query ||
        (input as Record<string, unknown>).task ||
        (input as Record<string, unknown>).title ||
        // `ask_user_question` takes { kind, prompt }; without this the app
        // falls through and prints the raw JSON blob as the row's preview.
        // The one deliberate divergence from the desktop source — worth
        // carrying back upstream.
        (input as Record<string, unknown>).prompt ||
        JSON.stringify(input)
      : String(input || "");
  const command = typeof input === "object" && input && "command" in input ? String((input as { command: unknown }).command) : String(preview);
  return (
    <Disclosure
      className={`tool-call ${state}`}
      isExpanded={isOpen}
      onExpandedChange={setIsOpen}
      trigger={
        <>
          <IconComponent className="tool-icon" />
          <span className="tool-call-line">
            <span className="tool-call-verb">{verb}</span>
            {Boolean(preview) && (
              <span className={isFileRef ? "tool-call-target tool-call-target-file" : "tool-call-target"} title={String(preview)}>
                {String(preview)}
              </span>
            )}
          </span>
        </>
      }
      triggerClassName="tool-call-trigger"
    >
      <div className="tool-call-content">
        <ToolContent command={command} isBash={isBash} item={item} state={state} />
      </div>
    </Disclosure>
  );
}

export function Progress({ turn }: { turn: Turn | null }) {
  const finished = Boolean(turn && isTerminalTurn(turn.state));
  // The app collapses the tool list the moment a turn reaches a terminal
  // state, and leaves it toggleable afterwards. Expressed here by resetting
  // the user's override when `finished` flips, rather than via an effect.
  const [override, setOverride] = useState<boolean | null>(null);
  const [wasFinished, setWasFinished] = useState(finished);
  if (wasFinished !== finished) {
    setWasFinished(finished);
    setOverride(null);
  }
  const isCompleteOpen = override ?? !finished;
  const setIsCompleteOpen = setOverride;
  const progressLabel = turn?.progress === "Starting agent" ? "Working" : turn?.progress || "Working";
  const summaryRow = <span className="progress-summary">{progressLabel}</span>;
  const toolCalls = turn?.toolActivity.filter((item): item is ToolActivityEntry & { kind: "tool_call" } => item.kind === "tool_call") ?? [];
  const toolTimeline = Boolean(toolCalls.length) && (
    <section aria-label="Tool calls" className="tool-timeline">
      {toolCalls.map((item) => (
        <ToolCall item={item} key={item.id || `${item.tool}-${item.at}`} />
      ))}
    </section>
  );
  if (finished && turn) {
    const response = turn.response || turn.result;
    return (
      <div className="progress-card progress-complete">
        {toolTimeline ? (
          <Disclosure className="progress-tools" isExpanded={isCompleteOpen} onExpandedChange={setIsCompleteOpen} trigger={summaryRow} triggerClassName="progress-row progress-row-muted">
            {toolTimeline}
          </Disclosure>
        ) : (
          <div className="progress-row progress-row-muted">{summaryRow}</div>
        )}
        {response ? <AgentResponse>{response}</AgentResponse> : null}
      </div>
    );
  }
  return (
    <div className="progress-card">
      <div className="progress-row progress-row-muted">{summaryRow}</div>
      {toolTimeline}
      {turn?.response ? <AgentResponse>{turn.response}</AgentResponse> : null}
    </div>
  );
}

// --- app/components/conversation.tsx ------------------------------------
export function Conversation({ turns, reference }: { turns: Turn[]; reference: RefObject<HTMLElement | null> }) {
  return (
    <section className="conversation" hidden={!turns.length} ref={reference}>
      <div aria-live="polite" className="chat-log">
        {turns.map((turn) => (
          <section aria-label="Turn" key={turn.id}>
            {turn.messages
              .filter((message) => message.kind !== "result")
              .map((message) => (
                <article className={`message ${message.role === "user" ? "user" : "bot"}`} key={message.id}>
                  {message.role === "user" ? <span className="message-label">You</span> : null}
                  <div className="message-body">
                    <Markdown>{message.text}</Markdown>
                  </div>
                </article>
              ))}
            <article className="message bot">
              <div className="message-body">
                <Progress turn={turn} />
              </div>
            </article>
          </section>
        ))}
      </div>
    </section>
  );
}
