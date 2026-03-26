import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { backendStateSchema } from "@/lib/schemas";
import { seedBackendState } from "@/lib/server/seed-state";
import type { BackendState } from "@/types/domain";

const DEFAULT_DATA_FILE = path.join(process.cwd(), "data", "emarat-db.json");
const SERIALIZED_INITIAL_STATE = `${JSON.stringify(
  backendStateSchema.parse(seedBackendState),
  null,
  2,
)}\n`;

function getDataFilePath() {
  return process.env.EMARAT_DATA_FILE ?? DEFAULT_DATA_FILE;
}

function isEnoentError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "ENOENT"
  );
}

async function readDatabaseFileOrSeed(filePath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (!isEnoentError(error)) {
      throw error;
    }

    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, SERIALIZED_INITIAL_STATE, "utf8");
    return SERIALIZED_INITIAL_STATE;
  }
}

export async function readDatabase() {
  const raw = await readDatabaseFileOrSeed(getDataFilePath());
  return backendStateSchema.parse(JSON.parse(raw)) satisfies BackendState;
}

export async function writeDatabase(data: BackendState) {
  const filePath = getDataFilePath();
  const parsed = backendStateSchema.parse(data);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
  return parsed;
}

export async function updateDatabase(
  updater: (current: BackendState) => BackendState,
) {
  const current = await readDatabase();
  const next = updater(current);
  return writeDatabase(next);
}
