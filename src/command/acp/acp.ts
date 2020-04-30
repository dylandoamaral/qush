// eslint-disable-next-line no-unused-vars
import Preset from "../../preset";
import { execSync } from "child_process";
import { add, commit, push } from "./builder";
import { get_flags } from "../../utils/command";
// eslint-disable-next-line no-unused-vars
import minimist from "minimist";
import inquirer from "inquirer";

export interface Acp {
    args: minimist.ParsedArgs;
    preset: Preset;
}

export const toAcp = ([args, preset]: [minimist.ParsedArgs, Preset]): Acp => ({
    args,
    preset,
});

export const execute = (acp: Acp) => {
    const branch = execSync("git branch --show-current").toString();
    const sources = get_flags(acp.args, "S", "source");

    const adds = sources.length === 0 ? [add(".")] : sources.map((source) => add(source));
    const commands = [...adds, commit(acp.args._ as string[], acp.preset), push(branch)];

    const yes = acp.args["Y"] === true || acp.args["yes"] === true;

    if (yes) {
        ["Acp execute these following commands for you", commands.map((c) => `    - ${c}`).join("\n")].forEach((command) =>
            console.log(command)
        );
        commands.forEach((command) => execSync(command));
    } else {
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
                if (answers.value) commands.forEach((command) => execSync(command));
                else console.log("commands canceled with sucess !");
            });
    }
};
