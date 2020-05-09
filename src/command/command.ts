import minimist from "minimist";
import { IO } from "fp-ts/lib/IO";
import { IOEither } from "fp-ts/lib/IOEither";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { helpCommand } from "./help/help";
import { qushCommand } from "./qush/qush";
import { space } from "../utils/format";
import { aloneCommand } from "./alone/alone";
import { presetCommand } from "./preset/preset";

export interface Command {
  arguments: minimist.ParsedArgs;
  name: string;
  execute(args?: minimist.ParsedArgs): IOEither<NonEmptyArray<string>, void>;
}

export const commands = (): string[] => {
    return ["qush <message>", "qush <action> <message>", "qush <action> <target> <message>"];
};

export const toArrayString = (value: undefined | string | string[]): string[] => {
    if (value === undefined) return [];
    else if (typeof value === "string") return [value];
    else return value;
};

export const getFlags = (args: any, ...flags: string[]): string[] => {
    return flags.map((flag) => args[flag]).flatMap((arg) => toArrayString(arg));
};


export const loadArguments: IO<minimist.ParsedArgs> = () =>
    minimist(process.argv.slice(2));

export const routeCommands = (args: minimist.ParsedArgs): Command => {
    if (args["H"] != undefined || args["help"] != undefined ) return helpCommand(args);
    else if (args["P"] != undefined || args["preset"] != undefined ) return presetCommand(args);
    else if (args["_"].length == 0) return aloneCommand(args);
    else return qushCommand(args);
};

export const executeCommand = (
    command: Command
): IOEither<NonEmptyArray<string>, void> => command.execute(command.arguments);

export const showError = (errors: NonEmptyArray<string>): IO<void> => () =>
    console.error(buildError(errors));

export const buildError = (errors: NonEmptyArray<string>): string => {
    return `Error(s):
${errors.map((error) => `${space}${error}`).join("\n")}`;
};