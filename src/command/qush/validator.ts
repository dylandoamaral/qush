// eslint-disable-next-line no-unused-vars
import fs from "fs";
// eslint-disable-next-line no-unused-vars
import minimist from "minimist";
// eslint-disable-next-line no-unused-vars
import { Either, left, right, map, getValidation } from "fp-ts/lib/Either";
// eslint-disable-next-line no-unused-vars
import { NonEmptyArray, getSemigroup } from "fp-ts/lib/NonEmptyArray";
// eslint-disable-next-line no-unused-vars
import { IOEither, getIOValidation, map as mapIOEither, chain, fromEither } from "fp-ts/lib/IOEither";
// eslint-disable-next-line no-unused-vars
import { Qush, toQush } from "./qush";
import { pipe } from "fp-ts/lib/pipeable";
import { sequenceT } from "fp-ts/lib/Apply";
import { array } from "fp-ts/lib/Array";
import { getFlags } from "../command";
import { gitUpdateRemote, folderIsGitRepo, folderDontNeedPull, folderIsNotUpToDate, gitIsInstalled } from "../../utils/git";
import { errorNoFile } from "../../utils/error";
// eslint-disable-next-line no-unused-vars
import { Config } from "../../config";

/**
 * A bunch of validation before executing our Qush commands
 */

const applicativeValidation = getValidation(getSemigroup<string>());

const ioeitherApplicativeValidation = getIOValidation(getSemigroup<string>());

/**
 * Validate all validation that refer to the current repository
 * ! Always use it after a "gitIsInstalled" function
 */
export const validateRepository: IOEither<NonEmptyArray<string>, void> = pipe(
    gitIsInstalled,
    chain(() => folderIsGitRepo),
    chain(() => gitUpdateRemote),
    chain(folderDontNeedPull),
    chain(folderIsNotUpToDate)
);

const validateSource = (source: string): Either<NonEmptyArray<string>, void> =>
    fs.existsSync(source) === false ? left([errorNoFile(source)]) : right(null);

const validateSources = (sources: string[]): Either<NonEmptyArray<string>, void> => {
    const validations: Either<NonEmptyArray<string>, void>[] = sources.map(validateSource);

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
export const validateCommand = (args: minimist.ParsedArgs) => (config: Config): IOEither<NonEmptyArray<string>, Qush> => {
    return pipe(
        sequenceT(ioeitherApplicativeValidation)(fromEither(validateSources(getFlags(args, "S", "source")))),
        mapIOEither(() => toQush([args, config]))
    );
};
