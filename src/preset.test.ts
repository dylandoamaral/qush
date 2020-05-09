import Preset, { mapToTypedMap, typify } from "./preset";
import json from "./asset/preset.typed.json";
import { TypedJSON } from "typedjson";
import { pipe } from "fp-ts/lib/pipeable";
import default_json from "./asset/preset.default.json";
import typed_json from "./asset/preset.typed.json";
import { getOrElse, fold, isLeft } from "fp-ts/lib/Either";
import { errorUndefinedField } from "./utils/error";

test("the parsing from json to Preset", () => {
    const serializer = new TypedJSON(Preset);
    const object = serializer.parse(json);

    expect(object).toBeInstanceOf(Preset);
    expect(object.name).toBe(json.name);
    expect(object.contributors).toEqual(json.contributors);
    expect(object.template).toBe(json.template);
    expect(object.actions.get("a")['value']).toBe("add");
    expect(object.actions.get("a")['description']).toBe("to use when you add something new");
    expect(object.targets.get("d")['value']).toBe("documentation");
    expect(object.targets.get("d")['description']).toBe("to use when you comment some functionnalities");
});

describe("the mapToTypedMap function", () => {
    it("should return the correct format", () => {
        const mtjm = mapToTypedMap({
            a: {
                value: "b",
                description: "c",
            },
            d: {
                value: "e",
                description: "f",
            },
        });

        expect(mtjm.length).toBe(2);
        expect(mtjm[0]["key"]).toBe("a");
        expect(mtjm[0]["value"]["value"]).toBe("b");
        expect(mtjm[0]["value"]["description"]).toBe("c");
        expect(mtjm[1]["key"]).toBe("d");
        expect(mtjm[1]["value"]["value"]).toBe("e");
        expect(mtjm[1]["value"]["description"]).toBe("f");
    });
});

describe("the translator from config to typedjson", () => {
    it("should return the correct format", () => {
        const mtjm = pipe(
            typify(default_json),
            getOrElse(() => null)
        );

        expect(mtjm.actions.length).toBe(6);
        expect(mtjm.targets.length).toBe(3);
        expect(mtjm).toEqual(typed_json);
    });

    for (const field of ["actions", "targets", "template"]) {
        it(`should return an error if ${field} targets is undefine`, () => {
            let error_json = { ...default_json };
            const typed = field as "actions" | "targets" | "template";
            error_json[typed] = undefined;

            const validation = typify(error_json);
            const result = pipe(
                validation,
                fold(
                    (errors) => errors,
                    () => []
                )
            );

            expect(isLeft(validation)).toBe(true);
            expect(result.length).toBe(1);
            expect(result).toContain(errorUndefinedField(field));
        });
    }
});
