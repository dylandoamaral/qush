import {  helpCommand, helpLines } from "./help";
import { bold } from "chalk";
import { minimistWrapper } from "../../utils/utest";
import { isIORight } from "../../utils/functionnal";

describe("the help_lines", () => {
    it("should return the correct format", () => {
        const lines = helpLines();
        expect(lines[1]).toEqual(bold("available commands:"));
    });
});
