import {  helpCommand, helpLines } from "./help";
import { bold } from "chalk";
import json from "../../asset/preset.typed.json";
import Preset from "../../preset";
import { TypedJSON } from "typedjson";
import { minimistWrapper } from "../../utils/utest";
import { isIORight } from "../../utils/functionnal";

describe("the command", () => {
    expect(isIORight(helpCommand(minimistWrapper(["-H"])).execute())).toEqual(true);
});

describe("the help_lines", () => {
    const serializer = new TypedJSON(Preset);
    const object = serializer.parse(json);

    it("should return the correct format", () => {
        const lines = helpLines(object);
        expect(lines.length).toEqual(16);
        expect(lines[0]).toEqual(bold("available commands:"));
    });
});
