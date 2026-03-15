import { deflate, inflate } from "pako";

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

function uint8ToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64UrlToUint8(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function encodeState(state: AppState): string {
  const json = JSON.stringify(state);
  const compressed = deflate(json);
  return uint8ToBase64Url(compressed);
}

export function decodeState(hash: string): AppState | null {
  try {
    const bytes = base64UrlToUint8(hash);
    const json = inflate(bytes, { to: "string" });
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
