import minimist from "minimist";
import { Command } from "../command";
import { map, chain } from "fp-ts/lib/IOEither";
import { loadPreset } from "../../preset";
import { pipe } from "fp-ts/lib/pipeable";
import validate from "./validator";
import { IO, io, map as mapIO } from "fp-ts/lib/IO";
import { Acp } from "./acp";
import { execSync } from "child_process";
import { getFlags } from "../../utils/command";
import { add, commit, push } from "./builder";
import inquirer from "inquirer";

export const processAcp = (acp: Acp): IO<void> =>
  pipe(
    io.of(execSync("git branch --show-current").toString()),
    mapIO((branch) =>
      pipe(
        getFlags(acp.args, "S", "source"),
        (sources) =>
          sources.length === 0
            ? [add(".")]
            : sources.map((source) => add(source)),
        (adds) => [
          ...adds,
          commit(acp.args._ as string[], acp.preset),
          push(branch),
        ],
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

export const acpCommand = (args: minimist.ParsedArgs): Command => ({
  arguments: args,
  execute: () =>
    pipe(loadPreset(), chain(validate(args)), map(processAcp), map(func => func())),
});
