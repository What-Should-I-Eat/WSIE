/**
 * @jest-environment jsdom
 */

const {getUserId, getUserData, getUserNameFromCookie, getUserObject} = require('./currentUser');

beforeEach(() => {
    jest.clearAllMocks();
    global.host = "http://localhost:8080";
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('getUserId() endpoint', () => {
    it('mocked get id for user - successful', () => {
        const userBeingPassed = "testUser";
        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => (userBeingPassed),
            })
        )
        const response = getUserId(userBeingPassed);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/findUserId?username=testUser', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        });
    });
    it('mocked get id for user - unsuccessful', () => {
        const userBeingPassed = "testUser";
        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 450,
                json: () => Promise.reject(new Error('Network response was not ok')),
            })
        )
        const response = getUserId(userBeingPassed);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/findUserId?username=testUser', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        });
    });
});
describe('getUserData() endpoint', () => {
    it('mocked get data for user - successful', () => {
        const userBeingPassed = "testUser";
        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => (userBeingPassed),
            })
        )
        const response = getUserData(userBeingPassed);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/findUserData?username=testUser', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        });
    });
    it('mocked get data for user - unsuccessful', () => {
        const userBeingPassed = "testUser";
        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 450,
                json: () => Promise.reject(new Error('Network response was not ok')),
            })
        )
        const response = getUserData(userBeingPassed);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/findUserData?username=testUser', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        });
    });
});

describe('getUserObject() endpoint', () => {
    it('mocked get object for user - successful', () => {
        const userBeingPassed = "testUser";
        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => (userBeingPassed),
            })
        )
        const response = getUserObject(userBeingPassed);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/findUser/testUser', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        });
    });
    it('mocked get object for user - unsuccessful', () => {
        const userBeingPassed = "testUser";
        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 450,
                json: () => Promise.reject(new Error('Cannot find user')),
            })
        )
        const response = getUserObject(userBeingPassed);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/findUser/testUser', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        });
    });
});
describe('getUserNameFromCookie() function', () => {
    it('mocked user name from cookie - successful', () => {
        global.document.cookie = "userName=test";
        const result = getUserNameFromCookie();
        expect(result).toBe('test');
    });
});