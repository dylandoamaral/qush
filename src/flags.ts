export const to_array_string = (value: undefined | string | string[]): string[] => {
    if(value === undefined) return [];
    else if(typeof value === "string") return [value];
    else return value;
};

export const get_flags = (args: any, ...flags: string[]): string[] => {
    return flags.map(flag => args[flag]).flatMap(arg => to_array_string(arg));
};