/**
 * @jest-environment jsdom
 */

const profile2 = require("./testProfileMethods");

describe('Get Edamam name for restrictions', () => {
    test('test example', () => {
        expect(profile2.getEdamamNameOfRestriction('Dairy')).toBe('dairy-free');
    });

});

describe('getUsername', () => {
    test('retrieves the username correctly', () => {
        document.getElementById = jest.fn().mockImplementation((id) => {
            if (id === "user-identification") {
                return {textContent: "TestUser"};
            }

    const username = profile2.getUsername();
    expect(profile2.getUsername()).toBe("TestUser");
    jest.clearAllMocks();
    });

});

describe('PUTintoDatabase', () => {
        profile2.getDietRestrictions = jest.fn().mockReturnValue(['low-carb']);
        profile2.getHealthRestrictions = jest.fn().mockReturnValue(['gluten-free']);


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

