import { cp, mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe.sequential("private api authorization", () => {
  const originalDataFile = process.env.EMARAT_DATA_FILE;

  beforeEach(async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "emarat-private-api-"));
    const tempDataFile = path.join(tempDir, "emarat-db.json");
    await cp(path.join(process.cwd(), "data", "emarat-db.json"), tempDataFile);
    process.env.EMARAT_DATA_FILE = tempDataFile;
  });

  afterEach(() => {
    if (originalDataFile) {
      process.env.EMARAT_DATA_FILE = originalDataFile;
      return;
    }

    delete process.env.EMARAT_DATA_FILE;
  });

  it("rejects unauthenticated settings reads and writes", async () => {
    vi.resetModules();
    vi.doMock("next/headers", () => ({
      cookies: async () => ({
        get: () => undefined,
      }),
    }));

    const { GET: getSettings, PATCH: patchSettings } = await import(
      "@/app/api/settings/route"
    );
    const getResponse = await getSettings();
    const patchResponse = await patchSettings(
      new Request("http://localhost/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          travelMode: true,
        }),
      }) as never,
    );

    await expect(getResponse.json()).resolves.toEqual({
      error: "Sign in to access synced data",
    });
    await expect(patchResponse.json()).resolves.toEqual({
      error: "Sign in to access synced data",
    });
    expect(getResponse.status).toBe(401);
    expect(patchResponse.status).toBe(401);
  });
});
