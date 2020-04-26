import { error_translator_undefined } from "./error";

export const map_to_typed_map = (field: any): any => {
    return Object.keys(field).map((key) => {
        return {
            key, value: field[key]
        };
    });
};

/**
 * translate an acp config json to a file compatible with typedJson
 * @param json
 */
export const typify = (json: any): any => {
    for (const field of ["actions", "targets", "template"]) {
        if (json[field] === undefined) throw new Error(error_translator_undefined(field));
    }

    const actions = map_to_typed_map(json.actions);
    const targets = map_to_typed_map(json.targets);

    return {
        name: json.name, contributors: json.contributors, actions, targets, template: json.template
    };
};