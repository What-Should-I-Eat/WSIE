/**
 * @jest-environment jsdom
 */

const profile2 = require("./testProfileMethods");

describe('Get Edamam name for restrictions', () => {
    test('test example', () => {
        expect(profile2.getEdamamNameOfRestriction('Dairy')).toBe('dairy-free');
    });

});

describe('senddiet data endpoint', () => {
    it('mock sending dietData', async () => {
        jest.clearAllMocks();
        global.host = "http://localhost:8080";

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200
            })
        )

        const dietData = {
            username: "testUsername",
            diet: ['low-carb']
        }
        await profile2.sendDietData(dietData);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/diet', {
            body: JSON.stringify(dietData),
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    });
    jest.clearAllMocks();
});

describe('send health data endpoint', () => {
    it('mock sending healthData', async () => {
        jest.clearAllMocks();
        global.host = "http://localhost:8080";

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200
            })
        )

        const healthData = {
            username: "testUsername",
            diet: ['glutten']
        }
        await profile2.sendHealthData(healthData);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/health', {
            body: JSON.stringify(healthData),
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    });
    jest.clearAllMocks();
});

describe('PUTintoDatabase', () => {
        profile2.getDietRestrictions = jest.fn().mockReturnValue(['low-carb']);
        profile2.getHealthRestrictions = jest.fn().mockReturnValue(['gluten-free']);
        profile2.sendDietData = jest.fn();
        profile2.sendHealthData = jest.fn();


    test('successfully calls sendDietData and sendHealthData with correct data', async () => {
        const username = 'testuser';

        // Perform the operation
        await profile2.PUTintoDatabase(username);

        // Assertions
        expect(profile2.sendDietData).toHaveBeenCalledWith({
            username: username,
            diet: ['low-carb'],
        });
        expect(profile2.sendHealthData).toHaveBeenCalledWith({
            username: username,
            health: ['gluten-free'],
        });
    });
});