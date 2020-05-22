import minimist from "minimist";
import { Command, commands } from "../command";
import { map, right } from "fp-ts/lib/IOEither";
import chalk, { bold } from "chalk";
import { space, stringifyField, stringifyFlags } from "../../utils/format";
import Preset, { loadPreset, Field } from "../../preset";
import { pipe } from "fp-ts/lib/pipeable";

export const helpLines = (): string[] => {
    return [
        "",
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
    execute: () =>
        pipe(helpLines(), (lines) => right(lines.join("\n")), map(console.log)),
});
