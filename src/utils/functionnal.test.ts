import { stay, merge, condition } from "./functionnal";
// eslint-disable-next-line no-unused-vars
import { IOEither, rightIO, leftIO } from "fp-ts/lib/IOEither";

describe("the stay function", () => {
    it("should return the correct format", () => {
        expect(stay("a")()).toEqual("a");
        expect(stay(1)()).toEqual(1);
    });
});

describe("the merge function", () => {
    it("should return the correct format", () => {
        const test = (b: boolean): IOEither<Boolean, Boolean> => b ? rightIO(() => true) : leftIO(() => false);
        expect(merge(test(true))()).toEqual(true);
        expect(merge(test(false))()).toEqual(false);
    });
});

describe("the condition function", () => {
    it("should return the correct either", () => {
        const left: IOEither<Boolean, Boolean> = leftIO(() => false);
        const right: IOEither<Boolean, Boolean> = rightIO(() => true);

        expect(condition(true, left, right)).toEqual(right);
        expect(condition(false, left, right)).toEqual(left);
    });
});