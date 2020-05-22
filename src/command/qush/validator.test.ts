import Preset from "../../preset";
import json from "../../asset/preset.typed.json";
import { TypedJSON } from "typedjson";
import validate from "./validator";

import {
    errorTemplateExcess,
    errorNotKeyInMap,
    errorTemplateMultiple,
    errorTemplateNeed,
    errorNumberArguments,
    errorNoFile,
} from "../../utils/error";

// eslint-disable-next-line no-unused-vars
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
// eslint-disable-next-line no-unused-vars
import { fold } from "fp-ts/lib/Either";
// eslint-disable-next-line no-unused-vars
import { Qush } from "./qush";
// eslint-disable-next-line no-unused-vars
import { IOEither } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { isIORight, isIOLeft } from "../../utils/functionnal";
import { minimistWrapper } from "../../utils/utest";

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

const eitherFolded = (validation: IOEither<NonEmptyArray<string>, Qush>): string[] =>
    pipe(
        validation(),
        fold(
            (errors) => errors,
            () => []
        )
    );

describe("the validation process for preset", () => {
    it("should fail if the preset has multiple times a delimiter", () => {
        const validation = validate(minimistWrapper(["y", "x", "my commit"]))(preset);
        const result = eitherFolded(validation);

        expect(isIOLeft(validation)).toBe(true);
        expect(result.length).toBe(2);
        expect(result).toContain(errorNotKeyInMap("y", preset.actions, "actions"));
        expect(result).toContain(errorNotKeyInMap("x", preset.targets, "targets"));
    });

    it("should fail if the preset has multiple times a delimiter", () => {
        const validation = validate(minimistWrapper(["a", "p", "my commit"]))(twice_preset);
        const result = eitherFolded(validation);

        expect(isIOLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(errorTemplateMultiple("<message>", twice_template));
    });

    it("should fail if the preset has multiple times a delimiter", () => {
        const validation = validate(minimistWrapper(["a", "p", "my commit"]))(twice_preset);
        const result = eitherFolded(validation);

        expect(isIOLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(errorTemplateMultiple("<message>", twice_template));
    });
});
describe("the validation process for arguments", () => {
    it(`should succeed if there is 3 arguments with the template ${json.template}`, () => {
        expect(isIORight(validate(minimistWrapper(["a", "p", "my commit"]))(preset))).toBe(true);
    });

    it(`should succeed if there is 2 arguments with the template ${two_template}`, () => {
        expect(isIORight(validate(minimistWrapper(["a", "my commit"]))(two_preset))).toBe(true);
    });

    it(`should succeed if there is 1 argument with the template ${two_template}`, () => {
        expect(isIORight(validate(minimistWrapper(["my commit"]))(one_preset))).toBe(true);
    });

    it("should fail if there is more than 3 arguments", () => {
        const validation = validate(minimistWrapper(["a", "x", "my commit", "should not be here"]))(preset);
        const result = eitherFolded(validation);

        expect(isIOLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(errorNumberArguments());
    });

    it("should fail if the target is missing", () => {
        const validation = validate(minimistWrapper(["a", "my commit"]))(preset);
        const result = eitherFolded(validation);

        expect(isIOLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(errorTemplateExcess("<target>", preset.template));
    });

    it("should fail if the action and the target is missing", () => {
        const validation = validate(minimistWrapper(["my commit"]))(preset);
        const result = eitherFolded(validation);

        expect(isIOLeft(validation)).toBe(true);
        expect(result.length).toBe(2);
        expect(result).toContain(errorTemplateExcess("<target>", preset.template));
        expect(result).toContain(errorTemplateExcess("<action>", preset.template));
    });

    it("should fail if the delimiter is not inside the templace", () => {
        const validation = validate(minimistWrapper(["my commit"]))(no_preset);
        const result = eitherFolded(validation);

        expect(isIOLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(errorTemplateNeed("<message>", no_preset.template));
    });

    it("should fail if the action is not inside actions map for 2 arguments", () => {
        const validation = validate(minimistWrapper(["x", "my commit"]))(two_preset);
        const result = eitherFolded(validation);

        expect(isIOLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(errorNotKeyInMap("x", preset.actions, "actions"));
    });

    it("should fail if the action is not inside actions map for 3 arguments", () => {
        const validation = validate(minimistWrapper(["x", "p", "my commit"]))(preset);
        const result = eitherFolded(validation);

        expect(isIOLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(errorNotKeyInMap("x", preset.actions, "actions"));
    });

    it("should fail if the target is not inside actions map for 3 arguments", () => {
        const validation = validate(minimistWrapper(["a", "x", "my commit"]))(preset);
        const result = eitherFolded(validation);

        expect(isIOLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(errorNotKeyInMap("x", preset.targets, "targets"));
    });

    it("should fail if both the action and the target is not inside actions map for 3 arguments", () => {
        const validation = validate(minimistWrapper(["y", "x", "my commit"]))(preset);
        const result = eitherFolded(validation);

        expect(isIOLeft(validation)).toBe(true);
        expect(result.length).toBe(2);
        expect(result).toContain(errorNotKeyInMap("y", preset.actions, "actions"));
        expect(result).toContain(errorNotKeyInMap("x", preset.targets, "targets"));
    });

    it("should succeed with good sources", () => {
        const validation = validate(
            minimistWrapper(["a", "p", "my commit", "-S", "./README.md", "--source", "./qush.config.json"])
        )(preset);

        expect(isIORight(validation)).toBe(true);
    });

    it("should failed with wrong sources", () => {
        const validation = validate(minimistWrapper(["a", "p", "my commit", "-S", "README.md", "--source", "code.no"]))(preset);
        const result = eitherFolded(validation);

        expect(isIOLeft(validation)).toBe(true);
        expect(result.length).toBe(1);
        expect(result).toContain(errorNoFile("code.no"));
    });
});
