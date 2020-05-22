import { bold } from "chalk";
import { helpLines } from "./help";

describe("the help_lines", () => {
    it("should return the correct format", () => {
        const lines = helpLines();
        expect(lines[1]).toEqual(bold("available commands:"));
    });
});
