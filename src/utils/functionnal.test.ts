import { stay, merge } from "./functionnal";
import { IOEither, rightIO, leftIO } from 'fp-ts/lib/IOEither';

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