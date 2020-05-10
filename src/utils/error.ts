import { space_2 } from "./format";
import { commands } from "../command/command";
import { Field } from "../preset";

export const errorTemplateExcess = (delimiter: string, template: string): string => {
    return [
        `${delimiter} exists inside the template ${template} but you didn't give enough arguments to accept these one. You can change the template according to these following structure :`,
        ...commands().map((c) => `${space_2}${c}`),
    ].join("\n");
};

export const errorTemplateNeed = (delimiter: string, template: string): string => {
    return `impossible to find ${delimiter} inside the template ${template}`;
};

export const errorGitIsInstalled = (): string => {
    return "the command git doesn't exist in this session";
};

export const errorFolderIsGitRepo = (): string => {
    return "the command is running outside à git repository";
};

export const errorFolderIsNotUpToDate = (): string => {
    return "nothing to push, the repository is up to data";
};

export const errorFolderDontNeedPull = (): string => {
    return "the current repository is not up to data, you have to pull before use this command.";
};

export const errorTemplateMultiple = (delimiter: string, template: string): string => {
    return `${delimiter} should exist only once inside the template ${template}`;
};

export const errorNumberArguments = (): string => {
    return [
        "qush takes between 1 and 3 arguments to work. The command should respect one of the following structure and depend of the preset's template:",
        ...commands().map((c) => `${space_2}${c}`),
    ].join("\n");
};

export const errorNotKeyInMap = (key: string, map: Map<string, Field>, map_name: string): string => {
    return [
        `the key "${key}" doesn't exist inside ${map_name} map. Values found inside the preset as ${map_name}:`,
        Array.from(map)
            .map(([key, field]) => `${key}: ${field.value}`)
            .map((c) => `${space_2}${c}`)
            .join("\n"),
    ].join("\n");
};

export const errorUndefinedField = (field: string): string => {
    return `can't find ${field} field inside the json`;
};

export const errorNoFile = (field: string): string => {
    return `can't find the file "${field}"`;
};
