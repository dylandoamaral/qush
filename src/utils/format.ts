import { Field } from "../preset";
import chalk from "chalk";
import { cpus } from "os";

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

export const stringifyField = ([key, field]: [string, Field]): string => {
  const keySpacing = `${key}: `.length;
  const lines =
    field.description === undefined
      ? [`${space}${key}: ${field.value}`]
      : [
          `${space}${key}: ${field.value}`,
          `${space.replace("-", " ")}${" ".repeat(keySpacing)}${
            field.description
          }`,
        ];
  return lines.join("\n");
};
