// eslint-disable-next-line no-unused-vars
import Preset from "../../preset";
import {
    error_validator_excess,
    error_validator_need_multiple,
    error_validator_need,
    error_validator_arguments,
    error_validator_map,
    error_validator_uptodate,
    error_validator_pull,
    error_source_unexist,
} from "../../utils/error";
import { execSync } from "child_process";
// eslint-disable-next-line no-unused-vars
import { toAcp, Acp } from "./acp";
import fs from "fs";
// eslint-disable-next-line no-unused-vars
import minimist from "minimist";

// eslint-disable-next-line no-unused-vars
import { Either, left, right, map, getValidation } from "fp-ts/lib/Either";
// eslint-disable-next-line no-unused-vars
import { NonEmptyArray, getSemigroup } from "fp-ts/lib/NonEmptyArray";
import { pipe } from "fp-ts/lib/pipeable";
import { sequenceT } from "fp-ts/lib/Apply";
import { array } from "fp-ts/lib/Array";
import { get_flags } from "../../utils/command";

/**
 * A bunch of validation before executing our acp commands
 */

const applicativeValidation = getValidation(getSemigroup<string>());

/**
 * Validate if the repository is not up to date compare to the remote one
 * TODO: this is still not functionnal
 * ! effect due to execSync call
 */
const validate_notuptodate = (): Either<NonEmptyArray<string>, void> =>
    execSync("git status --porcelain").toString() === "" ? left([error_validator_uptodate()]) : right(null);

/**
 * Validate if the repository doesn't need pull
 * TODO: this is still not functionnal
 * ! effect due to execSync call
 */
const validate_needpull = (): Either<NonEmptyArray<string>, void> => {
    const get_commit_id = (args: string, name: string) => {
        try {
            return execSync(`git rev-parse ${args}`, { stdio: "ignore" }).toString();
        } catch {
            return `${name}: failed`;
        }
    };

    const base = get_commit_id("@ @{u}", "base");
    const local = get_commit_id("@", "local");

    return base === local ? left([error_validator_pull()]) : right(null);
};

/**
 * Validate if the preset and the args are compatible
 * @param args
 * @param preset
 */
const validate_preset = (args: string[], preset: Preset): Either<NonEmptyArray<string>, void> => {
    /**
     * check if a sequence exist and is uniq inside a sentence
     * @param sequence
     * @param sentence
     */
    const uniq = (sequence: string, sentence: string): boolean => {
        return sentence.split(sequence).length === 2;
    };

    /**
     * check if a needed sequence really exist once inside a sentence and return an error otherwise
     * @param sequence
     * @param sentence
     */
    const need = (sequence: string, sentence: string): Either<NonEmptyArray<string>, void> => {
        if (!uniq(sequence, sentence)) {
            if (sentence.includes(sequence)) return left([error_validator_need_multiple(sequence, sentence)]);
            else return left([error_validator_need(sequence, sentence)]);
        }
        return right(null);
    };

    /**
     * check if a non needed sequence really not exist inside a sentence and return an error otherwise
     * @param sequence
     * @param sentence
     */
    const excess = (sequence: string, sentence: string): Either<NonEmptyArray<string>, void> => {
        if (sentence.includes(sequence)) return left([error_validator_excess(sequence, sentence)]);
        return right(null);
    };

    /**
     * check if a key exist inside a map and return an error otherwise
     * @param key
     * @param map
     * @param map_name
     */
    const exist = (key: string, map: Map<string, string>, map_name: string): Either<NonEmptyArray<string>, void> => {
        if (!map.has(key)) return left([error_validator_map(key, map, map_name)]);
        return right(null);
    };

    switch (args.length) {
        // case : acp <message>
        case 1:
            return pipe(
                sequenceT(applicativeValidation)(
                    need("<message>", preset.template),
                    excess("<action>", preset.template),
                    excess("<target>", preset.template)
                ),
                map(() => null)
            );
        // case : acp <action> <message>
        case 2:
            return pipe(
                sequenceT(applicativeValidation)(
                    need("<message>", preset.template),
                    need("<action>", preset.template),
                    excess("<target>", preset.template),
                    exist(args[0], preset.actions, "actions")
                ),
                map(() => null)
            );
        // case : acp <action> <target> <message>
        case 3:
            return pipe(
                sequenceT(applicativeValidation)(
                    need("<action>", preset.template),
                    need("<message>", preset.template),
                    need("<target>", preset.template),
                    exist(args[0], preset.actions, "actions"),
                    exist(args[1], preset.targets, "targets")
                ),
                map(() => null)
            );
        default:
            return left([error_validator_arguments()]);
    }
};

const validate_source = (source: string): Either<NonEmptyArray<string>, void> =>
    fs.existsSync(source) === false ? left([error_source_unexist(source)]) : right(null);

const validate_sources = (sources: string[]): Either<NonEmptyArray<string>, void> => {
    const validations: Either<NonEmptyArray<string>, void>[] = sources.map(validate_source);

    return pipe(
        array.sequence(applicativeValidation)(validations),
        map(() => null)
    );
};

/**
 * validate a command according to his preset and his arguments
 * @param args
 * @param preset
 */
const validate = (args: minimist.ParsedArgs, preset: Preset): Either<NonEmptyArray<string>, Acp> => {
    return pipe(
        sequenceT(applicativeValidation)(
            validate_notuptodate(),
            validate_needpull(),
            validate_preset(args._, preset),
            validate_sources(get_flags(args, "S", "source"))
        ),
        map(() => toAcp([args, preset]))
    );
};

export default validate;
