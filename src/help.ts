import { commands } from "./error";
import chalk from "chalk";

// eslint-disable-next-line no-unused-vars
import Preset from "./preset";

export const help_part = (value: string): string => {
    return chalk`{bold ${value}}`;
};

const space = "    - ";

export const help_flags = (description: string, ...flags: string[]): string => {
    return `${space}${flags.map(flag => `"${flag}"`).join(" or ")} => ${description}`;
};

export const help_lines = (preset: Preset): string[] => {
    return [
        help_part("available commands:"),
        commands().join("\n"),
        help_part(`template (${preset.name}): `),
        `${space}${preset.template}`,
        help_part("targets:"),
        Array.from(preset.targets)
            .map(([key, value]) => `${key}: ${value}`)
            .map((c) => `${space}${c}`)
            .join("\n"),
        help_part("actions:"),
        Array.from(preset.actions)
            .map(([key, value]) => `${key}: ${value}`)
            .map((c) => `${space}${c}`)
            .join("\n"),
        help_part("flags:"),
        help_flags("use particular source files/folders instead of . during the git add command (you can use this tag multiple times in one command to add more source files/folders)", "-S", "--source"),
        help_flags("show the helper", "-H", "--help"),
        help_flags("automatically push without confirmation", "-Y", "--yes"),
        help_part("more information:"),
        `${space}${"https://github.com/dylandoamaral/add-commit-push"}`
    ];
};
