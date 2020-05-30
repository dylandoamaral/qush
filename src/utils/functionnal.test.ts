import { stay, merge, condition, isIORight, isIOLeft } from "./functionnal";
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

describe("the isIoRight function", () => {
    it("should return true if it is right", () => {
        const left: IOEither<Boolean, Boolean> = leftIO(() => false);
        const right: IOEither<Boolean, Boolean> = rightIO(() => true);

        expect(isIORight(left)).toEqual(false);
        expect(isIORight(right)).toEqual(true);
    });
});

describe("the isIoLeft function", () => {
    it("should return true if it is right", () => {
        const left: IOEither<Boolean, Boolean> = leftIO(() => false);
        const right: IOEither<Boolean, Boolean> = rightIO(() => true);

        expect(isIOLeft(left)).toEqual(true);
        expect(isIOLeft(right)).toEqual(false);
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

