import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/server/auth";

describe("server auth helpers", () => {
  it("hashes and verifies the demo password", () => {
    const salt = "emarat-demo-salt";
    const hash = hashPassword("emarat-demo", salt);

    expect(hash).toHaveLength(128);
    expect(
      verifyPassword({
        password: "emarat-demo",
        salt,
        expectedHash: hash,
      }),
    ).toBe(true);
    expect(
      verifyPassword({
        password: "wrong-password",
        salt,
        expectedHash: hash,
      }),
    ).toBe(false);
  });
});
