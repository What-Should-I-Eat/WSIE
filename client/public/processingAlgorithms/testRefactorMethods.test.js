const loginHandler2 = require("./testRefactorMethods");

test('check input box is identified as empty', () => {
    expect(loginHandler2.isInputEmpty("")).toBe(true);
});

test('check input box is identified as not empty', () => {
    expect(loginHandler2.isInputEmpty("123456")).toBe(false);
});