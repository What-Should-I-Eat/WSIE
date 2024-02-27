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
        const response = await loginHandler.enterNewPassword(event);

        expect(passwordRequirement.style.display).toBe('none');
        expect(feedbackMessage.innerHTML).toBe("Password updated! Please log in.")
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