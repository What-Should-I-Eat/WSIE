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

// describe('PUTintoDatabase', () => {
//         profile2.getDietRestrictions = jest.fn().mockReturnValue(['low-carb']);
//         profile2.getHealthRestrictions = jest.fn().mockReturnValue(['gluten-free']);
//         profile2.sendDietData = jest.fn();
//         profile2.sendHealthData = jest.fn();
//
//
//     test('successfully calls sendDietData and sendHealthData with correct data', async () => {
//         const username = 'testuser';
//
//         // Perform the operation
//         await profile2.PUTintoDatabase(username);
//
//         // Assertions
//         expect(profile2.sendDietData).toHaveBeenCalledWith({
//             username: username,
//             diet: ['low-carb'],
//         });
//         expect(profile2.sendHealthData).toHaveBeenCalledWith({
//             username: username,
//             health: ['gluten-free'],
//         });
//     });
// });

describe('Button Click Tests', () => {
    beforeEach(() => {
        // Reset the DOM
        document.body.innerHTML = '';

        // Set up the HTML structure as per your application's needs
        document.body.innerHTML = `
      <div id="user-health-1" class="health-container-1">
          <button class="vegan-button">Vegan</button>
          <button class="lowcarb-button">Low Carb</button>
          <button class="gluten-button">Gluten</button>
          <button class="highprotein-button">High Protein</button> 
      </div>
    `;

        // Mock any necessary functions
        global.getUserNameFromCookie = jest.fn(() => 'testUser');
        global.getUserData = jest.fn(() => Promise.resolve({
            diet: [],
            health: ['vegan']
        }));
        global.fetch = jest.fn(() => Promise.resolve({ ok: true }));

        global.restrictionsHandler = {
            // handleRestrictions: jest.fn(),
            getHealthRestrictions: jest.fn().mockReturnValue(['vegan', 'gluten-free']),
            getDietRestrictions: jest.fn().mockReturnValue(['low-carb', 'high-protein']),
            // Add any other methods or properties you need to mock
        };
    });

    test('Clicking the "Vegan" button toggles its selection', () => {
        const veganButton = document.querySelector('.vegan-button');

        const mockHealthArray = ['vegan'];


        expect(restrictionsHandler.getHealthRestrictions()).toContain('vegan');

        veganButton.click();

        expect(veganButton.classList.contains('selected')).toBeFalsy();
    });

});


describe('sendDietData', () => {
    test('sends correct diet data', async () => {
        const dietData = { username: 'testUser', diet: 'vegan' };
        await profile2.sendDietData(dietData);
        expect(fetch).toHaveBeenCalledWith(`${host}/api/v1/users/diet`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dietData),
        });
    });
});

describe('sendHealthData', () => {
    test('sends correct health data', async () => {
        const healthData = { username: 'testUser', health: 'low-sugar' };
        await profile2.sendHealthData(healthData);
        expect(fetch).toHaveBeenCalledWith(`${host}/api/v1/users/health`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(healthData),
        });
    });
});

// describe('#PUTintoDatabase', () => {
//     beforeEach(() => {
//         // Reset mocks before each test
//         jest.clearAllMocks();
//         global.host = "http://localhost:8080";
//
//         // Mock fetch to handle both diet and health data calls
//         global.fetch = jest.fn()
//             .mockResolvedValueOnce({
//                 status: 200,
//                 json: () => Promise.resolve("First call response")
//             })
//             .mockResolvedValueOnce({
//                 status: 200,
//                 json: () => Promise.resolve("Second call response")
//             });
//
//         // Mock dependency functions to return expected values
//         profile2.getDietRestrictions = jest.fn().mockReturnValue(['low-carb']);
//         profile2.getHealthRestrictions = jest.fn().mockReturnValue(['gluten-free']);
//     });

// test('should call fetch with correct parameters for diet and health data', async () => {
//     const username = 'testuser';
//
//     const dietData = {
//         username: username,
//         diet: profile2.getDietRestrictions(),
//     };
//     const healthData = {
//         username: username,
//         health: profile2.getHealthRestrictions(),
//     };
//
//     await profile2.PUTintoDatabase(username);
//
//     expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/diet', {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(dietData),
//     });
//
//     expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/health', {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(healthData),
//     });
//
//     // Verify fetch was called twice
//     expect(fetch).toHaveBeenCalledTimes(2);
// });
//     test('handles username correctly', async () => {
//         await profile2.PUTintoDatabase('testUser');
//         // Expect fetch to have been called twice (once for diet data, once for health data)
//         expect(fetch).toHaveBeenCalledTimes(2);
//     });
// });


