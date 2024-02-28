/**
 * @jest-environment jsdom
 */

const loginHandler = require('./forgotPassword');

beforeEach(() => {
    jest.clearAllMocks();

    global.loginHandler2 = require('./testRefactorMethods');
    global.loginHandler2.isInputEmpty = require('./testRefactorMethods');
    global.loginHandler2.isInputEmpty = jest.fn().mockReturnValue(false);

    global.host = "localhost:8080";
});

afterEach(() => {
    jest.clearAllMocks();
    global.loginHandler2 = require('./testRefactorMethods');
});

describe('put new password in database', () => {
    it('put new password in database - successful', async () => {
        const updatedDataResponse = { acknowledge: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0, upsertedId: null};

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(JSON.stringify(updatedDataResponse)),
            })
        )
        const username = 'testuser';
        const newPassword = 'newPassword';

        const response = await loginHandler.putNewPasswordInDB(username, newPassword);

        expect(response).toBe(true);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/changePassword', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: username,
            password: newPassword,            
            }),
        });
    });

    it('put new password in database - unsuccesful', async () => {
        const updatedDataResponse = { acknowledge: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0, upsertedId: null};

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 404,
                json: () => Promise.reject(new Error('HTTP error! Status: 404')),
            })
        )
        const username = 'testuser';
        const newPassword = 'newPassword';

        const response = await loginHandler.putNewPasswordInDB(username, newPassword);

        expect(response).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/changePassword', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: username,
            password: newPassword,            
            }),
        });
    });
})

describe('put verification code in database', () => {
    it('put verification code in database - successful', async () => {
        const updatedDataResponse = { acknowledge: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0, upsertedId: null};

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(JSON.stringify(updatedDataResponse)),
            })
        )
        const username = 'testuser';
        const verificationCode = '123456';

        const response = await loginHandler.putVerificationCodeInDB(username, verificationCode);

        expect(response).toBe(true);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/resendVerificationCode', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: username,
            verificationCode: verificationCode,            
            }),
        });
    });

    it('put verification code in database - unsuccessful', async () => {
        const updatedDataResponse = { acknowledge: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0, upsertedId: null};

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 404,
                json: () => Promise.reject(new Error('Cannot resend code')),
            })
        )
        const username = 'testuser';
        const verificationCode = '123456';

        const response = await loginHandler.putVerificationCodeInDB(username, verificationCode);

        expect(response).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/resendVerificationCode', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: username,
            verificationCode: verificationCode,            
            }),
        });
    });
})

describe('validate code', () => {
    it('validate code - successful', async () => {
        const updatedDataResponse = { acknowledge: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0, upsertedId: null};

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(JSON.stringify(updatedDataResponse)),
            })
        )
        const username = 'testuser';
        const verificationCode = '123456';

        const response = await loginHandler.validateCode(username, verificationCode);

        expect(response).toBe(true);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/verify', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: username,
            verificationCode: verificationCode,            
            }),
        });
    });

    it('put verification code in database - unsuccessful', async () => {
        const updatedDataResponse = { acknowledge: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0, upsertedId: null};

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 404,
                json: () => Promise.reject(new Error('HTTP error! Status: 404')),
            })
        )
        const username = 'testuser';
        const verificationCode = '123456';

        const response = await loginHandler.validateCode(username, verificationCode);

        expect(response).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/verify', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: username,
            verificationCode: verificationCode,            
            }),
        });
    });
})

describe('enter new password', () => {
    it('password do not match - unsuccessful', async () => {
        const event = {
            preventDefault: jest.fn()
          };

        document.body.innerHTML = `
            <input id="username-input" />
            <h4 id="feedback-message" />
            <input id="password-input1" />
            <input id="password-input2" />
        `;
      
        const username = document.getElementById('username-input');
        const feedbackMessage = document.getElementById('feedback-message');
        const password1 = document.getElementById('password-input1');
        const password2 = document.getElementById('password-input2');
      
        username.value = 'userTest';
        password1.value = 'Password123';
        password2.value = 'Password123';

        global.loginHandler2.checkIfPasswordsMatch = jest.fn().mockReturnValueOnce(false);

        const response = await loginHandler.enterNewPassword(event);

        expect(response).toBe(false);
        expect(feedbackMessage.innerHTML).toBe("Passwords do not match. Please try again.")
    });

    it('password is not valid - unsuccessful', async () => {
        const event = {
            preventDefault: jest.fn()
          };

        document.body.innerHTML = `
            <input id="username-input" />
            <h4 id="feedback-message" />
            <input id="password-input1" />
            <input id="password-input2" />
        `;
      
        const username = document.getElementById('username-input');
        const feedbackMessage = document.getElementById('feedback-message');
        const password1 = document.getElementById('password-input1');
        const password2 = document.getElementById('password-input2');
      
        username.value = 'userTest';
        password1.value = 'Password123';
        password2.value = 'Password123';

        global.loginHandler2.checkIfPasswordsMatch = jest.fn().mockReturnValueOnce(true);
        global.loginHandler2.checkIfPasswordIsValid = jest.fn().mockReturnValueOnce(false);

        const response = await loginHandler.enterNewPassword(event);

        expect(response).toBe(false);
        expect(feedbackMessage.innerHTML).toBe("Ensure that new password adheres to password requirements.")
    });

    it('enter new password - successful', async () => {
        const event = {
            preventDefault: jest.fn()
          };

        document.body.innerHTML = `
            <input id="username-input" />
            <h4 id="feedback-message" />
            <input id="password-input1" />
            <input id="password-input2" />
            <h4 id="password-requirement" />
        `;
        const username = document.getElementById('username-input');
        const feedbackMessage = document.getElementById('feedback-message');
        const password1 = document.getElementById('password-input1');
        const password2 = document.getElementById('password-input2');
        var passwordRequirement = document.getElementById('password-requirement');      
        username.value = 'userTest';
        password1.value = 'Password123';
        password2.value = 'Password123';
        passwordRequirement.style.display = 'block';

        global.loginHandler2.checkIfPasswordsMatch = jest.fn().mockReturnValueOnce(true);
        global.loginHandler2.checkIfPasswordIsValid = jest.fn().mockReturnValueOnce(true);

        loginHandler.putNewPasswordInDB = jest.fn().mockImplementationOnce(() => 
        Promise.resolve({ 
            return: true,
        }));

        global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
            status: 200,
            json: () => Promise.resolve(),
        })
        )
        const response = await loginHandler.enterNewPassword(event);

        expect(passwordRequirement.style.display).toBe('none');
        expect(feedbackMessage.innerHTML).toBe("Password updated! Please log in.")
    });

    it('password not updated - unsuccessful', async () => {
        const event = {
            preventDefault: jest.fn()
          };

        document.body.innerHTML = `
            <input id="username-input" />
            <h4 id="feedback-message" />
            <input id="password-input1" />
            <input id="password-input2" />
            <h4 id="password-requirement" />
        `;
        const username = document.getElementById('username-input');
        const feedbackMessage = document.getElementById('feedback-message');
        const password1 = document.getElementById('password-input1');
        const password2 = document.getElementById('password-input2');
        var passwordRequirement = document.getElementById('password-requirement');      
        username.value = 'userTest';
        password1.value = 'Password123';
        password2.value = 'Password123';
        passwordRequirement.style.display = 'block';

        global.loginHandler2.checkIfPasswordsMatch = jest.fn().mockReturnValueOnce(true);
        global.loginHandler2.checkIfPasswordIsValid = jest.fn().mockReturnValueOnce(true);

        loginHandler.putNewPasswordInDB = jest.fn().mockImplementationOnce(() => 
        Promise.resolve({ 
            return: false,
        }));

        const response = await loginHandler.enterNewPassword(event);

        expect(feedbackMessage.innerHTML).toBe("Error updating password. Please try again.")
    });
})

describe('input form showers', () => {
    test('show input form verification', () => {
        document.body.innerHTML = `
            <div id="reset-enter-email" />
            <div id="password-reset-code" />

        `;
        const enterEmailDiv = document.getElementById('reset-enter-email');
        const verificationCodeDiv = document.getElementById('password-reset-code');
        
        enterEmailDiv.style.display = 'block';
        verificationCodeDiv.style.display = 'none';

        loginHandler.showInputFormForVerification();

        expect(enterEmailDiv.style.display).toBe('none');
        expect(verificationCodeDiv.style.display).toBe('block');
    });

    test('show input form new password', () => {
        document.body.innerHTML = `
            <div id="password-reset-code" />
            <div id="reset-password" />
        `;
        const verificationCodeDiv = document.getElementById('password-reset-code');
        const newPasswordDiv = document.getElementById('reset-password');
        
        newPasswordDiv.style.display = 'none';
        verificationCodeDiv.style.display = 'block';

        loginHandler.showInputFormForNewPassword();

        expect(newPasswordDiv.style.display).toBe('block');
        expect(verificationCodeDiv.style.display).toBe('none');
    });
})


describe('get user credentials', () => {
    it('get user credentials - successful', async () => {
        const forgotUserInfo = {
            username: 'test user',
            fullName: 'test full name',
            email: 'test@test.com',
          };

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(JSON.stringify(forgotUserInfo)),
            })
        )
        const email = 'test@test.com';

        const response = await loginHandler.getUserCredentials(email);

        expect(response).toBe(JSON.stringify(forgotUserInfo));
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/requestInfoForPasswordReset?email=test@test.com', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
    });

    it('get user credentials - unsuccessful', async () => {
        const forgotUserInfo = {
            username: 'test user',
            fullName: 'test full name',
            email: 'test@test.com',
          };

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 404,
                json: () => Promise.reject(),
            })
        )
        const email = 'test@test.com';

        const response = await loginHandler.getUserCredentials(email);

        expect(response).toBeNull();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/requestInfoForPasswordReset?email=test@test.com', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
    });

})

describe('forgot password', () => {
    it('forgot password credentials error - unsuccessful', async () => {
        const event = {
            preventDefault: jest.fn()
        };
        const forgotUserInfo = {
            error: new Error('in database')
        };

        global.document.body.innerHTML = `
          <div id="email-input" />
          <div id="feedback-message" />
          <div id='reset-enter-email' />
          <div id='password-reset-code' />
        `;
        const userEmail = document.getElementById('email-input');
        const feedbackMessage = document.getElementById('feedback-message');

        global.loginHandler2.sendEmail = require('./testRefactorMethods');
        global.loginHandler2.getVerificationCode = require('./testRefactorMethods');
        global.loginHandler2.sendEmail = jest.fn();
        global.emailjs = jest.fn();
        global.emailjs.send = jest.fn().mockImplementation(() => 
        Promise.resolve({ 
            response: {status: 200, text: 'OK'}
        }));
        global.loginHandler2.getVerificationCode = jest.fn(() => "33333");
        global.verificationCode = "33333";

        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve((forgotUserInfo)),
            })
        )
        const email = 'test@test.com';

        const response = await loginHandler.forgotPassword(event);

        expect(response).toBe(false);
        expect(feedbackMessage.innerHTML).toBe("This email is not in our database. Please try again.");
    });

     it('forgot password verification code error - unsuccessful', async () => {
        const event = {
            preventDefault: jest.fn()
        };
        const forgotUserInfo = {
            username: 'test user',
            fullName: 'test full name',
            email: 'test@test.com',
        };

        global.document.body.innerHTML = `
          <div id="email-input" />
          <div id="feedback-message" />
          <div id='reset-enter-email' />
          <div id='password-reset-code' />
        `;
        const userEmail = document.getElementById('email-input');
        const feedbackMessage = document.getElementById('feedback-message');
        const enterEmailDiv = document.getElementById('reset-enter-email');
        const verificationCodeDiv = document.getElementById('password-reset-code');

        global.loginHandler2.sendEmail = require('./testRefactorMethods');
        global.loginHandler2.getVerificationCode = require('./testRefactorMethods');
        global.loginHandler2.sendEmail = jest.fn();
        global.emailjs = jest.fn();
        global.emailjs.send = jest.fn().mockImplementation(() => 
        Promise.resolve({ 
            response: {status: 200, text: 'OK'}
        }));
        global.loginHandler2.getVerificationCode = jest.fn(() => "33333");
        global.verificationCode = "33333";

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(JSON.stringify(forgotUserInfo)),
            })
        ).mockImplementationOnce(() =>
            Promise.resolve({
                status: 404,
                json: () => Promise.reject(new Error('not put in DB')),
            })
        )
        const email = 'test@test.com';

        const response = await loginHandler.forgotPassword(event);

        expect(response).toBe(false);
        expect(feedbackMessage.innerHTML).toBe("An error occurred. Please try again.");
    });
})

describe('enter new verification code', () => {
    it('enter new verification code is valid error - unsuccessful', async () => {
        const event = {
            preventDefault: jest.fn()
        };
        document.body.innerHTML = `
          <h2 id="valid-vc" />
          <input id="verificationCodeInput" />
        `;
        let verificationCodeVerificationMessage = document.getElementById('valid-vc');        
        let enteredVerificationCode = document.getElementById('verificationCodeInput');

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 404,
                json: () => Promise.reject(new Error('user not verified')),
            })
        )
        const response = await loginHandler.enterNewVerificationCode(event);

        expect(response).toBe(false);
        expect(verificationCodeVerificationMessage.innerHTML).toBe("The verification code is incorrect. Please try again.");
    });
})