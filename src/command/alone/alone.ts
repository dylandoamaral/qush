import minimist from "minimist";
import figlet from "figlet";
import { Command } from "../command";
import { pipe } from "fp-ts/lib/pipeable";
import { right, map } from "fp-ts/lib/IOEither";

export const aloneLines = (): string[] => {
  return [
    "",
    figlet.textSync("ACP", {
      font: "Graceful",
      horizontalLayout: "default",
      verticalLayout: "default",
    }),
    "",
    "ACP is a command to add, commit and push in only one line of code, it also allows you to keep your commit log clean by providing presets to respect.",
    "For more informations: acp --help"
  ];
};

export const aloneCommand = (args: minimist.ParsedArgs): Command => ({
  arguments: args,
  name: "alone",
  execute: () =>
    pipe(aloneLines(), (lines) => right(lines.join("\n")), map(console.log)),
});
