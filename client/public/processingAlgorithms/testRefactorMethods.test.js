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

test('check fully valid user input', () => {
    expect(loginHandler2.checkIfUserInputIsViable("nick sonsini", "nick@gmail.com", "nick", "Password1", "Password1")).toBe(0);
});

test('check full user input - empty name', () => {
    expect(loginHandler2.checkIfUserInputIsViable("", "nick@gmail.com", "nick", "Password1", "Password1")).toBe(1);
});

test('check full user input - empty email', () => {
    expect(loginHandler2.checkIfUserInputIsViable("Nick", "", "nick", "Password1", "Password1")).toBe(1);
});

test('check full user input - empty username', () => {
    expect(loginHandler2.checkIfUserInputIsViable("Nick", "nick@nick.com", "", "Password1", "Password1")).toBe(1);
});

test('check full user input - empty password', () => {
    expect(loginHandler2.checkIfUserInputIsViable("Nick", "nick@nick.com", "nick", "", "")).toBe(1);
});

test('check full user input - invalid email', () => {
    expect(loginHandler2.checkIfUserInputIsViable("Nick", "nickwithoutAT.com", "nick", "Password1", "Password1")).toBe(2);
});

test('check full user input - invalid characters in username', () => {
    expect(loginHandler2.checkIfUserInputIsViable("Nick", "nick@nick.com", "Nick!@#$%", "Password1", "Password1")).toBe(3);
});

test('check full user input - invalid too short username', () => {
    expect(loginHandler2.checkIfUserInputIsViable("Nick", "nick@nick.com", "Nic", "Password1", "Password1")).toBe(4);
});

test('check full user input - invalid too long in username', () => {
    expect(loginHandler2.checkIfUserInputIsViable("Nick", "nick@nick.com", "NickNickNickNick", "Password1", "Password1")).toBe(4);
});

test('check full user input - invalid password', () => {
    expect(loginHandler2.checkIfUserInputIsViable("Nick", "nick@nick.com", "Nick", "noNumberInPS", "noNumberInPS")).toBe(5);
});

test('check full user input - invalid mismatching passwords', () => {
    expect(loginHandler2.checkIfUserInputIsViable("Nick", "nick@nick.com", "Nick", "Password1", "Password2")).toBe(6);
});