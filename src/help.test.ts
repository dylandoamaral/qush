import { help_part, help_flags, help_lines } from "./help";
import chalk from "chalk";

import Preset from "./preset";
import json from "./preset.typed.json";
import { TypedJSON } from "typedjson";

describe("the help_part", () => {
    it("should return the correct format", () => {
        expect(help_part("a")).toEqual(chalk.bold("a"));
    });
});

describe("the help_flags", () => {
    it("should return the correct format", () => {
        expect(help_flags("d", "a", "b")).toEqual("    - \"a\" or \"b\" => d");
    });
});

describe("the help_lines", () => {
    const serializer = new TypedJSON(Preset);
    const object = serializer.parse(json);

    it("should return the correct format", () => {
        const lines = help_lines(object);
        expect(lines.length).toEqual(13);
        expect(lines[0]).toEqual(help_part("available commands:"));
    });
});

