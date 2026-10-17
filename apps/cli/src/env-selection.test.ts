import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "bun:test";

const { scripts } = JSON.parse(
  readFileSync(new URL("../../../package.json", import.meta.url), "utf8"),
) as { scripts: { cli: string } };
const directories: string[] = [];

afterEach(() => {
  for (const directory of directories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

function createFixture() {
  const directory = mkdtempSync(join(tmpdir(), "bestofjs-cli-env-"));
  directories.push(directory);
  mkdirSync(join(directory, "apps/cli/src"), { recursive: true });
  writeFileSync(join(directory, ".env"), "POSTGRES_URL=local-default\n");
  writeFileSync(
    join(directory, ".env.development"),
    "POSTGRES_URL=local-development\n",
  );
  writeFileSync(
    join(directory, ".env.production"),
    "POSTGRES_URL=production-fixture\n",
  );
  writeFileSync(
    join(directory, "apps/cli/src/cli.ts"),
    `
    if (!process.env.POSTGRES_URL) {
      console.error("POSTGRES_URL is not set");
      process.exitCode = 1;
    } else {
      console.log(process.env.POSTGRES_URL);
    }
  `,
  );
  return directory;
}

function runLauncher(directory: string, stage?: string, databaseUrl?: string) {
  const env = { ...process.env };
  delete env.POSTGRES_URL;
  delete env.STAGE;
  delete env.NODE_ENV;
  if (stage !== undefined) env.STAGE = stage;
  if (databaseUrl !== undefined) env.POSTGRES_URL = databaseUrl;
  return Bun.spawnSync({
    cmd: ["sh", "-c", scripts.cli],
    cwd: directory,
    env,
    stdout: "pipe",
    stderr: "pipe",
  });
}

describe("CLI launcher environment selection", () => {
  it("defaults to development and selects production with STAGE", () => {
    const directory = createFixture();
    const development = runLauncher(directory);
    const production = runLauncher(directory, "production");
    expect(development.exitCode).toBe(0);
    expect(development.stdout.toString().trim()).toBe("local-development");
    expect(production.exitCode).toBe(0);
    expect(production.stdout.toString().trim()).toBe("production-fixture");
  });

  it("does not fill missing production configuration from local files", () => {
    const directory = createFixture();
    writeFileSync(
      join(directory, ".env.production"),
      "OTHER_SETTING=fixture\n",
    );
    const result = runLauncher(directory, "production");
    expect(result.exitCode).toBe(1);
    expect(result.stdout.toString()).toBe("");
    expect(result.stderr.toString()).toContain("POSTGRES_URL is not set");
  });

  it("does not fall back when the selected file is missing", () => {
    const result = runLauncher(createFixture(), "missing");
    expect(result.exitCode).toBe(1);
    expect(result.stderr.toString()).toContain("POSTGRES_URL is not set");
  });

  it("preserves explicit inherited environment overrides", () => {
    const result = runLauncher(
      createFixture(),
      "production",
      "explicit-fixture",
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString().trim()).toBe("explicit-fixture");
  });
});
