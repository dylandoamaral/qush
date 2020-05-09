import {
  jsonObject,
  jsonMember,
  jsonArrayMember,
  jsonMapMember,
  TypedJSON,
} from "typedjson";
import fs from "fs";
import { IO, map as mapIO } from "fp-ts/lib/IO";
import {
  tryCatch,
  map,
  IOEither,
} from "fp-ts/lib/IOEither";
import json from "./asset/preset.default.json";
import { pipe } from "fp-ts/lib/pipeable";
import { NonEmptyArray, getSemigroup } from "fp-ts/lib/NonEmptyArray";
import { Either, getValidation, left, right, map as mapEither } from "fp-ts/lib/Either";
import { sequenceT } from "fp-ts/lib/Apply";
import { errorUndefinedField } from "./utils/error";
import { merge } from './utils/functionnal';

@jsonObject
export default class Preset {
  @jsonMember({ constructor: String })
  public name: string;

  @jsonArrayMember(String)
  public contributors: string;

  @jsonMapMember(String, String)
  public actions: Map<string, string>;

  @jsonMapMember(String, String)
  public targets: Map<string, string>;

  @jsonMember({ constructor: String })
  public template: string;
}

/**
 * check if a non needed sequence really not exist inside a sentence and return an error otherwise
 * @param sequence
 * @param sentence
 */
const validateTypify = (
  field: string,
  object: any
): Either<NonEmptyArray<string>, void> =>
  object[field] === undefined
    ? left([errorUndefinedField(field)])
    : right(null);

export const mapToTypedMap = (field: any): any => {
  return Object.keys(field).map((key) => {
    return {
      key,
      value: field[key]['value'],
    };
  });
};

/**
 * convert the acp config json to a file compatible with typedJson
 * @param json
 */
export const convert = (json: any): any => {
  const actions = mapToTypedMap(json.actions);
  const targets = mapToTypedMap(json.targets);

  return {
    name: json.name,
    contributors: json.contributors,
    actions,
    targets,
    template: json.template,
  };
};

export const parse = (object: any): Preset => {
  const serializer = new TypedJSON(Preset);
  return serializer.parse(object);
};

/**
 * valide then test an acp config json to a file compatible with typedJson
 * @param json
 */
export const typify = (json: any): Either<NonEmptyArray<string>, any> => {
  const applicativeValidation = getValidation(getSemigroup<string>());

  return pipe(
    sequenceT(applicativeValidation)(
      validateTypify("contributors", json),
      validateTypify("name", json),
      validateTypify("actions", json),
      validateTypify("targets", json),
      validateTypify("template", json)
    ),
    mapEither(() => convert(json))
  );
};

export const loadPreset = (root: string): IOEither<NonEmptyArray<string>, Preset> => {
  const config_path = `${root}/acp.config.json`;
   
  return pipe(
    tryCatch(
      () => fs.readFileSync(config_path, { encoding: "utf8" }), // right
      () => json as any // left
    ),
    map(JSON.parse),
    merge,
    mapIO(typify),
    map(parse)
  );
};
