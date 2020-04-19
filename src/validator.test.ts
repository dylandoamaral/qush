import Preset from "./preset";
import json from "./preset.test.json";
import { TypedJSON } from "typedjson";
import validate from "./validator";
import { error_validator_excess, error_validator_map } from "./error";

describe("the validator", () => {
    const serializer = new TypedJSON(Preset);
    const preset = serializer.parse(json);

    it("should succeed if there is 3 arguments", () => {
        expect(validate(["a", "p", "my commit"], preset));
    });

    it("should fail if the target is missing", () => {
        expect(() => validate(["a", "my commit"], preset)).toThrow(error_validator_excess("<target>", preset.template));
    });

    it("should fail if the action and the target is missing", () => {
        expect(() => validate(["my commit"], preset)).toThrow(error_validator_excess("<action>", preset.template));
    });

    it("should fail if the action is not inside actions map", () => {
        expect(() => validate(["x", "p", "my commit"], preset)).toThrow(error_validator_map("x", preset.actions, "actions"));
    });

    it("should fail if the target is not inside actions map", () => {
        expect(() => validate(["a", "x", "my commit"], preset)).toThrow(error_validator_map("x", preset.targets, "targets"));
    });
});
