import minimist from "minimist";
import fs from "fs";
import figlet from "figlet";
import { Command } from "../command";
import { pipe } from "fp-ts/lib/pipeable";
import {
  right,
  IOEither,
  tryCatch,
  rightIO,
  map as mapIoEither,
} from "fp-ts/lib/IOEither";
import { IO, map } from "fp-ts/lib/IO";
import { merge } from "../../utils/functionnal";

export const aloneLines = (title: string): string[] => {
  return [
    "",
    title,
    "",
    "Qush is a command to add, commit and push in only one line of code, it also allows you to keep your commit log clean by providing presets to respect.",
    "For more informations: qush --help",
  ];
};

export const superAloneLines: IO<string[]> = pipe(
  tryCatch(
    pipe(() => fs.readFileSync(__dirname + "/logo.txt", "utf8"), map(aloneLines)),
    () =>
      aloneLines(
        figlet.textSync("QUSH", {
          font: "Graceful",
          horizontalLayout: "default",
          verticalLayout: "default",
        })
      )
  ),
  merge
);

export const aloneCommand = (args: minimist.ParsedArgs): Command => ({
  arguments: args,
  name: "alone",
  execute: () =>
    pipe(
      rightIO(superAloneLines),
      mapIoEither((lines) => lines.join("\n")),
      mapIoEither(console.log)
    ),
});
