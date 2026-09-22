import { message } from "@optique/core/message";
import {
  type DiscoveredCommand,
  discoverCommands,
  type RunProgramStaticOptions,
  runProgram,
} from "@optique/discover";

export async function runCli(args = process.argv.slice(2)) {
  await runProgram(await createCliRunOptions(args));
}

export async function createCliRunOptions(args: readonly string[]) {
  const commands = await discoverCommands({
    dir: new URL("./commands/", import.meta.url),
    extensions: [".ts"],
  });

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
  commands: readonly Pick<DiscoveredCommand, "path">[],
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
