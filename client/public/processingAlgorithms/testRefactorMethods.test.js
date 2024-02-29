/**
 * @jest-environment jsdom
 */

const loginHandler2 = require("./testRefactorMethods");

describe('input box tests', () => {
    test('check input box is identified as empty', () => {
        expect(loginHandler2.isInputEmpty("")).toBe(true);
    });

    test('check input box is identified as not empty', () => {
        expect(loginHandler2.isInputEmpty("123456")).toBe(false);
    });
});

describe('matching password tests', () => {
    test('check matching passwords do match', () => {
        expect(loginHandler2.checkIfPasswordsMatch("test", "test")).toBe(true);
    });
    
    test('check different passwords do not match', () => {
        expect(loginHandler2.checkIfPasswordsMatch("not", "matching")).toBe(false);
    });
});

describe('valid password checks', () => {
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
        expect(loginHandler2.checkIfPasswordIsValid("alllowercase1")).toBe(false);
    });
});

describe('check if user input is viable tests', () => {
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
});

describe('verification/feedback message tests', () => {
    test('test verification message - success', () => {
        expect(loginHandler2.getVerificationMessage(0)).toBe('Success');
    });
    
    test('test verification message - fields not all filled in', () => {
        expect(loginHandler2.getVerificationMessage(1)).toBe('Please make sure all fields are filled in.');
    });
    
    test('test verification message - invalid email address', () => {
        expect(loginHandler2.getVerificationMessage(2)).toBe('Please enter a valid email address.');
    });
    
    test('test verification message - special characters in username', () => {
        expect(loginHandler2.getVerificationMessage(3)).toBe('Username must not contain special characters.');
    });
    
    test('test verification message - username length', () => {
        expect(loginHandler2.getVerificationMessage(4)).toBe('Please ensure that username is between 4 and 15 characters.');
    });
    
    test('test verification message - invalid password', () => {
        expect(loginHandler2.getVerificationMessage(5)).toBe('Please ensure that password is between 8-15 characters, contains at least one capital and lowercase letter, and contains a number.');
    });
    
    test('test verification message - passwords do not match', () => {
        expect(loginHandler2.getVerificationMessage(6)).toBe('Please ensure that passwords match.');
    });
});

describe('#getVerificationCode() endpoint', () => {
    it('mocked return verification code', async () => {
        jest.clearAllMocks();
        global.host = "http://localhost:8080";

         global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve("555555"),
            })
        )

        const returnedCode = await loginHandler2.getVerificationCode();

        expect(returnedCode).toBe("555555");
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/getVerificationCode', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
    });
    jest.clearAllMocks();
});

describe('test sendEmail call', () => {
    test('test sendEmail calls emailjs.send()', () => {
        const emailjs = require('@emailjs/browser');
        const responseExpected = {response: {status: 200, text: 'OK'}};
    
        jest.mock('@emailjs/browser', () => ({
            send: jest.fn().mockImplementation(() => 
                Promise.resolve({ 
                    response: {status: 200, text: 'OK'}
                }))
        }));

        expect(loginHandler2.sendEmail("test", "test@gmail.com", "123456", emailjs, "newuser", null)).toBe(false);
    
        expect(emailjs.send()).resolves.toEqual(responseExpected);
    });

    test('test sendEmail2 calls emailjs.send()', () => {
        const emailjs = require('@emailjs/browser');
        const responseExpected = {response: {status: 200, text: 'OK'}};
    
        jest.mock('@emailjs/browser', () => ({
            send: jest.fn().mockImplementation(() => 
                Promise.resolve({ 
                    response: {status: 200, text: 'OK'}
                }))
        }));

        expect(loginHandler2.sendEmail2("test", "test@gmail.com", "123456", emailjs, "newuser", null)).toBe(false);
    
        expect(emailjs.send()).resolves.toEqual(responseExpected);
    });
})

describe('test password toggler', () => {
    test('test password toggler starting as type = password', () => {
        const passwordId = 'password-input';
        const passwordTogglerId = 'password-input-toggler';
        document.body.innerHTML = `
            <input id="password-input" />
            <i id="password-input-toggler" />

        `;
        const password = document.getElementById(passwordId);
        const passwordToggler = document.getElementById(passwordTogglerId);
        password.type = 'password';

        loginHandler2.togglePassword(passwordId, passwordTogglerId);

        expect(password.type).toBe('text');
    });

    test('test password toggler starting as type = text', () => {
        const passwordId = 'password-input';
        const passwordTogglerId = 'password-input-toggler';
        document.body.innerHTML = `
            <input id="password-input" />
            <i id="password-input-toggler" />

        `;
        const password = document.getElementById(passwordId);
        const passwordToggler = document.getElementById(passwordTogglerId);
        password.type = 'text';

        loginHandler2.togglePassword(passwordId, passwordTogglerId);

        expect(password.type).toBe('password');
    });
})