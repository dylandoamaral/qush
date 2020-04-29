import Preset from "./preset";
import json from "./preset.typed.json";
import { TypedJSON } from "typedjson";
import validate from "./validator";
import {
    error_validator_excess,
    error_validator_map,
    error_validator_need_multiple,
    error_validator_need_none,
    error_validator_arguments,
} from "./error";

describe("the validator", () => {
    const serializer = new TypedJSON(Preset);
    const preset = serializer.parse(json);

    const two_template = "<action>: <message>";
    const two_json = { ...json, template: two_template };
    const two_preset = serializer.parse(two_json);

    const one_template = "<message>";
    const one_json = { ...json, template: one_template };
    const one_preset = serializer.parse(one_json);

    it(`should succeed if there is 3 arguments with the template ${json.template}`, () => {
        expect(validate(["a", "p", "my commit"], preset));
    });

    it(`should succeed if there is 2 arguments with the template ${two_template}`, () => {
        expect(validate(["a", "my commit"], two_preset));
    });

    it(`should succeed if there is 1 argument with the template ${two_template}`, () => {
        expect(validate(["my commit"], one_preset));
    });

    it("should fail if there is more than 3 arguments", () => {
        expect(() => validate(["a", "x", "my commit", "should not be here"], preset)).toThrow(error_validator_arguments());
    });

    it("should fail if the target is missing", () => {
        expect(() => validate(["a", "my commit"], preset)).toThrow(error_validator_excess("<target>", preset.template));
    });

    it("should fail if the action and the target is missing", () => {
        expect(() => validate(["my commit"], preset)).toThrow(error_validator_excess("<action>", preset.template));
    });

    it("should fail if the delimiter is not inside the templace", () => {
        const empty_template = "no delimiter";
        const empty_json = { ...json, template: empty_template };
        expect(() => validate(["my commit"], serializer.parse(empty_json))).toThrow(
            error_validator_need_none("<message>", empty_template)
        );
    });

    it("should fail if the action is not inside actions map for 2 arguments", () => {
        expect(() => validate(["x", "my commit"], two_preset)).toThrow(error_validator_map("x", preset.actions, "actions"));
    });

    it("should fail if the action is not inside actions map for 3 arguments", () => {
        expect(() => validate(["x", "p", "my commit"], preset)).toThrow(error_validator_map("x", preset.actions, "actions"));
    });

    it("should fail if the target is not inside actions map for 3 arguments", () => {
        expect(() => validate(["a", "x", "my commit"], preset)).toThrow(error_validator_map("x", preset.targets, "targets"));
    });

    it("should fail if the preset has multiple times a delimiter", () => {
        const error_template = "[<target>]<action>: <message><message>";
        const error_json = { ...json, template: error_template };
        expect(() => validate(["a", "x", "my commit"], serializer.parse(error_json))).toThrow(
            error_validator_need_multiple("<message>", error_template)
        );
    });
});
