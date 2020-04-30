import { map_to_typed_map, typify } from "./translator";
import default_json from "../../preset.default.json";
import typed_json from "../../preset.typed.json";
import { error_translator_undefined } from "../../utils/error";

describe("the map_to_typed_map", () => {
    it("should return the correct format", () => {
        const mtjm = map_to_typed_map({
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
    it("should return the correct format", () => {
        const mtjm = typify(default_json);

        expect(mtjm.actions.length).toBe(6);
        expect(mtjm.targets.length).toBe(3);
        expect(mtjm).toEqual(typed_json);
    });

    for (const field of ["actions", "targets", "template"]) {
        it(`should return an error if ${field} targets is undefine`, () => {
            let error_json = { ...default_json };
            const typed = field as "actions" | "targets" | "template";
            error_json[typed] = undefined;

            expect(() => typify(error_json)).toThrow(error_translator_undefined(field));
        });
    }
});
