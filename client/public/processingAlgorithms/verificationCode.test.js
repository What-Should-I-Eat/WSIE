/**
 * @jest-environment jsdom
 */

// const loginHandler2 = require('./testRefactorMethods.js');
const verificationHandler = require('./verificationCode');

beforeEach(() => {
    jest.clearAllMocks();

    global.loginHandler2 = require('./testRefactorMethods');
    global.loginHandler2.isInputEmpty = require('./testRefactorMethods');

    global.loginHandler2.isInputEmpty = jest.fn(() => false);

    global.host = "localhost:8080";
});

afterEach(() => {
    jest.clearAllMocks();
    global.loginHandler2 = require('./testRefactorMethods');
});

describe('#resendVerificationCode() endpoint', () => {
    it('mocked resend verification code New User', async () => {

        const updatedDataResponse = { acknowledge: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0, upsertedId: null};

        const event = {
            preventDefault: jest.fn()
          };

        document.body.innerHTML = `
            <input id="username-input" />
            <h4 id="feedback-message" />
            <input id="fullname-input" />
            <input id="email-input" />
        `;
      
        const username = document.getElementById('username-input');
        const feedbackMessage = document.getElementById('feedback-message');
        const fullName = document.getElementById('fullname-input');
        const email = document.getElementById('email-input');
      
        username.value = 'userTest';
        fullName.value = 'Full Name Test';
        email.value = 'test@test.com';

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(JSON.stringify(updatedDataResponse)),
            })
        )

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

        sendEmail = jest.fn();

        const response = await verificationHandler.resendVerificationCodeNewUser(event);

        expect(response).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/resendVerificationCode', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: username.value,
            verificationCode: verificationCode,            
            }),
        });
    });

    it('mocked resend verification code Login', async () => {

        const updatedDataResponse = { acknowledge: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0, upsertedId: null};

        const event = {
            preventDefault: jest.fn()
          };

        document.body.innerHTML = `
            <input id="username-input" />
            <h4 id="feedback-message" />
        `;
      
        const username = document.getElementById('username-input');
        const feedbackMessage = document.getElementById('feedback-message');
      
        username.value = 'userTest';
        global.email = 'test@test.com';
        global.loginHandler2.sendEmail = require('./testRefactorMethods');
        global.loginHandler2.getVerificationCode = require('./testRefactorMethods');
        global.loginHandler2.sendEmail = jest.fn();
        global.emailjs = jest.fn();
        global.getUserEmail = jest.fn();
        global.emailjs.send = jest.fn().mockImplementation(() => 
        Promise.resolve({ 
            response: {status: 200, text: 'OK'}
        }));
        global.loginHandler2.getVerificationCode = jest.fn(() => "33333");
        global.verificationCode = "33333";

        sendEmail = jest.fn();
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(JSON.stringify(updatedDataResponse)),
            })
        )

       

        const response = await verificationHandler.resendVerificationStatusLogin(event);

        expect(response).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(2); // since getUserEmail also calls fetch
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/resendVerificationCode', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: username.value,
            verificationCode: verificationCode,            
            }),
        });
    });
});


describe('#verify() endpoint', () => {
    it('mocked update verification status New User - successful', async () => {

        const updatedDataResponse = { acknowledge: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0, upsertedId: null};

        const event = {
            preventDefault: jest.fn()
          };

        document.body.innerHTML = `
            <input id="username-input" />
            <h4 id="feedback-message" />
            <input id="verificationCodeInput" />
        `;
      
        const username = document.getElementById('username-input');
        const feedbackMessage = document.getElementById('feedback-message');
        const enteredVerificationCode = document.getElementById('verificationCodeInput');
      
        username.value = 'userTest';
        enteredVerificationCode.value = '333333';

        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(JSON.stringify(updatedDataResponse)),
            })
        )
        const response = verificationHandler.updateVerificationStatusLogin(event);
        
        expect(response).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/verify', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: username.value,
            verificationCode: enteredVerificationCode.value,            
            }),
        });
    });

    it('mocked update verification status New User - generic failure', async () => {
        const event = {
            preventDefault: jest.fn()
          };

        document.body.innerHTML = `
            <input id="username-input" />
            <h4 id="feedback-message" />
            <input id="verificationCodeInput" />
        `;
      
        const username = document.getElementById('username-input');
        const feedbackMessage = document.getElementById('feedback-message');
        const enteredVerificationCode = document.getElementById('verificationCodeInput');
      
        username.value = 'userTest';
        enteredVerificationCode.value = '333333';

        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 404,
                json: () => Promise.reject(new Error('Code has expired')),
            })
        )
        const response = verificationHandler.updateVerificationStatusLogin(event);
        
        expect(response).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/verify', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: username.value,
            verificationCode: enteredVerificationCode.value,            
            }),
        });
    });

    it('mocked update verification status New User - expired code', async () => {
        const event = {
            preventDefault: jest.fn()
          };

        document.body.innerHTML = `
            <input id="username-input" />
            <h4 id="feedback-message" />
            <input id="verificationCodeInput" />
        `;
      
        const username = document.getElementById('username-input');
        const feedbackMessage = document.getElementById('feedback-message');
        const enteredVerificationCode = document.getElementById('verificationCodeInput');
      
        username.value = 'userTest';
        enteredVerificationCode.value = '333333';

        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 437,
                json: () => Promise.reject(new Error('Code has expired')),
            })
        )
        const response = verificationHandler.updateVerificationStatusLogin(event);
        
        expect(response).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/verify', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: username.value,
            verificationCode: enteredVerificationCode.value,            
            }),
        });
    });

    it('mocked update verification status Login - successful', async () => {

        const updatedDataResponse = { acknowledge: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0, upsertedId: null};

        const event = {
            preventDefault: jest.fn()
          };

        document.body.innerHTML = `
            <input id="username-input" />
            <h4 id="feedback-message" />
            <input id="fullname-input" />
            <input id="verificationCodeInput" />
        `;
      
        const username = document.getElementById('username-input');
        const feedbackMessage = document.getElementById('feedback-message');
        const fullName = document.getElementById('fullname-input');
        const enteredVerificationCode = document.getElementById('verificationCodeInput');
      
        username.value = 'userTest';
        fullName.value = 'Full Name Test';
        enteredVerificationCode.value = '333333';

        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(JSON.stringify(updatedDataResponse)),
            })
        )
        const response = verificationHandler.updateVerificationStatusNewUser(event);
        
        expect(response).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/verify', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: username.value,
            verificationCode: enteredVerificationCode.value,            
            }),
        });
    });

    it('mocked update verification status Login - expired code', async () => {
        const event = {
            preventDefault: jest.fn()
          };

        document.body.innerHTML = `
            <input id="username-input" />
            <h4 id="feedback-message" />
            <input id="fullname-input" />
            <input id="verificationCodeInput" />
        `;
      
        const username = document.getElementById('username-input');
        let feedbackMessage = document.getElementById('feedback-message');
        const fullName = document.getElementById('fullname-input');
        const enteredVerificationCode = document.getElementById('verificationCodeInput');
      
        username.value = 'userTest';
        fullName.value = 'Full Name Test';
        enteredVerificationCode.value = '333333';
        feedbackMessage = 'Code has expired after 10 minutes.<br/>Please click resend code for a new code.'

        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 437,
                json: () => Promise.reject(new Error('Code has expired')),
            })
        )
        const response = verificationHandler.updateVerificationStatusNewUser(event);
        
        expect(response).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/verify', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: username.value,
            verificationCode: enteredVerificationCode.value,            
            }),
        });
    });

    it('mocked update verification status Login - generic failure', async () => {
        const event = {
            preventDefault: jest.fn()
          };

        document.body.innerHTML = `
            <input id="username-input" />
            <h4 id="feedback-message" />
            <input id="fullname-input" />
            <input id="verificationCodeInput" />
        `;
      
        const username = document.getElementById('username-input');
        let feedbackMessage = document.getElementById('feedback-message');
        const fullName = document.getElementById('fullname-input');
        const enteredVerificationCode = document.getElementById('verificationCodeInput');
      
        username.value = 'userTest';
        fullName.value = 'Full Name Test';
        enteredVerificationCode.value = '333333';
        feedbackMessage = 'Code has expired after 10 minutes.<br/>Please click resend code for a new code.'

        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 404,
                json: () => Promise.reject(new Error('Code has expired')),
            })
        )
        const response = verificationHandler.updateVerificationStatusNewUser(event);
        
        expect(response).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/verify', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: username.value,
            verificationCode: enteredVerificationCode.value,            
            }),
        });
    });
});



describe('helper functions within verificationCode', () => {
    it('mocked successful getUserEmail', async () => {
        const desiredEmail = "test@email.com";
        const usernamePassedIn = "test user";

         global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve({email: desiredEmail}),
            })
        )

        const returnedEmail = await verificationHandler.getUserEmail(usernamePassedIn);
        expect(returnedEmail).toBe(desiredEmail);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/getUserEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify({
            userName: usernamePassedIn   
            }),
        });
    });

    it('mocked unsuccessful getUserEmail', async () => {
        const usernamePassedIn = "test user";
        document.body.innerHTML = `
            <h4 id="feedback-message" />
        `;
      
        let feedbackMessage = document.getElementById('feedback-message');      
        feedbackMessage = 'Could not verify user';

         global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 425,
                json: () => Promise.reject(new Error('Cannot verify user')),
            })
        )
        const returnedEmail = await verificationHandler.getUserEmail(usernamePassedIn);
        expect(returnedEmail).not.toBeDefined();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/getUserEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify({
            userName: usernamePassedIn   
            }),
        });
    });

    test('test sendEmail calls emailjs.send()', () => {
        const emailjs = require('@emailjs/browser');
        const responseExpected = {response: {status: 200, text: 'OK'}};
    
        jest.mock('@emailjs/browser', () => ({
            send: jest.fn().mockImplementation(() => 
                Promise.resolve({ 
                    response: {status: 200, text: 'OK'}
                }))
        }));

        expect(verificationHandler.sendEmail("test", "test@gmail.com", "123456", emailjs)).toBe(false);
    
        expect(emailjs.send()).resolves.toEqual(responseExpected);
    });
});