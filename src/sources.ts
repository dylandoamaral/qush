export const to_array_string = (value: undefined | string | string[]): string[] => {
    if(value === undefined) return [];
    else if(typeof value === "string") return [value];
    else return value;
};

export const get_sources = (...args: ( undefined | string | string[])[]): string[] => {
    return args.flatMap(arg => to_array_string(arg));
};