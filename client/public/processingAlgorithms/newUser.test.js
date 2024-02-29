/**
 * @jest-environment jsdom
 */

const loginHandler = require('./newUser');

beforeEach(() => {
    jest.clearAllMocks();
    global.loginHandler2 = require('./testRefactorMethods');
    global.host = "http://localhost:8080";
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('newUser() front end endpoint', () => {
    it('add new user - successful', async () => {
        const event = {
            preventDefault: jest.fn()
        };
        global.document.body.innerHTML = `
          <input id="fullname-input" />
          <input id="email-input" />
          <input id='username-input' />
          <input id='password-input1' />
          <input id='password-input2' />
          <h4 id='feedback-message' />
          <h4 id='password-requirement' />
          <h4 id='verificationCodeDiv' />
        `;
        const fullName = document.getElementById('fullname-input');
        const email = document.getElementById('email-input');
        const username = document.getElementById('username-input');
        const password = document.getElementById('password-input1');
        const confirmedPassword = document.getElementById('password-input2');
        const feedbackMessage = document.getElementById('feedback-message');
        const passwordRequirement = document.getElementById('password-requirement');

        fullName.value = "fullName";
        email.value = "test@test.com";
        username.value = "userTest";
        password.value = "Password1234";
        confirmedPassword.value = "Password1234";
        global.loginHandler2.checkIfUserInputIsViable = require('./testRefactorMethods');
        global.loginHandler2.getVerificationMessage = require('./testRefactorMethods');
        global.loginHandler2.getVerificationCode = require('./testRefactorMethods');
        global.loginHandler2.checkIfUserInputIsViable = jest.fn(() => 0);
        global.loginHandler2.getVerificationMessage = jest.fn(() => "valid input message");

        global.loginHandler2.getVerificationCode = jest.fn(() => "33333");
        global.verificationCode = "33333";
        global.loginHandler2.sendEmail = jest.fn();
        global.emailjs = jest.fn();
        global.emailjs.send = jest.fn().mockImplementation(() => 
        Promise.resolve({ 
            response: {status: 200, text: 'OK'}
        }));

        const newUserData = {
            fullName: fullName.value,
            userName: username.value,
            password: password.value,
            email: email.value,
            verificationCode: verificationCode,
            diet: [],
            health: [],
            favorites: []
          };

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(JSON.stringify(newUserData)),
            })
        )
        const response = await loginHandler.newUser(event);

        expect(response).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
        });
    });
    it('add new user - unsuccessful invalid input', async () => {
        const event = {
            preventDefault: jest.fn()
        };
        global.document.body.innerHTML = `
          <input id="fullname-input" />
          <input id="email-input" />
          <input id='username-input' />
          <input id='password-input1' />
          <input id='password-input2' />
          <h4 id='feedback-message' />
          <h4 id='password-requirement' />
          <h4 id='verificationCodeDiv' />
        `;
        const fullName = document.getElementById('fullname-input');
        const email = document.getElementById('email-input');
        const username = document.getElementById('username-input');
        const password = document.getElementById('password-input1');
        const confirmedPassword = document.getElementById('password-input2');
        const feedbackMessage = document.getElementById('feedback-message');
        const passwordRequirement = document.getElementById('password-requirement');

        fullName.value = "fullName";
        email.value = "test@test.com";
        username.value = "userTest";
        password.value = "Password1234";
        confirmedPassword.value = "Password1234";
        global.loginHandler2.checkIfUserInputIsViable = require('./testRefactorMethods');
        global.loginHandler2.getVerificationMessage = require('./testRefactorMethods');
        global.loginHandler2.getVerificationCode = require('./testRefactorMethods');
        global.loginHandler2.checkIfUserInputIsViable = jest.fn(() => 1);
        global.loginHandler2.getVerificationMessage = jest.fn(() => "invalid input message");

        global.loginHandler2.getVerificationCode = jest.fn(() => "33333");
        global.verificationCode = "33333";
        global.loginHandler2.sendEmail = jest.fn();
        global.emailjs = jest.fn();
        global.emailjs.send = jest.fn().mockImplementation(() => 
        Promise.resolve({ 
            response: {status: 200, text: 'OK'}
        }));

        const newUserData = {
            fullName: fullName.value,
            userName: username.value,
            password: password.value,
            email: email.value,
            verificationCode: verificationCode,
            diet: [],
            health: [],
            favorites: []
          };

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(JSON.stringify(newUserData)),
            })
        )
        const response = await loginHandler.newUser(event);

        expect(response).toBe(false);
        expect(feedbackMessage.innerHTML).toBe("invalid input message");
        expect(fetch).toHaveBeenCalledTimes(0);
        expect(fetch).not.toHaveBeenCalledWith('http://localhost:8080/api/v1/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
        });
    });
    it('add new user - unsuccessful username already exists', async () => {
        const event = {
            preventDefault: jest.fn()
        };
        global.document.body.innerHTML = `
          <input id="fullname-input" />
          <input id="email-input" />
          <input id='username-input' />
          <input id='password-input1' />
          <input id='password-input2' />
          <h4 id='feedback-message' />
          <h4 id='password-requirement' />
          <h4 id='verificationCodeDiv' />
        `;
        const fullName = document.getElementById('fullname-input');
        const email = document.getElementById('email-input');
        const username = document.getElementById('username-input');
        const password = document.getElementById('password-input1');
        const confirmedPassword = document.getElementById('password-input2');
        const feedbackMessage = document.getElementById('feedback-message');
        const passwordRequirement = document.getElementById('password-requirement');

        fullName.value = "fullName";
        email.value = "test@test.com";
        username.value = "userTest";
        password.value = "Password1234";
        confirmedPassword.value = "Password1234";
        global.loginHandler2.checkIfUserInputIsViable = require('./testRefactorMethods');
        global.loginHandler2.getVerificationMessage = require('./testRefactorMethods');
        global.loginHandler2.getVerificationCode = require('./testRefactorMethods');
        global.loginHandler2.checkIfUserInputIsViable = jest.fn(() => 0);
        global.loginHandler2.getVerificationMessage = jest.fn(() => "valid input message");

        global.loginHandler2.getVerificationCode = jest.fn(() => "33333");
        global.verificationCode = "33333";
        global.loginHandler2.sendEmail = jest.fn();
        global.emailjs = jest.fn();
        global.emailjs.send = jest.fn().mockImplementation(() => 
        Promise.resolve({ 
            response: {status: 200, text: 'OK'}
        }));

        const newUserData = {
            fullName: fullName.value,
            userName: username.value,
            password: password.value,
            email: email.value,
            verificationCode: verificationCode,
            diet: [],
            health: [],
            favorites: []
          };

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 444,
                json: () => Promise.reject(new Error('Username already exists in database.')),
            })
        )
        const response = await loginHandler.newUser(event);

        expect(response).toBe(false);
        expect(feedbackMessage.innerHTML).toBe("Username already exists in database.");
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
        });
    });
    it('add new user - unsuccessful email already exists', async () => {
        const event = {
            preventDefault: jest.fn()
        };
        global.document.body.innerHTML = `
          <input id="fullname-input" />
          <input id="email-input" />
          <input id='username-input' />
          <input id='password-input1' />
          <input id='password-input2' />
          <h4 id='feedback-message' />
          <h4 id='password-requirement' />
          <h4 id='verificationCodeDiv' />
        `;
        const fullName = document.getElementById('fullname-input');
        const email = document.getElementById('email-input');
        const username = document.getElementById('username-input');
        const password = document.getElementById('password-input1');
        const confirmedPassword = document.getElementById('password-input2');
        const feedbackMessage = document.getElementById('feedback-message');
        const passwordRequirement = document.getElementById('password-requirement');

        fullName.value = "fullName";
        email.value = "test@test.com";
        username.value = "userTest";
        password.value = "Password1234";
        confirmedPassword.value = "Password1234";
        global.loginHandler2.checkIfUserInputIsViable = require('./testRefactorMethods');
        global.loginHandler2.getVerificationMessage = require('./testRefactorMethods');
        global.loginHandler2.getVerificationCode = require('./testRefactorMethods');
        global.loginHandler2.checkIfUserInputIsViable = jest.fn(() => 0);
        global.loginHandler2.getVerificationMessage = jest.fn(() => "valid input message");

        global.loginHandler2.getVerificationCode = jest.fn(() => "33333");
        global.verificationCode = "33333";
        global.loginHandler2.sendEmail = jest.fn();
        global.emailjs = jest.fn();
        global.emailjs.send = jest.fn().mockImplementation(() => 
        Promise.resolve({ 
            response: {status: 200, text: 'OK'}
        }));

        const newUserData = {
            fullName: fullName.value,
            userName: username.value,
            password: password.value,
            email: email.value,
            verificationCode: verificationCode,
            diet: [],
            health: [],
            favorites: []
          };

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 445,
                json: () => Promise.reject(new Error('Email already exists in database.')),
            })
        )
        const response = await loginHandler.newUser(event);

        expect(response).toBe(false);
        expect(feedbackMessage.innerHTML).toBe("Email already exists in database.");
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
        });
    });
    it('add new user - unsuccessful generic HTTP error', async () => {
        const event = {
            preventDefault: jest.fn()
        };
        global.document.body.innerHTML = `
          <input id="fullname-input" />
          <input id="email-input" />
          <input id='username-input' />
          <input id='password-input1' />
          <input id='password-input2' />
          <h4 id='feedback-message' />
          <h4 id='password-requirement' />
          <h4 id='verificationCodeDiv' />
        `;
        const fullName = document.getElementById('fullname-input');
        const email = document.getElementById('email-input');
        const username = document.getElementById('username-input');
        const password = document.getElementById('password-input1');
        const confirmedPassword = document.getElementById('password-input2');
        const feedbackMessage = document.getElementById('feedback-message');
        const passwordRequirement = document.getElementById('password-requirement');

        fullName.value = "fullName";
        email.value = "test@test.com";
        username.value = "userTest";
        password.value = "Password1234";
        confirmedPassword.value = "Password1234";
        global.loginHandler2.checkIfUserInputIsViable = require('./testRefactorMethods');
        global.loginHandler2.getVerificationMessage = require('./testRefactorMethods');
        global.loginHandler2.getVerificationCode = require('./testRefactorMethods');
        global.loginHandler2.checkIfUserInputIsViable = jest.fn(() => 0);
        global.loginHandler2.getVerificationMessage = jest.fn(() => "valid input message");

        global.loginHandler2.getVerificationCode = jest.fn(() => "33333");
        global.verificationCode = "33333";
        global.loginHandler2.sendEmail = jest.fn();
        global.emailjs = jest.fn();
        global.emailjs.send = jest.fn().mockImplementation(() => 
        Promise.resolve({ 
            response: {status: 200, text: 'OK'}
        }));

        const newUserData = {
            fullName: fullName.value,
            userName: username.value,
            password: password.value,
            email: email.value,
            verificationCode: verificationCode,
            diet: [],
            health: [],
            favorites: []
          };

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 402,
                json: () => Promise.reject(new Error('Generic error')),
            })
        )
        const response = await loginHandler.newUser(event);

        expect(response).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
        });
    });
    it('add new user - unsuccessful generic server error', async () => {
        const event = {
            preventDefault: jest.fn()
        };
        global.document.body.innerHTML = `
          <input id="fullname-input" />
          <input id="email-input" />
          <input id='username-input' />
          <input id='password-input1' />
          <input id='password-input2' />
          <h4 id='feedback-message' />
          <h4 id='password-requirement' />
          <h4 id='verificationCodeDiv' />
        `;
        const fullName = document.getElementById('fullname-input');
        const email = document.getElementById('email-input');
        const username = document.getElementById('username-input');
        const password = document.getElementById('password-input1');
        const confirmedPassword = document.getElementById('password-input2');
        const feedbackMessage = document.getElementById('feedback-message');
        const passwordRequirement = document.getElementById('password-requirement');

        fullName.value = "fullName";
        email.value = "test@test.com";
        username.value = "userTest";
        password.value = "Password1234";
        confirmedPassword.value = "Password1234";
        global.loginHandler2.checkIfUserInputIsViable = require('./testRefactorMethods');
        global.loginHandler2.getVerificationMessage = require('./testRefactorMethods');
        global.loginHandler2.getVerificationCode = require('./testRefactorMethods');
        global.loginHandler2.checkIfUserInputIsViable = jest.fn(() => 0);
        global.loginHandler2.getVerificationMessage = jest.fn(() => "valid input message");

        global.loginHandler2.getVerificationCode = jest.fn(() => "33333");
        global.verificationCode = "33333";
        global.loginHandler2.sendEmail = jest.fn();
        global.emailjs = jest.fn();
        global.emailjs.send = jest.fn().mockImplementation(() => 
        Promise.resolve({ 
            response: {status: 200, text: 'OK'}
        }));

        const newUserData = {
            fullName: fullName.value,
            userName: username.value,
            password: password.value,
            email: email.value,
            verificationCode: verificationCode,
            diet: [],
            health: [],
            favorites: []
          };

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 500,
                json: () => Promise.reject(new Error('Server error.')),
            })
        )
        const response = await loginHandler.newUser(event);

        expect(response).toBe(false);
        expect(feedbackMessage.innerHTML).toBe('Server error.');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
        });
    });
    it('add new user - unsuccessful bad request error', async () => {
        const event = {
            preventDefault: jest.fn()
        };
        global.document.body.innerHTML = `
          <input id="fullname-input" />
          <input id="email-input" />
          <input id='username-input' />
          <input id='password-input1' />
          <input id='password-input2' />
          <h4 id='feedback-message' />
          <h4 id='password-requirement' />
          <h4 id='verificationCodeDiv' />
        `;
        const fullName = document.getElementById('fullname-input');
        const email = document.getElementById('email-input');
        const username = document.getElementById('username-input');
        const password = document.getElementById('password-input1');
        const confirmedPassword = document.getElementById('password-input2');
        const feedbackMessage = document.getElementById('feedback-message');
        const passwordRequirement = document.getElementById('password-requirement');

        fullName.value = "fullName";
        email.value = "test@test.com";
        username.value = "userTest";
        password.value = "Password1234";
        confirmedPassword.value = "Password1234";
        global.loginHandler2.checkIfUserInputIsViable = require('./testRefactorMethods');
        global.loginHandler2.getVerificationMessage = require('./testRefactorMethods');
        global.loginHandler2.getVerificationCode = require('./testRefactorMethods');
        global.loginHandler2.checkIfUserInputIsViable = jest.fn(() => 0);
        global.loginHandler2.getVerificationMessage = jest.fn(() => "valid input message");

        global.loginHandler2.getVerificationCode = jest.fn(() => "33333");
        global.verificationCode = "33333";
        global.loginHandler2.sendEmail = jest.fn();
        global.emailjs = jest.fn();
        global.emailjs.send = jest.fn().mockImplementation(() => 
        Promise.resolve({ 
            response: {status: 200, text: 'OK'}
        }));

        const newUserData = {
            fullName: fullName.value,
            userName: username.value,
            password: password.value,
            email: email.value,
            verificationCode: verificationCode,
            diet: [],
            health: [],
            favorites: []
          };

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 400,
                json: () => Promise.reject(new Error('Bad Request.')),
            })
        )
        const response = await loginHandler.newUser(event);

        expect(response).toBe(false);
        expect(feedbackMessage.innerHTML).toBe('Bad Request.');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
        });
    });
    it('add new user - unsuccessful unauthorized error', async () => {
        const event = {
            preventDefault: jest.fn()
        };
        global.document.body.innerHTML = `
          <input id="fullname-input" />
          <input id="email-input" />
          <input id='username-input' />
          <input id='password-input1' />
          <input id='password-input2' />
          <h4 id='feedback-message' />
          <h4 id='password-requirement' />
          <h4 id='verificationCodeDiv' />
        `;
        const fullName = document.getElementById('fullname-input');
        const email = document.getElementById('email-input');
        const username = document.getElementById('username-input');
        const password = document.getElementById('password-input1');
        const confirmedPassword = document.getElementById('password-input2');
        const feedbackMessage = document.getElementById('feedback-message');
        const passwordRequirement = document.getElementById('password-requirement');

        fullName.value = "fullName";
        email.value = "test@test.com";
        username.value = "userTest";
        password.value = "Password1234";
        confirmedPassword.value = "Password1234";
        global.loginHandler2.checkIfUserInputIsViable = require('./testRefactorMethods');
        global.loginHandler2.getVerificationMessage = require('./testRefactorMethods');
        global.loginHandler2.getVerificationCode = require('./testRefactorMethods');
        global.loginHandler2.checkIfUserInputIsViable = jest.fn(() => 0);
        global.loginHandler2.getVerificationMessage = jest.fn(() => "valid input message");

        global.loginHandler2.getVerificationCode = jest.fn(() => "33333");
        global.verificationCode = "33333";
        global.loginHandler2.sendEmail = jest.fn();
        global.emailjs = jest.fn();
        global.emailjs.send = jest.fn().mockImplementation(() => 
        Promise.resolve({ 
            response: {status: 200, text: 'OK'}
        }));

        const newUserData = {
            fullName: fullName.value,
            userName: username.value,
            password: password.value,
            email: email.value,
            verificationCode: verificationCode,
            diet: [],
            health: [],
            favorites: []
          };

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 401,
                json: () => Promise.reject(new Error('Unauthorized.')),
            })
        )
        const response = await loginHandler.newUser(event);

        expect(response).toBe(false);
        expect(feedbackMessage.innerHTML).toBe('Unauthorized.');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
        });
    });
    it('add new user - unsuccessful not found error', async () => {
        const event = {
            preventDefault: jest.fn()
        };
        global.document.body.innerHTML = `
          <input id="fullname-input" />
          <input id="email-input" />
          <input id='username-input' />
          <input id='password-input1' />
          <input id='password-input2' />
          <h4 id='feedback-message' />
          <h4 id='password-requirement' />
          <h4 id='verificationCodeDiv' />
        `;
        const fullName = document.getElementById('fullname-input');
        const email = document.getElementById('email-input');
        const username = document.getElementById('username-input');
        const password = document.getElementById('password-input1');
        const confirmedPassword = document.getElementById('password-input2');
        const feedbackMessage = document.getElementById('feedback-message');
        const passwordRequirement = document.getElementById('password-requirement');

        fullName.value = "fullName";
        email.value = "test@test.com";
        username.value = "userTest";
        password.value = "Password1234";
        confirmedPassword.value = "Password1234";
        global.loginHandler2.checkIfUserInputIsViable = require('./testRefactorMethods');
        global.loginHandler2.getVerificationMessage = require('./testRefactorMethods');
        global.loginHandler2.getVerificationCode = require('./testRefactorMethods');
        global.loginHandler2.checkIfUserInputIsViable = jest.fn(() => 0);
        global.loginHandler2.getVerificationMessage = jest.fn(() => "valid input message");

        global.loginHandler2.getVerificationCode = jest.fn(() => "33333");
        global.verificationCode = "33333";
        global.loginHandler2.sendEmail = jest.fn();
        global.emailjs = jest.fn();
        global.emailjs.send = jest.fn().mockImplementation(() => 
        Promise.resolve({ 
            response: {status: 200, text: 'OK'}
        }));

        const newUserData = {
            fullName: fullName.value,
            userName: username.value,
            password: password.value,
            email: email.value,
            verificationCode: verificationCode,
            diet: [],
            health: [],
            favorites: []
          };

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 404,
                json: () => Promise.reject(new Error('Not found.')),
            })
        )
        const response = await loginHandler.newUser(event);

        expect(response).toBe(false);
        expect(feedbackMessage.innerHTML).toBe('Not found.');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
        });
    });
    it('add new user - unsuccessful request timeout error', async () => {
        const event = {
            preventDefault: jest.fn()
        };
        global.document.body.innerHTML = `
          <input id="fullname-input" />
          <input id="email-input" />
          <input id='username-input' />
          <input id='password-input1' />
          <input id='password-input2' />
          <h4 id='feedback-message' />
          <h4 id='password-requirement' />
          <h4 id='verificationCodeDiv' />
        `;
        const fullName = document.getElementById('fullname-input');
        const email = document.getElementById('email-input');
        const username = document.getElementById('username-input');
        const password = document.getElementById('password-input1');
        const confirmedPassword = document.getElementById('password-input2');
        const feedbackMessage = document.getElementById('feedback-message');
        const passwordRequirement = document.getElementById('password-requirement');

        fullName.value = "fullName";
        email.value = "test@test.com";
        username.value = "userTest";
        password.value = "Password1234";
        confirmedPassword.value = "Password1234";
        global.loginHandler2.checkIfUserInputIsViable = require('./testRefactorMethods');
        global.loginHandler2.getVerificationMessage = require('./testRefactorMethods');
        global.loginHandler2.getVerificationCode = require('./testRefactorMethods');
        global.loginHandler2.checkIfUserInputIsViable = jest.fn(() => 0);
        global.loginHandler2.getVerificationMessage = jest.fn(() => "valid input message");

        global.loginHandler2.getVerificationCode = jest.fn(() => "33333");
        global.verificationCode = "33333";
        global.loginHandler2.sendEmail = jest.fn();
        global.emailjs = jest.fn();
        global.emailjs.send = jest.fn().mockImplementation(() => 
        Promise.resolve({ 
            response: {status: 200, text: 'OK'}
        }));

        const newUserData = {
            fullName: fullName.value,
            userName: username.value,
            password: password.value,
            email: email.value,
            verificationCode: verificationCode,
            diet: [],
            health: [],
            favorites: []
          };

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 408,
                json: () => Promise.reject(new Error('Request timeout error.')),
            })
        )
        const response = await loginHandler.newUser(event);

        expect(response).toBe(false);
        expect(feedbackMessage.innerHTML).toBe('Request timeout error.');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
        });
    });
    it('add new user - unsuccessful too many requests', async () => {
        const event = {
            preventDefault: jest.fn()
        };
        global.document.body.innerHTML = `
          <input id="fullname-input" />
          <input id="email-input" />
          <input id='username-input' />
          <input id='password-input1' />
          <input id='password-input2' />
          <h4 id='feedback-message' />
          <h4 id='password-requirement' />
          <h4 id='verificationCodeDiv' />
        `;
        const fullName = document.getElementById('fullname-input');
        const email = document.getElementById('email-input');
        const username = document.getElementById('username-input');
        const password = document.getElementById('password-input1');
        const confirmedPassword = document.getElementById('password-input2');
        const feedbackMessage = document.getElementById('feedback-message');
        const passwordRequirement = document.getElementById('password-requirement');

        fullName.value = "fullName";
        email.value = "test@test.com";
        username.value = "userTest";
        password.value = "Password1234";
        confirmedPassword.value = "Password1234";
        global.loginHandler2.checkIfUserInputIsViable = require('./testRefactorMethods');
        global.loginHandler2.getVerificationMessage = require('./testRefactorMethods');
        global.loginHandler2.getVerificationCode = require('./testRefactorMethods');
        global.loginHandler2.checkIfUserInputIsViable = jest.fn(() => 0);
        global.loginHandler2.getVerificationMessage = jest.fn(() => "valid input message");

        global.loginHandler2.getVerificationCode = jest.fn(() => "33333");
        global.verificationCode = "33333";
        global.loginHandler2.sendEmail = jest.fn();
        global.emailjs = jest.fn();
        global.emailjs.send = jest.fn().mockImplementation(() => 
        Promise.resolve({ 
            response: {status: 200, text: 'OK'}
        }));

        const newUserData = {
            fullName: fullName.value,
            userName: username.value,
            password: password.value,
            email: email.value,
            verificationCode: verificationCode,
            diet: [],
            health: [],
            favorites: []
          };

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 429,
                json: () => Promise.reject(new Error('Too many requests.')),
            })
        )
        const response = await loginHandler.newUser(event);

        expect(response).toBe(false);
        expect(feedbackMessage.innerHTML).toBe('Too many requests.');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserData),
        });
    });
});