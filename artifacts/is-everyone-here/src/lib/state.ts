import { deflate, inflate } from "pako";
import { fromBase64, toBase64 } from "js-base64";

export type PersonStatus = "pending" | "here" | "not_here" | "left";

export interface Person {
  id: string;
  name: string;
  status: PersonStatus;
}

export type AppPhase = "setup" | "checkin" | "checkout";

export interface AppState {
  phase: AppPhase;
  people: Person[];
  currentIndex: number;
}

export function encodeState(state: AppState): string {
  const json = JSON.stringify(state);
  const compressed = deflate(json);
  return toBase64(compressed, true);
}

export function decodeState(hash: string): AppState | null {
  try {
    const compressed = fromBase64(hash);
    const json = inflate(compressed, { to: "string" });
    return JSON.parse(json) as AppState;
  } catch {
    return null;
  }
}

export function getStateFromUrl(): AppState | null {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  return decodeState(hash);
}

export function saveStateToUrl(state: AppState): void {
  const encoded = encodeState(state);
  window.history.replaceState(null, "", "#" + encoded);
}

export function createInitialState(): AppState {
  return {
    phase: "setup",
    people: [],
    currentIndex: 0,
  };
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}
