import { to_array_string, get_sources } from "./sources";

describe("the to_array_string", () => {
    it("should return the correct format", () => {
        expect(to_array_string(undefined)).toEqual([]);
        expect(to_array_string("a")).toEqual(["a"]);
        expect(to_array_string(["b", "c"])).toEqual(["b", "c"]);
    });
});

describe("the get_sources", () => {
    it("should return the correct format", () => {
        expect(get_sources(undefined)).toEqual([]);
        expect(get_sources("a")).toEqual(["a"]);
        expect(get_sources(["b", "c"])).toEqual(["b", "c"]);
        expect(get_sources(["b", "c"], undefined)).toEqual(["b", "c"]);
        expect(get_sources("a", ["b", "c"])).toEqual(["a", "b", "c"]);
        expect(get_sources(undefined, "a")).toEqual(["a"]);
    });
});