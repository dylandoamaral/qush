import minimist from "minimist";
import { Command, commands } from "../command";
import { map } from "fp-ts/lib/IOEither";
import chalk from "chalk";
import { space } from "../../utils/format";
import Preset, { loadPreset, Field } from "../../preset";
import { pipe } from "fp-ts/lib/pipeable";

export const helpFlags = (description: string, ...flags: string[]): string => {
  return `${space}${flags
    .map((flag) => `"${flag}"`)
    .join(" or ")} => ${description}`;
};

export const helpPart = (value: string): string => {
  return chalk`{bold ${value}}`;
};

export const helpField = ([key, field]: [string, Field]): string => {
    const keySpacing = `${key}: `.length
    return [
        `${space}${key}: ${field.value}`,
        `${space.replace("-", " ")}${" ".repeat(keySpacing)}${field.description}`
    ].join("\n")
}

export const helpLines = (preset: Preset): string[] => {
  return [
    helpPart("available commands:"),
    commands()
      .map((c) => `${space}${c}`)
      .join("\n"),
    helpPart("flags:"),
    helpFlags(
      "use particular source files/folders instead of . during the git add command (you can use this tag multiple times in one command to add more source files/folders)",
      "-S",
      "--source"
    ),
    helpFlags("show the helper", "-H", "--help"),
    helpFlags("automatically push without confirmation", "-Y", "--yes"),
    "",
    `This repository use the preset ${preset.name} made by ${preset.contributors.join(", ")}: `,
    helpPart(`template: `),
    `${space}${preset.template}`,
    helpPart("targets:"),
    Array.from(preset.targets)
      .map(helpField)
      .join("\n"),
    helpPart("actions:"),
    Array.from(preset.actions)
      .map(helpField)
      .join("\n"),
    helpPart("more information:"),
    `${space}${"https://github.com/dylandoamaral/add-commit-push"}`,
  ];
};

export const helpCommand = (args: minimist.ParsedArgs): Command => ({
  arguments: args,
  name: "help",
  execute: () =>
    pipe(
      loadPreset(process.cwd()),
      map(helpLines),
      map((lines) => lines.join("\n")),
      map(console.log)
    ),
});
