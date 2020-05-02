import { commands } from "./command";
import { space_2 } from "./format";

export const error_validator_excess = (delimiter: string, template: string): string => {
    return [
        `${delimiter} exists inside the template ${template} but you didn't give enough arguments to accept these one. You can change the template according to these following structure :`,
        ...commands().map((c) => `${space_2}${c}`),
    ].join("\n");
};

export const error_validator_need = (delimiter: string, template: string): string => {
    return `impossible to find ${delimiter} inside the template ${template}`;
};

export const error_validator_norepo = (): string => {
    return "the command is running outside à git repository";
};

export const error_validator_uptodate = (): string => {
    return "nothing to push, the repository is up to data";
};

export const error_validator_pull = (): string => {
    return "the current repository is not up to data, you have to pull before use this command.";
};

export const error_validator_need_multiple = (delimiter: string, template: string): string => {
    return `${delimiter} should exist only once inside the template ${template}`;
};

export const error_validator_arguments = (): string => {
    return [
        "acp take between 1 and 3 arguments to work. The command should respect one of the following structure and depend of the preset's template:",
        ...commands().map((c) => `${space_2}${c}`),
    ].join("\n");
};

export const error_validator_map = (key: string, map: Map<string, string>, map_name: string): string => {
    return [
        `the key "${key}" don't exist inside ${map_name} map. Values found inside the preset:`,
        Array.from(map)
            .map(([key, value]) => `${key}: ${value}`)
            .map((c) => `${space_2}${c}`)
            .join("\n"),
    ].join("\n");
};

export const error_translator_undefined = (field: string): string => {
    return `can't find ${field} field inside the json`;
};

export const error_source_unexist = (field: string): string => {
    return `can't find the file "${field}"`;
};
