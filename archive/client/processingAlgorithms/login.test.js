/**
 * @jest-environment jsdom
 */

const loginHandler = require('./login');

beforeEach(() => {
    jest.clearAllMocks();
    global.host = "http://localhost:8080";
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('getProfilePageForUser() endpoint', () => {
    it('mocked get profile page for user - successful', () => {
        const userBeingPassed = "testUser";
        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => (userBeingPassed),
            })
        )
        const response = loginHandler.getProfilePageForThisUser(userBeingPassed);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/profile', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    it('mocked get profile page for user - successful', () => {
        const userBeingPassed = "testUser";

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 404,
                json: () => Promise.reject(new Error('Error fetching profile data:')),
            })
        )
        const response = loginHandler.getProfilePageForThisUser(userBeingPassed);
        console.log("response on test end");
        console.log(response);

        expect(response).toBeUndefined();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/profile', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
});


describe('userLogin() endpoint', () => {
    it('mocked user login - successful', () => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            href: "./profile.html?name=testUser"
        };
        const userBeingPassed = "testUser";
        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => (userBeingPassed),
            })
        )
        const response = loginHandler.getProfilePageForThisUser(userBeingPassed);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/profile', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    it('mocked user login - unsuccesful account not verified', async () => {
        const event = {
            preventDefault: jest.fn()
        };

        document.body.innerHTML = `
            <input id="username-input" />
            <input id="password-input" />
            <h4 id="verificationCodeDiv" />
            <h4 id='feedback-message' />
        `;
        const usernameInput = document.getElementById('username-input');
        const passwordInput = document.getElementById('password-input');
        const verificationCodeDiv = document.getElementById('verificationCodeDiv');
        const feedbackMessage = document.getElementById('feedback-message');

        usernameInput.value = "userTest";
        passwordInput.value = "passwordTest";

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 450,
                json: () => Promise.reject(new Error('User account is not verified')),
            })
        )
        const response = await loginHandler.userLogin(event);
        console.log(feedbackMessage.innerHTML);

        expect(response).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/find-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        });
    });




    it('mocked user login - unsuccesful password reset needed', () => {
        const event = {
            preventDefault: jest.fn()
        };

        document.body.innerHTML = `
            <input id="username-input" />
            <input id="password-input" />
            <h4 id="feedback-message" />
            <div id="verificationCodeDiv" />
        `;
        const usernameInput = document.getElementById('username-input');
        const passwordInput = document.getElementById('password-input');
        const feedbackMessage = document.getElementById('feedback-message');
        const verificationCodeDiv = document.getElementById('verificationCodeDiv');

        usernameInput.value = "userTest";
        passwordInput.value = "passwordTest";

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 453,
                json: () => Promise.reject(new Error("Must reset password")),
            })
        )
        const response = loginHandler.userLogin(event);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/find-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        });
    });
    it('mocked user login - unsuccesful password lockout', () => {
        const event = {
            preventDefault: jest.fn()
        };

        document.body.innerHTML = `
            <input id="username-input" />
            <input id="password-input" />
            <h4 id="feedback-message" />
            <div id="verificationCodeDiv" />
        `;
        const usernameInput = document.getElementById('username-input');
        const passwordInput = document.getElementById('password-input');
        const feedbackMessage = document.getElementById('feedback-message');
        const verificationCodeDiv = document.getElementById('verificationCodeDiv');

        usernameInput.value = "userTest";
        passwordInput.value = "passwordTest";

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 452,
                json: () => Promise.reject(new Error("10 minute lockout")),
            })
        )
        const response = loginHandler.userLogin(event);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/find-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        });
    });
    it('mocked user login - unsuccesful generic failure', () => {
        const event = {
            preventDefault: jest.fn()
        };

        document.body.innerHTML = `
            <input id="username-input" />
            <input id="password-input" />
            <h4 id="feedback-message" />
            <div id="verificationCodeDiv" />
        `;
        const usernameInput = document.getElementById('username-input');
        const passwordInput = document.getElementById('password-input');
        const feedbackMessage = document.getElementById('feedback-message');
        const verificationCodeDiv = document.getElementById('verificationCodeDiv');

        usernameInput.value = "userTest";
        passwordInput.value = "passwordTest";

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 404,
                json: () => (new Error("Error loggin in")),
            })
        )
        const response = loginHandler.userLogin(event);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/find-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        });
    });
})