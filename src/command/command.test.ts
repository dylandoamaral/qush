import {
    toArrayString,
    getFlags,
    commands,
    routeCommands,
    buildError,
} from "./command";
import { minimistWrapper } from "../utils/utest";
import { helpCommand } from "./help/help";
import { space } from "../utils/format";

describe("the command functions", () => {
    it("should return three commands when we ask for command example", () => {
        expect(commands()).toHaveLength(3);
    });
});

describe("the router", () => {
    it("should route to help", () => {
        expect(routeCommands(minimistWrapper(["-H"])).name).toBe("help");
        expect(routeCommands(minimistWrapper(["--help"])).name).toBe("help");
        expect(
            routeCommands(minimistWrapper(["a", "p", "example", "--help"])).name
        ).toBe("help");
    });

    it("should route to acp", () => {
        expect(routeCommands(minimistWrapper(["example"])).name).toBe("acp");
        expect(routeCommands(minimistWrapper(["a", "example"])).name).toBe("acp");
        expect(routeCommands(minimistWrapper(["a", "p", "example"])).name).toBe(
            "acp"
        );
    });
});

describe("the error builder", () => {
    it("should return the correct format", () => {
        expect(buildError(["a"])).toEqual(`Errors:
${space}a`);
    });
    it("should return the correct format", () => {
        expect(buildError(["a", "b"])).toEqual(`Errors:
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
