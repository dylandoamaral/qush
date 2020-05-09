import minimist from "minimist";
import { Command, getFlags } from "../command";
import { map, chain } from "fp-ts/lib/IOEither";
import Preset, { loadPreset } from "../../preset";
import { pipe } from "fp-ts/lib/pipeable";
import validate, { validateGit } from "./validator";
import { IO, io, map as mapIO } from "fp-ts/lib/IO";
import { execSync } from "child_process";
import { add, commit, push } from "./builder";
import inquirer from "inquirer";

export interface Acp {
  args: minimist.ParsedArgs;
  preset: Preset;
}

export const toAcp = ([args, preset]: [minimist.ParsedArgs, Preset]): Acp => ({
  args,
  preset,
});

export const processAcp = (acp: Acp): IO<void> =>
  pipe(
    io.of(execSync("git branch --show-current").toString()),
    mapIO((branch) =>
      pipe(
        getFlags(acp.args, "S", "source"),
        sourcesToAdds,
        addsToCommands(acp)(branch),
        (commands) => {
          inquirer
            .prompt([
              {
                type: "confirm",
                name: "value",
                message: [
                  "Acp is going to execute these following commands for you",
                  commands.map((c) => `    - ${c}`).join("\n"),
                  "Are you agree to run them ?",
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

export const sourcesToAdds = (sources: string[]): string[] => sources.length === 0
? [add(".")]
: sources.map((source) => add(source))

export const addsToCommands = (acp: Acp) => (branch: string) => (adds: string[]): string[] => [
  ...adds,
  commit(acp.args._ as string[], acp.preset),
  push(branch),
]

export const acpCommand = (args: minimist.ParsedArgs): Command => ({
  arguments: args,
  name: "acp",
  execute: () =>
    pipe(
      validateGit(),
      chain(loadPreset),
      chain(validate(args)),
      map(processAcp),
      map((func) => func())
    ),
});
