import { resolve } from "node:path";
import { captureProgramRun } from "@optique/testing/discover";

import { createCliRunOptions, showHelpForBareGroup } from "./run-cli";
import { describe, expect, it } from "bun:test";

const repositoryRoot = resolve(import.meta.dir, "../../..");
const entryPoint = resolve(import.meta.dir, "cli.ts");

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
  it("shows root and nested discovery without database configuration", async () => {
    const [root, tagging, changes] = await Promise.all([
      captureProgramRun(await createCliRunOptions([])),
      captureProgramRun(await createCliRunOptions(["tagging"])),
      captureProgramRun(
        await createCliRunOptions(["tagging", "changes", "--help"]),
      ),
    ]);

    expect(root.exitCode).toBe(0);
    expect(root.stdout).toContain("tagging");
    expect(tagging.exitCode).toBe(0);
    expect(tagging.stdout).toContain("changes");
    expect(changes.exitCode).toBe(0);
    expect(changes.stdout).toContain("--dryRun");
  });

  it("parses a typed inline plan in dry-run mode", () => {
    const result = runCli([
      "tagging",
      "changes",
      "--dryRun",
      "--json",
      '{"schemaVersion":1,"operations":[]}',
    ]);

    expect(result.exitCode).toBe(2);
    expect(JSON.parse(result.stdout)).toMatchObject({
      status: "not-implemented",
      dryRun: true,
      databaseConnected: false,
      applied: false,
      operationCount: 0,
    });
  });

  it("rejects the removed stage option and unknown commands", async () => {
    const stageOption = runCli([
      "tagging",
      "changes",
      "--stage",
      "staging",
      "--json",
      '{"schemaVersion":1,"operations":[]}',
    ]);
    const command = await captureProgramRun(
      await createCliRunOptions(["unknown"]),
    );

    expect(stageOption.exitCode).toBe(1);
    expect(stageOption.stderr).toContain("--stage");
    expect(command.exitCode).toBe(1);
    expect(command.stderr).toContain("Error:");
  });

  it("keeps unimplemented execution non-mutating and non-successful", () => {
    const result = runCli([
      "tagging",
      "changes",
      "--json",
      '{"schemaVersion":1,"operations":[]}',
    ]);

    expect(result.exitCode).toBe(2);
    expect(JSON.parse(result.stdout)).toMatchObject({
      dryRun: false,
      databaseConnected: false,
      applied: false,
    });
  });
});

function runCli(args: string[]) {
  const env = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => key !== "POSTGRES_URL"),
  );
  const result = Bun.spawnSync({
    cmd: [process.execPath, "run", "--silent", entryPoint, ...args],
    cwd: repositoryRoot,
    env,
    stdout: "pipe",
    stderr: "pipe",
  });

  return {
    exitCode: result.exitCode,
    stdout: result.stdout.toString(),
    stderr: result.stderr.toString(),
  };
}
