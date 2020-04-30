import { error_translator_undefined } from "../../utils/error";
// eslint-disable-next-line no-unused-vars
import { Either, left, right, getValidation, map } from "fp-ts/lib/Either";
// eslint-disable-next-line no-unused-vars
import { NonEmptyArray, getSemigroup } from "fp-ts/lib/NonEmptyArray";
import { sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/pipeable";

export const map_to_typed_map = (field: any): any => {
    return Object.keys(field).map((key) => {
        return {
            key,
            value: field[key],
        };
    });
};

/**
 * check if a non needed sequence really not exist inside a sentence and return an error otherwise
 * @param sequence
 * @param sentence
 */
const validate_typify = (field: string, json: any): Either<NonEmptyArray<string>, void> =>
    json[field] === undefined ? left([error_translator_undefined(field)]) : right(null);

/**
 * convert the acp config json to a file compatible with typedJson
 * @param json 
 */
const convert = (json: any) => {
    const actions = map_to_typed_map(json.actions);
    const targets = map_to_typed_map(json.targets);

    return {
        name: json.name,
        contributors: json.contributors,
        actions,
        targets,
        template: json.template,
    };
};

/**
 * valide then test an acp config json to a file compatible with typedJson
 * @param json
 */
export const typify = (json: any): Either<NonEmptyArray<string>, any> => {
    const applicativeValidation = getValidation(getSemigroup<string>());

    return pipe(
        sequenceT(applicativeValidation)(
            validate_typify("actions", json),
            validate_typify("targets", json),
            validate_typify("template", json)
        ),
        map(() => convert(json))
    );
};
