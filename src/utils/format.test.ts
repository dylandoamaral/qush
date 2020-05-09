import { stringifyFlags } from "./format";

describe("the stringifyFlags", () => {
    it("should return the correct format", () => {
        expect(stringifyFlags("d", "a", "b")).toEqual("    - \"a\" or \"b\" => d");
    });
});
