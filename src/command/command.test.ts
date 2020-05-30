import { toArrayString, getFlags, commands, routeCommands, buildError } from "./command";
import { space } from "../utils/format";
import minimist from "minimist";

describe("the command functions", () => {
    it("should return three commands when we ask for command example", () => {
        expect(commands()).toHaveLength(3);
    });
});

describe("the router", () => {
    it("should route to help", () => {
        expect(routeCommands(minimist(["-H"])).name).toBe("help");
        expect(routeCommands(minimist(["--help"])).name).toBe("help");
        expect(routeCommands(minimist(["a", "p", "example", "--help"])).name).toBe("help");
    });

    it("should route to qush", () => {
        expect(routeCommands(minimist(["example"])).name).toBe("qush");
        expect(routeCommands(minimist(["a", "example"])).name).toBe("qush");
        expect(routeCommands(minimist(["a", "p", "example"])).name).toBe("qush");
    });

    it("should route to alone", () => {
        expect(routeCommands(minimist([])).name).toBe("alone");
        expect(routeCommands(minimist(["-wtf"])).name).toBe("alone");
    });
});

describe("the error builder", () => {
    it("should return the correct format", () => {
        expect(buildError(["a"])).toEqual(`Error(s):
${space}a`);
    });
    it("should return the correct format", () => {
        expect(buildError(["a", "b"])).toEqual(`Error(s):
${space}a
${space}b`);
    });
});

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
        "-b": ["e", "f"],
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
