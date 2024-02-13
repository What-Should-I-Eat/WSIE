const loginHandler2 = require("./testRefactorMethods");

test('check input box is identified as empty', () => {
    expect(loginHandler2.isInputEmpty("")).toBe(true);
});

test('check input box is identified as not empty', () => {
    expect(loginHandler2.isInputEmpty("123456")).toBe(false);
});

test('check matching passwords do match', () => {
    expect(loginHandler2.checkIfPasswordsMatch("test", "test")).toBe(true);
});

test('check different passwords do not match', () => {
    expect(loginHandler2.checkIfPasswordsMatch("not", "matching")).toBe(false);
});