import fs from "fs";
import { isRight, isLeft } from "fp-ts/lib/Either";
import { validateSource, validateArgumentsCoherence, validateSources, validateArgumentExistence, validateArgumentsExistence } from "./validator";
import minimist from "minimist";
import config from "../../asset/default.config.json";

test("the validation of the sources", () => {
    const file = "./testfile.txt";
    fs.writeFileSync(file, "");

    expect(isRight(validateSource(file))).toEqual(true);
    expect(isLeft(validateSource("./testnofile.txt"))).toEqual(true);

    expect(isRight(validateSources([file]))).toEqual(true);
    expect(isLeft(validateSources([file, "./testnofile.txt"]))).toEqual(true);

    fs.unlinkSync(file);
});

test("the validation of the arguments coherence", () => {
    const args = minimist(["a", "p", "my commit"]);
    expect(isRight(validateArgumentsCoherence(args)(config))).toEqual(true);
});

test("the validation of the arguments existence", () => {
    const args = minimist(["a", "p", "my commit"]);
    expect(isRight(validateArgumentExistence("a")(config.instructions[0]))).toEqual(true);
    expect(isLeft(validateArgumentExistence("no")(config.instructions[0]))).toEqual(true);
    
    expect(isRight(validateArgumentsExistence(args)(config))).toEqual(true);
});
