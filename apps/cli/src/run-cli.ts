import { message } from "@optique/core/message";
import { type RunProgramStaticOptions, runProgram } from "@optique/discover";

import projects from "./commands/projects";
import createProject from "./commands/projects/create";
import tagging from "./commands/tagging";
import changes from "./commands/tagging/changes";
import exportCatalog from "./commands/tagging/export-catalog";
import { formatError } from "./format-error";

export async function runCli(args = process.argv.slice(2)) {
  let command = "bestofjs";
  try {
    await runProgram({
      ...createCliRunOptions(args),
      hooks: {
        beforeEach(invocation) {
          command = invocation.path.join(" ") || "bestofjs";
        },
      },
    });
  } catch (error) {
    process.exitCode = 1;
    process.stderr.write(
      `${JSON.stringify({ status: "error", command, error: formatError(error) })}\n`,
    );
  }
}

export function createCliRunOptions(args: readonly string[]) {
  const commands = [projects, createProject, tagging, changes, exportCatalog];

  return {
    args: showHelpForBareGroup(args, commands),
    commands,
    metadata: {
      name: "bestofjs",
      version: "0.0.0",
      brief: message`Repository maintenance commands.`,
    },
    aboveError: "help",
    commandList: "top-level",
  } satisfies RunProgramStaticOptions;
}

export function showHelpForBareGroup(
  args: readonly string[],
  commands: readonly { path: readonly string[] }[],
) {
  if (args.length === 0) return ["--help"];
  if (args.some((arg) => arg.startsWith("-"))) return args;

  const isGroup = commands.some(
    ({ path }) =>
      path.length > args.length &&
      args.every((segment, index) => path[index] === segment),
  );

  return isGroup ? [...args, "--help"] : args;
}
