import { helpPart, helpFlags, helpLines, helpCommand } from "./help";
import chalk from "chalk";

import Preset from "../../preset";
import json from "../../asset/preset.typed.json";
import { TypedJSON } from "typedjson";
import minimist from "minimist";
import { minimistWrapper } from "../../utils/utest";
import { constVoid } from "fp-ts/lib/function";
import { isIORight } from "../../utils/functionnal";

describe("the help_part", () => {
    it("should return the correct format", () => {
        expect(helpPart("a")).toEqual(chalk.bold("a"));
    });
});

describe("the help_flags", () => {
    it("should return the correct format", () => {
        expect(helpFlags("d", "a", "b")).toEqual("    - \"a\" or \"b\" => d");
    });
});

describe("the help_lines", () => {
    const serializer = new TypedJSON(Preset);
    const object = serializer.parse(json);

    it("should return the correct format", () => {
        const lines = helpLines(object);
        expect(lines.length).toEqual(16);
        expect(lines[0]).toEqual(helpPart("available commands:"));
    });
});

describe("the command", () => {
    expect(isIORight(helpCommand(minimistWrapper(["-H"])).execute())).toEqual(true);
});

