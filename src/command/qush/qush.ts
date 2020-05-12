import minimist from "minimist";
import { Command, getFlags } from "../command";
import { map, chain, rightIO, IOEither } from "fp-ts/lib/IOEither";
import Preset, { loadPreset } from "../../preset";
import { pipe } from "fp-ts/lib/pipeable";
import validate, { gitIsInstalled } from "./validator";
import { IO, io, map as mapIO } from "fp-ts/lib/IO";
import { execSync } from "child_process";
import { add, commit, push } from "./builder";
import inquirer from "inquirer";
import { findGitRoot } from "../../utils/git";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";

export interface Qush {
  args: minimist.ParsedArgs;
  preset: Preset;
}

export const toQush = ([args, preset]: [
  minimist.ParsedArgs,
  Preset
]): Qush => ({
  args,
  preset,
});

export const processQush = (qush: Qush): IO<void> =>
  pipe(
    io.of(execSync("git branch --show-current").toString()),
    mapIO((branch) =>
      pipe(
        getFlags(qush.args, "S", "source"),
        sourcesToAdds,
        addsToCommands(qush)(branch),
        (commands) => {
          inquirer
            .prompt([
              {
                type: "confirm",
                name: "value",
                message: [
                  "qush is going to execute these following commands for you",
                  commands.map((c) => `    - ${c}`).join("\n"),
                  "Do you agree to run them ?",
                ].join("\n"),
                default: function () {
                  return false;
                },
              },
            ])
            .then((answers) => {
              if (answers.value)
                commands.forEach((command) => execSync(command));
              else console.log("commands canceled with sucess !");
            });
        }
      )
    )
  );

export const sourcesToAdds = (sources: string[]): string[] =>
  sources.length === 0 ? [add(".")] : sources.map((source) => add(source));

export const addsToCommands = (qush: Qush) => (branch: string) => (
  adds: string[]
): string[] => [
  ...adds,
  commit(qush.args._ as string[], qush.preset),
  push(branch),
];

export const qushCommand = (args: minimist.ParsedArgs): Command => ({
  arguments: args,
  name: "qush",
  execute: () =>
    pipe(
      gitIsInstalled,
      chain(() => rightIO(findGitRoot)),
      chain(loadPreset),
      chain(validate(args)),
      chain((qush) => rightIO(processQush(qush)))
    ),
});
