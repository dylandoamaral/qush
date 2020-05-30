export const space = "    - ";

export const space_2 = "        • ";

export const stringifyFlags = (
    description: string,
    ...flags: string[]
): string => {
    return `${space}${flags
        .map((flag) => `"${flag}"`)
        .join(" or ")} => ${description}`;
};