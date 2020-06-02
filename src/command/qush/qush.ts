// eslint-disable-next-line no-unused-vars
import minimist from "minimist";
// eslint-disable-next-line no-unused-vars
import { Command, getFlags } from "../command";
// eslint-disable-next-line no-unused-vars
import { io, map as mapIO, IO } from "fp-ts/lib/IO";
import { chain, rightIO } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { validateRepository, validateCommand } from "./validator";
import { execSync } from "child_process";
import { add, commit, push } from "./builder";
import inquirer from "inquirer";
import { findGitRoot, gitIsInstalled } from "../../utils/git";
// eslint-disable-next-line no-unused-vars
import { Config, readConfig } from "../../config";
import { sequenceT } from "fp-ts/lib/Apply";
import { ioApplicativeValidation } from "../../utils/functionnal";

export interface Qush {
    args: minimist.ParsedArgs;
    config: Config;
}

export const toQush = ([args, config]: [minimist.ParsedArgs, Config]): Qush => ({
    args,
    config,
});

export const processQush = (qush: Qush): IO<void> =>
    pipe(
        io.of(execSync("git branch --show-current").toString()),
        mapIO((branch) =>
            pipe(getFlags(qush.args, "S", "source"), sourcesToAdds, addsToCommands(qush)(branch), (commands) => {
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
                        if (answers.value) commands.forEach((command) => execSync(command));
                        else console.log("commands canceled with sucess !");
                    });
            })
        )
    );

export const sourcesToAdds = (sources: string[]): string[] =>
    sources.length === 0 ? [add(".")] : sources.map((source) => add(source));

export const addsToCommands = (qush: Qush) => (branch: string) => (adds: string[]): string[] => [
    ...adds,
    commit(qush.args._ as string[], qush.config),
    push(branch),
];

export const qushCommand = (args: minimist.ParsedArgs): Command => ({
    arguments: args,
    name: "qush",
    execute: () =>
        pipe(
            gitIsInstalled,
            chain(() => findGitRoot),
            chain((path) => sequenceT(ioApplicativeValidation)(readConfig(path), validateRepository)),
            chain(([config]) => validateCommand(args)(config)),
            chain((qush) => rightIO(processQush(qush)))
        ),
});
