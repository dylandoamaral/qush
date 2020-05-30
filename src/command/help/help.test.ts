import { helpLines } from "./help";

describe("the help_lines", () => {
    it("should return the correct format", () => {
        expect(helpLines()).toContain("https://github.com/dylandoamaral/qush");
        expect(helpLines()).toContain("-S");
        expect(helpLines()).toContain("-H");
        expect(helpLines()).toContain("-C");
        expect(helpLines()).toContain("-Y");
    });
});
