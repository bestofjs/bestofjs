import { resolve } from "node:path";

import { describe, expect, it } from "bun:test";

const repositoryRoot = resolve(import.meta.dir, "../../..");
const entryPoint = resolve(import.meta.dir, "cli.ts");
const runnerPath = resolve(import.meta.dir, "run-cli.ts");
const testDatabaseUrl = "postgresql://test:test@localhost:5432/test";

describe("CLI process", () => {
  it("shows help for the root, bare groups, and leaf commands", () => {
    for (const [args, expected] of [
      [[], "tagging"],
      [["tagging"], "changes"],
      [["tagging", "changes", "--help"], "--json"],
      [["tagging", "export-catalog", "--help"], "export-catalog"],
    ] as const) {
      const result = runCli([...args]);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain(expected);
      expect(result.stderr).toBe("");
      expect(result.stdout).not.toContain("--dryRun");
    }
  });

  it("rejects removed options, unknown commands, and malformed JSON", () => {
    for (const [args, expected] of [
      [
        ["tagging", "changes", "--stage", "staging", "--json", '{"ops":[]}'],
        "--stage",
      ],
      [["unknown"], "Error:"],
      [["tagging", "changes", "--json", "{bad}"], "Invalid"],
    ] as const) {
      const result = runCli([...args]);
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain(expected);
    }
  });

  it("reports execution failures once as JSON", () => {
    const result = spawnCli([
      "--eval",
      `
      import { createCliRunOptions, runCli } from ${JSON.stringify(runnerPath)};
      const command = createCliRunOptions([]).commands.find(
        ({ path }) => path.join(" ") === "tagging changes"
      );
      command.handler = async () => {
        throw new Error("Operation failed", { cause: new Error("Driver failure") });
      };
      await runCli(["tagging", "changes", "--json", '{"ops":[]}']);
    `,
    ]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr.trim().split("\n")).toHaveLength(1);
    expect(JSON.parse(result.stderr)).toEqual({
      status: "error",
      command: "tagging changes",
      error: "Operation failed [cause: Driver failure]",
    });
  });

  it("applies an empty plan successfully", () => {
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
  return spawnCli(["run", "--silent", entryPoint, ...args], databaseUrl);
}

function spawnCli(args: string[], databaseUrl = testDatabaseUrl) {
  const result = Bun.spawnSync({
    cmd: [process.execPath, "--no-env-file", ...args],
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
