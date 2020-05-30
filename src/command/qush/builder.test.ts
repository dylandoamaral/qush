import json from "../../asset/default.config.json";
import { add, commit, push } from "./builder";
import { plainToConfig } from "../../config";

describe("the add builder", () => {
    it("should return git add .", () => {
        expect(add(".")).toBe("git add .");
        expect(add("package.json")).toBe("git add package.json");
        expect(add("src")).toBe("git add src");
    });
});

describe("the commit builder", () => {
    const config = plainToConfig(JSON.stringify(json));
    const commitMsg = "my commit";

    it("should return the good commit message", () => {
        expect(commit(["a", "p", commitMsg], config)).toBe(`git commit -m "[project] add: ${commitMsg}"`);
        expect(commit(["r", "d", commitMsg], config)).toBe(`git commit -m "[documentation] refactor: ${commitMsg}"`);
        expect(commit(["d", "t", commitMsg], config)).toBe(`git commit -m "[test] delete: ${commitMsg}"`);
    });
});

describe("the push builder", () => {
    it("should return git push origin master", () => {
        expect(push("master")).toBe("git push origin master");
    });
});
