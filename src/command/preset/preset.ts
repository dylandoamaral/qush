import Preset, { loadPreset } from '../../preset';
import minimist from 'minimist';
import { Command, commands } from '../command';
import { pipe } from 'fp-ts/lib/pipeable';
import { map } from 'fp-ts/lib/IOEither';
import { stringifyField, stringifyFlags, space } from '../../utils/format';
import { bold } from 'chalk';

export const presetLines = (preset: Preset): string[] => {
    return [
        "",
        `This repository use the preset ${
            preset.name
        } made by ${preset.contributors.join(", ")}: `,
        bold("template: "),
        `${space}${preset.template}`,
        bold("targets:"),
        Array.from(preset.targets).map(stringifyField).join("\n"),
        bold("actions:"),
        Array.from(preset.actions).map(stringifyField).join("\n"),
        bold("more information:"),
        `${space}${"https://github.com/dylandoamaral/add-commit-push"}`,
    ];
};

export const presetCommand = (args: minimist.ParsedArgs): Command => ({
    arguments: args,
    name: "help",
    execute: () =>
        pipe(
            loadPreset(process.cwd()),
            map(presetLines),
            map((lines) => lines.join("\n")),
            map(console.log)
        ),
});
