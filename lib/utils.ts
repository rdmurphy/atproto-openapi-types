import type { LexiconDoc } from "@atproto/lexicon";
import type { WalkEntry } from "std/fs/mod.ts";

export async function loadLexicon(entry: WalkEntry): Promise<LexiconDoc> {
  const file = await Deno.readTextFile(entry.path);
  const lexicon = JSON.parse(file) as LexiconDoc;

  return lexicon;
}

export function isEmptyObject(object: Record<string, unknown>) {
  return Object.keys(object).length === 0;
}

export function calculateTag(id: string): string {
  return id.split(".").slice(0, 3).join(".");
}
