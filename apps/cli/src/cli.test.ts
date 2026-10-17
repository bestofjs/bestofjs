import { resolve } from "node:path";
import { captureProgramRun } from "@optique/testing/discover";

import { createCliRunOptions, showHelpForBareGroup } from "./run-cli";
import { describe, expect, it } from "bun:test";

const repositoryRoot = resolve(import.meta.dir, "../../..");
const entryPoint = resolve(import.meta.dir, "cli.ts");
const testDatabaseUrl = "postgresql://test:test@localhost:5432/test";

describe("bare command groups", () => {
  const commands = [{ path: ["tagging"] }, { path: ["tagging", "changes"] }];

  it("turns the root and bare groups into help requests", () => {
    expect(showHelpForBareGroup([], commands)).toEqual(["--help"]);
    expect(showHelpForBareGroup(["tagging"], commands)).toEqual([
      "tagging",
      "--help",
    ]);
  });

  it("leaves leaf commands, options, and unknown commands unchanged", () => {
    expect(showHelpForBareGroup(["tagging", "changes"], commands)).toEqual([
      "tagging",
      "changes",
    ]);
    expect(showHelpForBareGroup(["tagging", "--help"], commands)).toEqual([
      "tagging",
      "--help",
    ]);
    expect(showHelpForBareGroup(["unknown"], commands)).toEqual(["unknown"]);
  });
});

describe("CLI process", () => {
  it("shows root and nested help without database configuration", async () => {
    const [root, tagging, changes] = await Promise.all([
      captureProgramRun(createCliRunOptions([])),
      captureProgramRun(createCliRunOptions(["tagging"])),
      captureProgramRun(createCliRunOptions(["tagging", "changes", "--help"])),
    ]);

    expect(root.exitCode).toBe(0);
    expect(root.stdout).toContain("tagging");
    expect(tagging.exitCode).toBe(0);
    expect(tagging.stdout).toContain("changes");
    expect(changes.exitCode).toBe(0);
    expect(changes.stdout).not.toContain("--dryRun");
  });

  it("rejects the removed stage option and unknown commands", async () => {
    const stageOption = runCli([
      "tagging",
      "changes",
      "--stage",
      "staging",
      "--json",
      '{"ops":[]}',
    ]);
    const command = await captureProgramRun(createCliRunOptions(["unknown"]));

    expect(stageOption.exitCode).toBe(1);
    expect(stageOption.stderr).toContain("--stage");
    expect(command.exitCode).toBe(1);
    expect(command.stderr).toContain("Error:");
  });

  it("runs help and argument validation without database configuration", () => {
    for (const args of [
      [],
      ["tagging"],
      ["tagging", "changes", "--help"],
      ["tagging", "export-catalog", "--help"],
    ]) {
      const result = runCli(args, "");
      expect(result.exitCode).toBe(0);
      expect(result.stderr).toBe("");
    }
    const invalid = runCli(["tagging", "changes", "--json", "{bad}"], "");
    expect(invalid.exitCode).toBe(1);
    expect(invalid.stderr).toContain("Invalid");
    expect(invalid.stderr).not.toContain("POSTGRES_URL");
  });

  it("reports configuration failures once as JSON for each command", () => {
    for (const command of ["changes", "export-catalog"]) {
      const args =
        command === "changes"
          ? ["tagging", command, "--json", '{"ops":[]}']
          : ["tagging", command];
      const result = runCli(args, "");
      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe("");
      expect(result.stderr.trim().split("\n")).toHaveLength(1);
      expect(JSON.parse(result.stderr)).toEqual({
        status: "error",
        command: `tagging ${command}`,
        error: "POSTGRES_URL is not set",
      });
    }
  });

  it("applies an empty plan successfully by default", () => {
    const result = runCli(["tagging", "changes", "--json", '{"ops":[]}']);

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      status: "applied",
      summary: { changed: 0, unchanged: 0 },
      ops: [],
    });
  });
});

function runCli(args: string[], databaseUrl = testDatabaseUrl) {
  const result = Bun.spawnSync({
    cmd: [
      process.execPath,
      "--no-env-file",
      "run",
      "--silent",
      entryPoint,
      ...args,
    ],
    cwd: repositoryRoot,
    env: { ...process.env, POSTGRES_URL: databaseUrl },
    stdout: "pipe",
    stderr: "pipe",
  });

  return {
    exitCode: result.exitCode,
    stdout: result.stdout.toString(),
    stderr: result.stderr.toString(),
  };
}
