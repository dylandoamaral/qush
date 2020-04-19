import json from "./preset.typed.json";
import { add, commit, push } from "./builder";
import { TypedJSON } from "typedjson";
import Preset from "./preset";

describe("the add builder", () => {
    it("should return git add .", () => {
        expect(add()).toBe("git add .");
    });
});

describe("the commit builder", () => {
    const serializer = new TypedJSON(Preset);

    const preset = serializer.parse(json);

    const two_template = "<action>: <message>";
    const two_json = { ...json, template: two_template };
    const two_preset = serializer.parse(two_json);

    const one_template = "<message>";
    const one_json = { ...json, template: one_template };
    const one_preset = serializer.parse(one_json);

    const commit_msg = "my commit";

    it("should return the good commit message with 1 argument", () => {
        expect(commit([commit_msg], one_preset)).toBe(`git commit -m "${commit_msg}"`);
    });

    it("should return the good commit message with 2 arguments", () => {
        expect(commit(["a", commit_msg], two_preset)).toBe(`git commit -m "add: ${commit_msg}"`);
    });

    it("should return the good commit message with 3 arguments", () => {
        expect(commit(["a", "p", commit_msg], preset)).toBe(`git commit -m "[project] add: ${commit_msg}"`);
    });
});

describe("the push builder", () => {
    it("should return git push origin master", () => {
        expect(push()).toBe("git push origin master");
    });
});
