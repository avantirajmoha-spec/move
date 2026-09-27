const apiBase = process.env.EXPO_PUBLIC_DOMAIN ? `https://${process.env.EXPO_PUBLIC_DOMAIN}` : '';

export interface ScanResult {
  summary: string;
  zones: { name: string; items: string[]; tip: string }[];
  layout: { label: string; x: number; y: number; width: number; height: number }[];
  nextSteps: string[];
}

export async function scanRoom(input: { room: string; homeType: string; items: string[]; imageBase64?: string; mimeType?: string }) {
  const response = await fetch(`${apiBase}/api/gemini/room-scan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? 'Room scan could not be completed.');
  return response.json() as Promise<ScanResult>;
}

export async function askAssistant(input: { message: string; context: Record<string, unknown> }) {
  const response = await fetch(`${apiBase}/api/gemini/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? 'The assistant could not respond.');
  return response.json() as Promise<{ reply: string }>;
}