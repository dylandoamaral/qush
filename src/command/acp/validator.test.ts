import Preset from "../../preset";
import json from "../../preset.typed.json";
import { TypedJSON } from "typedjson";
import validate from "./validator";

import {
    error_validator_excess,
    error_validator_map,
    error_validator_need_multiple,
    error_validator_need,
    error_validator_arguments,
    error_source_unexist,
} from "../../utils/error";

// eslint-disable-next-line no-unused-vars
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
// eslint-disable-next-line no-unused-vars
import { Either, isRight, isLeft, fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
// eslint-disable-next-line no-unused-vars
import { Acp } from "./acp";
import minimist from "minimist";

describe("the validator", () => {
    const serializer = new TypedJSON(Preset);
    const preset = serializer.parse(json);

    const two_template = "<action>: <message>";
    const two_json = { ...json, template: two_template };
    const two_preset = serializer.parse(two_json);

    const one_template = "<message>";
    const one_json = { ...json, template: one_template };
    const one_preset = serializer.parse(one_json);

    const no_template = "no delimiters";
    const no_json = { ...json, template: no_template };
    const no_preset = serializer.parse(no_json);

    const twice_template = "[<target>]<action>: <message><message>";
    const twice_json = { ...json, template: twice_template };
    const twice_preset = serializer.parse(twice_json);

    const minimistWrapper = (args: string[]): minimist.ParsedArgs => minimist(args);
    const eitherFolded = (validation: Either<NonEmptyArray<string>, Acp>): string[] =>
        pipe(
            validation,
            fold(
                (errors) => errors,
                () => []
            )
        );

    it(`should succeed if there is 3 arguments with the template ${json.template}`, () => {
        expect(isRight(validate(minimistWrapper(["a", "p", "my commit"]), preset))).toBe(true);
    });

    it(`should succeed if there is 2 arguments with the template ${two_template}`, () => {
        expect(isRight(validate(minimistWrapper(["a", "my commit"]), two_preset))).toBe(true);
    });

    it(`should succeed if there is 1 argument with the template ${two_template}`, () => {
        expect(isRight(validate(minimistWrapper(["my commit"]), one_preset))).toBe(true);
    });

    it("should fail if there is more than 3 arguments", () => {
        const validation = validate(minimistWrapper(["a", "x", "my commit", "should not be here"]), preset);
        const result = eitherFolded(validation);

        expect(isLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(error_validator_arguments());
    });

    it("should fail if the target is missing", () => {
        const validation = validate(minimistWrapper(["a", "my commit"]), preset);
        const result = eitherFolded(validation);

        expect(isLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(error_validator_excess("<target>", preset.template));
    });

    it("should fail if the action and the target is missing", () => {
        const validation = validate(minimistWrapper(["my commit"]), preset);
        const result = eitherFolded(validation);

        expect(isLeft(validation)).toBe(true);
        expect(result.length).toBe(2);
        expect(result).toContain(error_validator_excess("<target>", preset.template));
        expect(result).toContain(error_validator_excess("<action>", preset.template));
    });

    it("should fail if the delimiter is not inside the templace", () => {
        const validation = validate(minimistWrapper(["my commit"]), no_preset);
        const result = eitherFolded(validation);

        expect(isLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(error_validator_need("<message>", no_preset.template));
    });

    it("should fail if the action is not inside actions map for 2 arguments", () => {
        const validation = validate(minimistWrapper(["x", "my commit"]), two_preset);
        const result = eitherFolded(validation);

        expect(isLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(error_validator_map("x", preset.actions, "actions"));
    });

    it("should fail if the action is not inside actions map for 3 arguments", () => {
        const validation = validate(minimistWrapper(["x", "p", "my commit"]), preset);
        const result = eitherFolded(validation);

        expect(isLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(error_validator_map("x", preset.actions, "actions"));
    });

    it("should fail if the target is not inside actions map for 3 arguments", () => {
        const validation = validate(minimistWrapper(["a", "x", "my commit"]), preset);
        const result = eitherFolded(validation);

        expect(isLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(error_validator_map("x", preset.targets, "targets"));
    });

    it("should fail if both the action and the target is not inside actions map for 3 arguments", () => {
        const validation = validate(minimistWrapper(["y", "x", "my commit"]), preset);
        const result = eitherFolded(validation);

        expect(isLeft(validation)).toBe(true);
        expect(result.length).toBe(2);
        expect(result).toContain(error_validator_map("y", preset.actions, "actions"));
        expect(result).toContain(error_validator_map("x", preset.targets, "targets"));
    });

    it("should fail if the preset has multiple times a delimiter", () => {
        const validation = validate(minimistWrapper(["y", "x", "my commit"]), preset);
        const result = eitherFolded(validation);

        expect(isLeft(validation)).toBe(true);
        expect(result.length).toBe(2);
        expect(result).toContain(error_validator_map("y", preset.actions, "actions"));
        expect(result).toContain(error_validator_map("x", preset.targets, "targets"));
    });

    it("should fail if the preset has multiple times a delimiter", () => {
        const validation = validate(minimistWrapper(["a", "p", "my commit"]), twice_preset);
        const result = eitherFolded(validation);

        expect(isLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(error_validator_need_multiple("<message>", twice_template));
    });

    it("should fail if the preset has multiple times a delimiter", () => {
        const validation = validate(minimistWrapper(["a", "p", "my commit"]), twice_preset);
        const result = eitherFolded(validation);

        expect(isLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(error_validator_need_multiple("<message>", twice_template));
    });

    it("should succeed with good sources", () => {
        const validation = validate(
            minimistWrapper(["a", "p", "my commit", "-S", "./README.md", "--source", "./acp.config.json"]),
            preset
        );

        expect(isRight(validation)).toBe(true);
    });

    it("should failed with wrong sources", () => {
        const validation = validate(
            minimistWrapper(["a", "p", "my commit", "-S", "./README.md", "--source", "./code.no"]),
            preset
        );
        const result = eitherFolded(validation);

        expect(isLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(error_source_unexist("./code.no"));
    });
});
