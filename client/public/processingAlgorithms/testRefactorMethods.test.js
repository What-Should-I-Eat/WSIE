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

test('check valid password', () => {
    expect(loginHandler2.checkIfPasswordIsValid("iAmValid123")).toBe(true);
});

test('check invalid password - too short', () => {
    expect(loginHandler2.checkIfPasswordIsValid("123")).toBe(false);
});

test('check invalid password - too long', () => {
    expect(loginHandler2.checkIfPasswordIsValid("1234567890123456")).toBe(false);
});

test('check invalid password - no number', () => {
    expect(loginHandler2.checkIfPasswordIsValid("noNumberrr")).toBe(false);
});

test('check invalid password - no lowercase', () => {
    expect(loginHandler2.checkIfPasswordIsValid("ALLCAPS000")).toBe(false);
});

test('check invalid password - no capital', () => {
    expect(loginHandler2.checkIfPasswordIsValid("alllowercase")).toBe(false);
});