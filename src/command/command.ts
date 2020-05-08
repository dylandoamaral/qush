import minimist from "minimist";
import { IO } from "fp-ts/lib/IO";
import { IOEither } from "fp-ts/lib/IOEither";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { helpCommand } from "./help/command";
import { acpCommand } from './acp/command';

export interface Command {
  arguments: minimist.ParsedArgs;
  execute(args?: minimist.ParsedArgs): IOEither<NonEmptyArray<string>, void>;
}

export const loadArguments: IO<minimist.ParsedArgs> = () =>
  minimist(process.argv.slice(2));

export const routeCommands = (args: minimist.ParsedArgs): Command => {
  if (args["H"] != undefined) return helpCommand(args);
  else if (args["_"].length == 0) return helpCommand(args);
  else return acpCommand(args);
};

export const executeCommand = (
  command: Command
): IOEither<NonEmptyArray<string>, void> => command.execute(command.arguments);

export const showError = (errors: NonEmptyArray<string>): IO<void> => () =>
  console.error(buildError(errors));

export const buildError = (errors: NonEmptyArray<string>): string => {
  return `Errors:
${errors.map((error) => ` - ${error}`).join("\n")}`;
};
