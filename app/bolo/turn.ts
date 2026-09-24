// Mirrors the thread model in bolo_hackathon's `src/shared/threads.ts`. The
// real app derives these types from zod schemas validated across the IPC
// bridge; the prototype has no bridge, so the same shapes are declared
// directly. Field names and unions match the app exactly so the renderer
// components below are the app's, unmodified.
export type TurnState = "running" | "waiting_for_user" | "completed" | "failed" | "cancelled";

export interface ToolActivityEntry {
  at: number;
  completedAt?: number;
  detail: string;
  id: string;
  input: string;
  kind: "activity" | "tool_call";
  output: string | null;
  status: "completed" | "failed" | "running";
  tool: string;
}

export interface PendingQuestion {
  id: string;
  kind: "confirmation" | "input";
  prompt: string;
}

export interface ThreadMessage {
  id: string;
  kind: "input" | "question" | "answer" | "result" | "error" | "message";
  questionId?: string;
  role: "user" | "assistant";
  text: string;
}

export interface Turn {
  createdAt: number;
  currentTool: string | null;
  error: string | null;
  finishedAt: number | null;
  id: string;
  input: string;
  inputMode: "typed" | "voice";
  languageCode: string;
  messages: ThreadMessage[];
  pendingQuestion: PendingQuestion | null;
  progress: string;
  response: string;
  result: string | null;
  state: TurnState;
  threadId: string;
  toolActivity: ToolActivityEntry[];
}

export interface Thread {
  createdAt: number;
  id: string;
  revision: number;
  title: string;
  turns: Turn[];
  updatedAt: number;
}

export function isTerminalTurn(state: TurnState): boolean {
  return state === "completed" || state === "failed" || state === "cancelled";
}

export function createTurnRecord(
  threadId: string,
  input: string,
  inputMode: Turn["inputMode"] = "typed",
  languageCode = "en-IN"
): Turn {
  return {
    createdAt: Date.now(),
    currentTool: null,
    error: null,
    finishedAt: null,
    id: crypto.randomUUID(),
    input,
    inputMode,
    languageCode,
    messages: [{ id: crypto.randomUUID(), kind: "input", role: "user", text: input }],
    pendingQuestion: null,
    progress: "Working",
    response: "",
    result: null,
    state: "running",
    threadId,
    toolActivity: [],
  };
}
