import { cp, mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getSessionUser,
  signIn,
  signOut,
  updateReminder,
  updateSettings,
} from "@/lib/server/services";

describe.sequential("server services", () => {
  const originalDataFile = process.env.EMARAT_DATA_FILE;
  let tempDataFile = "";

  beforeEach(async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "emarat-services-"));
    tempDataFile = path.join(tempDir, "emarat-db.json");
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

  it("persists settings updates to the configured data file", async () => {
    const settings = await updateSettings({
      travelMode: true,
      themePreference: "dark",
    });

    const written = JSON.parse(await readFile(tempDataFile, "utf8")) as {
      settings: {
        travelMode: boolean;
        themePreference: string;
      };
    };

    expect(settings.travelMode).toBe(true);
    expect(settings.themePreference).toBe("dark");
    expect(written.settings.travelMode).toBe(true);
    expect(written.settings.themePreference).toBe("dark");
  });

  it("persists reminder updates and signs users in and out", async () => {
    const reminder = await updateReminder("r-2", {
      enabled: false,
      offsetMinutes: -10,
    });
    const session = await signIn({
      email: "you@example.com",
      password: "emarat-demo",
    });
    const signedInUser = await getSessionUser(session.sessionToken);
    const written = JSON.parse(await readFile(tempDataFile, "utf8")) as {
      sessions: Array<{
        userId: string;
      }>;
    };

    await signOut(session.sessionToken);
    const signedOutUser = await getSessionUser(session.sessionToken);

    expect(reminder.enabled).toBe(false);
    expect(reminder.offsetMinutes).toBe(-10);
    expect(session.user.email).toBe("you@example.com");
    expect(session.sessionToken.length).toBeGreaterThan(10);
    expect(signedInUser?.id).toBe("user-demo");
    expect(written.sessions).toHaveLength(1);
    expect(written.sessions[0]?.userId).toBe("user-demo");
    expect(signedOutUser).toBeNull();
  });
});
