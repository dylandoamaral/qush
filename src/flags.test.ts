import { to_array_string, get_flags } from "./flags";

describe("the to_array_string", () => {
    it("should return the correct format", () => {
        expect(to_array_string(undefined)).toEqual([]);
        expect(to_array_string("a")).toEqual(["a"]);
        expect(to_array_string(["b", "c"])).toEqual(["b", "c"]);
    });
});

describe("the get_flags", () => {
    const args = {
        "-a": "d",
        "-b": ["e", "f"]
    };
    
    it("should return the correct format", () => {
        expect(get_flags(args)).toEqual([]);
        expect(get_flags(args, "-a")).toEqual(["d"]);
        expect(get_flags(args, "-b")).toEqual(["e", "f"]);
        expect(get_flags(args, "-c")).toEqual([]);
        expect(get_flags(args, "-a", "-b")).toEqual(["d", "e", "f"]);
        expect(get_flags(args, "-a", "-c")).toEqual(["d"]);
        expect(get_flags(args, "-b", "-c")).toEqual(["e", "f"]);
    });
});