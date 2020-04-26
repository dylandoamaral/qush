const error_commands = (): string[] => {
    return ["acp <message>", "acp <action> <message>", "acp <action> <target> <message>"].map((c) => `    - ${c}`);
};

export const error_validator_excess = (delimiter: string, template: string): string => {
    return [
        `Error: ${delimiter} exists inside the template ${template} but you didn't give enough arguments to accept these one`,
        "You can change the template according to these following structure :",
        ...error_commands(),
    ].join("\n");
};

export const error_validator_need_none = (delimiter: string, template: string): string => {
    return `Error: impossible to find ${delimiter} inside the template ${template}`;
};

export const error_validator_need_multiple = (delimiter: string, template: string): string => {
    return `Error: ${delimiter} should exist only once inside the template ${template}`;
};

export const error_validator_arguments = (): string => {
    return [
        "Error: acp take between 1 and 3 arguments to work. The command should respect one of the following structure:",
        ...error_commands(),
    ].join("\n");
};

export const error_validator_map = (key: string, map: Map<string, string>, map_name: string): string => {
    return [
        `Error: the key ${key} don't exist inside ${map_name} map. Values found inside the map:`,
        Array.from(map).map(([key, value]) => `${key}: ${value}`).map((c) => `    - ${c}`).join("\n"),
    ].join("\n");
};

export const error_translator_undefined = (field: string): string => {
    return `Error: can't find ${field} field inside the json`;
};

export const error_builder_add_nopath = (field: string): string => {
    return `Error: can't find the file "${field}"`;
};