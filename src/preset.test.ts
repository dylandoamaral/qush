import Preset, { mapToTypedMap } from "./preset";
import json from "./preset.typed.json";
import { TypedJSON } from "typedjson";

test("the parsing from json to Preset", () => {
    const serializer = new TypedJSON(Preset);
    const object = serializer.parse(json);

    expect(object).toBeInstanceOf(Preset);
    expect(object.name).toBe(json.name);
    expect(object.contributors).toEqual(json.contributors);
    expect(object.template).toBe(json.template);
    expect(object.actions.get("a")).toBe("add");
    expect(object.targets.get("d")).toBe("documentation");
});

describe("the mapToTypedMap function", () => {
    it("should return the correct format", () => {
        const mtjm = mapToTypedMap({
            a: "b",
            c: "d",
        });

        expect(mtjm.length).toBe(2);
        expect(mtjm[0]["key"]).toBe("a");
        expect(mtjm[0]["value"]).toBe("b");
        expect(mtjm[1]["key"]).toBe("c");
        expect(mtjm[1]["value"]).toBe("d");
    });
});

describe("the translator", () => {
    /**
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
                fold(errors => errors, () => [])
            );

            expect(isLeft(validation)).toBe(true);
            expect(result.length).toBe(1);
            expect(result).toContain(error_translator_undefined(field));
        });
    }
    */
});
