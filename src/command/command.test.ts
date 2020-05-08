import { toArrayString, getFlags } from "./command";

describe("the toArrayString", () => {
    it("should return the correct format", () => {
        expect(toArrayString(undefined)).toEqual([]);
        expect(toArrayString("a")).toEqual(["a"]);
        expect(toArrayString(["b", "c"])).toEqual(["b", "c"]);
    });
});

describe("the getFlags", () => {
    const args = {
        "-a": "d",
        "-b": ["e", "f"]
    };
    
    it("should return the correct format", () => {
        expect(getFlags(args)).toEqual([]);
        expect(getFlags(args, "-a")).toEqual(["d"]);
        expect(getFlags(args, "-b")).toEqual(["e", "f"]);
        expect(getFlags(args, "-c")).toEqual([]);
        expect(getFlags(args, "-a", "-b")).toEqual(["d", "e", "f"]);
        expect(getFlags(args, "-a", "-c")).toEqual(["d"]);
        expect(getFlags(args, "-b", "-c")).toEqual(["e", "f"]);
    });
});