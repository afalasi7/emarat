import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";

const generatedTypesDir = path.join(process.cwd(), ".next", "types");

await runCommand("next", ["typegen"]);
await removeDuplicateTypegenFiles(generatedTypesDir);
await runCommand("tsc", ["--noEmit"]);

async function removeDuplicateTypegenFiles(directory) {
  try {
    const entries = await readdir(directory, {
      withFileTypes: true,
    });

    await Promise.all(
      entries
        .filter(
          (entry) =>
            entry.isFile() &&
            /\s\d+\.(ts|json)$/.test(entry.name),
        )
        .map((entry) => rm(path.join(directory, entry.name))),
    );
  } catch (error) {
    if (isMissingDirectory(error)) {
      return;
    }

    throw error;
  }
}

async function runCommand(binary, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(
      process.platform === "win32" ? "npx.cmd" : "npx",
      [binary, ...args],
      {
        stdio: "inherit",
      },
    );

    child.on("exit", (code) => {
      if (code === 0) {
        resolve(undefined);
        return;
      }

      reject(new Error(`${binary} exited with code ${code ?? "unknown"}`));
    });

    child.on("error", reject);
  });
}

function isMissingDirectory(error) {
  return (
    error instanceof Error &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
