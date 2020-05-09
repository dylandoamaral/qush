import { tryCatch } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { execSync } from "child_process";
import { IO } from "fp-ts/lib/IO";
import { merge } from "./functionnal";

export const findGitRoot = (): IO<string> => {
  return pipe(
    tryCatch(
      () => execSync("git rev-parse --show-toplevel").toString().trim(),
      () => process.cwd()
    ),
    merge
  );
};
