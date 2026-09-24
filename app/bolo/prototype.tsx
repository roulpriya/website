"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Composer, Conversation, RecordingBar } from "./bolo-ui";
import { improvisedScenario, type Scenario, scenarios } from "./scenarios";
import { createTurnRecord, isTerminalTurn, type ToolActivityEntry, type Turn } from "./turn";

type VoiceState = "connecting" | "listening" | "translating" | null;

const THREAD_ID = "5d9a1c3e-0000-4000-8000-000000000001";
const VOICE_SCENARIO = scenarios.find((item) => item.voice) ?? scenarios[0];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** The agent labels progress by the tool it is currently running — see
 *  `run.progress = \`Running ${name}\`` in bolo's agent-service. */
function runningLabel(tool: string) {
  return `Running ${tool}`;
}

export function Prototype() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [voice, setVoice] = useState<VoiceState>(null);
  const [recording, setRecording] = useState<{ label: string; seconds: number } | null>(null);
  const [shortcutVisible, setShortcutVisible] = useState(true);
  const [playing, setPlaying] = useState<string | null>(null);
  // Bolo shows only the English translation in the thread, so the sentence you
  // actually spoke is annotated outside the window instead of inside it.
  const [heard, setHeard] = useState<{ english: string; language: string; text: string } | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const conversationRef = useRef<HTMLElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const runToken = useRef(0);
  const answerResolver = useRef<((text: string) => void) | null>(null);

  const latest = turns.at(-1);
  const canAnswer = latest?.state === "waiting_for_user";
  const busy = Boolean(playing) && !canAnswer;
  const canInput = !busy;
  const showStop = Boolean(latest && !isTerminalTurn(latest.state));

  // Same state vocabulary the app derives for its orb: listening, working,
  // attention. In the desktop app these land on <body>; here they land on the
  // screen element so the page around the prototype is untouched.
  const state: string = voice ?? (canAnswer ? "questioning" : latest && !isTerminalTurn(latest.state) ? "running" : "idle");

  useEffect(() => {
    const element = conversationRef.current;
    if (element) {
      requestAnimationFrame(() => element.scrollTo(0, element.scrollHeight));
    }
  }, [turns]);

  const abort = useCallback(() => {
    runToken.current += 1;
    answerResolver.current = null;
    setVoice(null);
    setRecording(null);
    setPlaying(null);
  }, []);

  const run = useCallback(
    async (scenario: Scenario) => {
      runToken.current += 1;
      const token = runToken.current;
      const alive = () => runToken.current === token;
      setPlaying(scenario.id);
      setShortcutVisible(false);
      setHeard(null);

      if (scenario.voice) {
        setHeard({ english: scenario.input, language: scenario.voice.language, text: scenario.voice.heard });
        setVoice("connecting");
        setRecording({ label: "Connecting", seconds: 0 });
        await sleep(520);
        if (!alive()) return;
        for (let second = 0; second <= scenario.voice.seconds; second += 1) {
          setVoice("listening");
          setRecording({ label: "Listening", seconds: second });
          await sleep(620);
          if (!alive()) return;
        }
        setVoice("translating");
        setRecording(null);
        await sleep(950);
        if (!alive()) return;
        setVoice(null);
      }

      const turn = createTurnRecord(THREAD_ID, scenario.input, scenario.mode, scenario.languageCode);
      const turnId = turn.id;
      const update = (apply: (value: Turn) => Turn) => {
        setTurns((previous) => previous.map((item) => (item.id === turnId ? apply(item) : item)));
      };
      setTurns((previous) => [...previous, turn]);

      const toolIds = new Map<string, string>();
      for (const step of scenario.steps) {
        await sleep(step.after);
        if (!alive()) return;

        if (step.kind === "progress") {
          update((value) => ({ ...value, progress: step.label }));
        } else if (step.kind === "tool") {
          const id = crypto.randomUUID();
          toolIds.set(step.ref, id);
          const entry: ToolActivityEntry = {
            at: Date.now(),
            detail: step.detail ?? "",
            id,
            input: step.input,
            kind: "tool_call",
            output: null,
            status: "running",
            tool: step.tool,
          };
          update((value) => ({ ...value, currentTool: step.tool, progress: runningLabel(step.tool), toolActivity: [...value.toolActivity, entry] }));
        } else if (step.kind === "output") {
          const id = toolIds.get(step.ref);
          update((value) => ({
            ...value,
            currentTool: null,
            toolActivity: value.toolActivity.map((item) =>
              item.id === id ? { ...item, completedAt: Date.now(), output: step.output, status: step.status ?? "completed" } : item
            ),
          }));
        } else if (step.kind === "ask") {
          const id = crypto.randomUUID();
          toolIds.set(step.ref, id);
          const questionId = crypto.randomUUID();
          update((value) => ({
            ...value,
            currentTool: "ask_user_question",
            messages: [...value.messages, { id: crypto.randomUUID(), kind: "question", questionId, role: "assistant", text: step.prompt }],
            pendingQuestion: { id: questionId, kind: "input", prompt: step.prompt },
            progress: "Waiting for your answer",
            state: "waiting_for_user",
            toolActivity: [
              ...value.toolActivity,
              { at: Date.now(), detail: "", id, input: JSON.stringify({ kind: "input", prompt: step.prompt }), kind: "tool_call", output: null, status: "running", tool: "ask_user_question" },
            ],
          }));
          inputRef.current?.focus();
          const answer = await new Promise<string>((resolve) => {
            answerResolver.current = resolve;
          });
          if (!alive()) return;
          update((value) => ({
            ...value,
            currentTool: null,
            messages: [...value.messages, { id: crypto.randomUUID(), kind: "answer", questionId, role: "user", text: answer }],
            pendingQuestion: null,
            progress: "Continuing",
            state: "running",
            toolActivity: value.toolActivity.map((item) => (item.id === id ? { ...item, completedAt: Date.now(), output: "Response received.", status: "completed" } : item)),
          }));
        } else if (step.kind === "say") {
          update((value) => ({ ...value, progress: "Preparing response" }));
          const chunks = step.text.match(/\S+\s*/g) ?? [step.text];
          let streamed = "";
          for (let index = 0; index < chunks.length; index += 1) {
            streamed += chunks[index];
            const snapshot = streamed;
            update((value) => ({ ...value, response: snapshot }));
            if (index % 2 === 1) {
              await sleep(34);
              if (!alive()) return;
            }
          }
        } else {
          update((value) => ({
            ...value,
            finishedAt: Date.now(),
            progress: step.state === "failed" ? "Failed" : "Complete",
            result: step.result,
            state: step.state ?? "completed",
          }));
        }
      }
      if (alive()) {
        setPlaying(null);
      }
    },
    []
  );

  const start = useCallback(
    (scenario: Scenario) => {
      setInput("");
      run(scenario).catch(() => abort());
    },
    [abort, run]
  );

  const submit = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    if (canAnswer && answerResolver.current) {
      const resolve = answerResolver.current;
      answerResolver.current = null;
      setInput("");
      resolve(text);
      return;
    }
    if (busy) return;
    const match = scenarios.find((item) => item.input.toLowerCase() === text.toLowerCase() || item.chip.toLowerCase() === text.toLowerCase());
    start(match ?? improvisedScenario(text));
  }, [busy, canAnswer, input, start]);

  const stop = useCallback(() => {
    abort();
    setTurns((previous) =>
      previous.map((item, index) =>
        index === previous.length - 1 && !isTerminalTurn(item.state)
          ? { ...item, currentTool: null, finishedAt: Date.now(), pendingQuestion: null, progress: "Stopped", state: "cancelled" }
          : item
      )
    );
  }, [abort]);

  const reset = useCallback(() => {
    abort();
    setTurns([]);
    setInput("");
    setHeard(null);
    setShortcutVisible(true);
  }, [abort]);

  return (
    <div className="protoStage">
      <div className="mac">
        <div className="macScreen" data-state={state} ref={screenRef}>
          <div className="macWall" />
          <div className="macBar">
            <span className="macNotch" aria-hidden="true" />
            <span className="macBarLeft">
              <svg aria-hidden="true" className="macGlyph" viewBox="0 0 16 16">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 2a5 5 0 1 1 0 10A5 5 0 0 1 8 3Zm0 2.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5Z" fill="currentColor" />
              </svg>
              <b>Bolo</b>
              <i>File</i>
              <i>Edit</i>
              <i>View</i>
              <i>Help</i>
            </span>
            <span className="macBarRight">
              <i>हिं</i>
              <i>100%</i>
              <i>Fri 11 Sep</i>
              <i>10:01</i>
            </span>
          </div>

          <div className="bolo-app" data-state={state}>
            <main aria-label="Bolo execution agent" className="palette">
              <nav aria-label="Conversations" className="thread-picker">
                <div className="thread-picker-actions">
                  <button className="btn-quiet" type="button" onClick={reset}>
                    Conversations
                  </button>
                  <button className="btn-quiet" type="button" onClick={reset}>
                    New conversation
                  </button>
                </div>
              </nav>
              <Conversation reference={conversationRef} turns={turns} />
              <RecordingBar onCancel={abort} recording={recording} />
              <Composer
                canAnswer={canAnswer}
                canInput={canInput}
                input={input}
                inputRef={inputRef}
                onChange={setInput}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    submit();
                  }
                }}
                onRecord={() => start(VOICE_SCENARIO)}
                onSettings={reset}
                onStop={stop}
                onSubmit={(event) => {
                  event.preventDefault();
                  submit();
                }}
                showStop={showStop}
              />
              {shortcutVisible ? (
                <footer className="shortcut-hint">
                  <kbd>⌘</kbd>
                  <kbd>⇧</kbd>
                  <kbd>Space</kbd> to show Bolo
                </footer>
              ) : null}
            </main>
          </div>
        </div>
      </div>

      {heard ? (
        <p className="protoHeard">
          <span className="protoHeardTag">heard · {heard.language}</span>
          <span className="protoHeardSaid">“{heard.text}”</span>
          <span aria-hidden="true">→</span>
          <span className="protoHeardEn">“{heard.english}”</span>
        </p>
      ) : null}

      <p className="protoHint">
        <span className="protoHintArrow" aria-hidden="true">
          ↑
        </span>
        {"// psst — it's interactive. pick a task:"}
      </p>

      <div className="protoChips">
        {scenarios.map((scenario) => (
          <button className="protoChip" data-active={playing === scenario.id ? "true" : undefined} key={scenario.id} onClick={() => start(scenario)} type="button">
            <span className="protoChipIcon" aria-hidden="true">
              {scenario.voice ? "◉" : "›"}
            </span>
            <span>
              <strong>{scenario.chip}</strong>
              <small>{scenario.note}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
