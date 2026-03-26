import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { backendStateSchema } from "@/lib/schemas";
import type { BackendState } from "@/types/domain";

const DEFAULT_DATA_FILE = path.join(process.cwd(), "data", "emarat-db.json");

function getDataFilePath() {
  return process.env.EMARAT_DATA_FILE ?? DEFAULT_DATA_FILE;
}

export async function readDatabase() {
  const raw = await readFile(getDataFilePath(), "utf8");
  return backendStateSchema.parse(JSON.parse(raw)) satisfies BackendState;
}

export async function writeDatabase(data: BackendState) {
  const parsed = backendStateSchema.parse(data);
  await writeFile(getDataFilePath(), `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
  return parsed;
}

export async function updateDatabase(
  updater: (current: BackendState) => BackendState,
) {
  const current = await readDatabase();
  const next = updater(current);
  return writeDatabase(next);
}
