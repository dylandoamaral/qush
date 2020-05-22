// eslint-disable-next-line no-unused-vars
import minimist from "minimist";
// eslint-disable-next-line no-unused-vars
import { Command, commands } from "../command";
import { map, right } from "fp-ts/lib/IOEither";
import { space, stringifyFlags } from "../../utils/format";
import { pipe } from "fp-ts/lib/pipeable";
import { bold } from "chalk";

export const helpLines = (): string[] => {
    return [
        bold("available commands:"),
        commands()
            .map((c) => `${space}${c}`)
            .join("\n"),
        bold("flags:"),
        stringifyFlags(
            "use particular source files/folders instead of . during the git add command (you can use this tag multiple times in one command to add more source files/folders)",
            "-S",
            "--source"
        ),
        stringifyFlags("show the helper", "-H", "--help"),
        stringifyFlags("show the project's preset", "-P", "--preset"),
        stringifyFlags("automatically push without confirmation", "-Y", "--yes"),
        bold("more information:"),
        `${space}${"https://github.com/dylandoamaral/add-commit-push"}`,
    ];
};

export const helpCommand = (args: minimist.ParsedArgs): Command => ({
    arguments: args,
    name: "help",
    execute: () => pipe(helpLines(), (lines) => right(lines.join("\n")), map(console.log)),
});
