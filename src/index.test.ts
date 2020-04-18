import acp from "./index";

test("acp", () => {
    expect(acp()).toBe("add-commit-push incoming");
});
