import Preset, { loadPreset } from "../../preset";
import minimist from "minimist";
import { Command } from "../command";
import { pipe } from "fp-ts/lib/pipeable";
import { map, chain, rightIO } from "fp-ts/lib/IOEither";
import { stringifyField, space } from "../../utils/format";
import { bold } from "chalk";
import { gitIsInstalled, folderIsGitRepo } from "../qush/validator";
import { findGitRoot } from "../../utils/git";

export const presetLines = (preset: Preset): string[] => {
    return [
        "",
        `This repository use the preset "${
            preset.name
        }" made by ${preset.contributors.join(", ")}: `,
        bold("template: "),
        `${space}${preset.template}`,
        bold("targets:"),
        Array.from(preset.targets).map(stringifyField).join("\n"),
        bold("actions:"),
        Array.from(preset.actions).map(stringifyField).join("\n"),
    ];
};

export const presetCommand = (args: minimist.ParsedArgs): Command => ({
    arguments: args,
    name: "preset",
    execute: () =>
        pipe(
            rightIO(findGitRoot),
            chain(root => loadPreset(root)),
            map(presetLines),
            map((lines) => lines.join("\n")),
            map(console.log)
        ),
});
