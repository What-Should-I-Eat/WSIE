/**
 * @jest-environment jsdom
 */

const verificationHandler = require('./verificationCode');

beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(() => {
    jest.clearAllMocks();
});

// describe('#resendVerificationCode() endpoint', () => {
//     it('mocked resend verification code New User', async () => {

//         const updatedDataResponse = { acknowledge: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0, upsertedId: null};

//         const event = {
//             preventDefault: jest.fn()
//           };

//         document.body.innerHTML = `
//             <input id="username-input" />
//             <h4 id="feedback-message" />
//             <input id="fullname-input" />
//             <input id="email-input" />
//         `;
      
//         const username = document.getElementById('username-input');
//         const feedbackMessage = document.getElementById('feedback-message');
//         const fullName = document.getElementById('fullname-input');
//         const email = document.getElementById('email-input');
      
//         username.value = 'userTest';
//         fullName.value = 'Full Name Test';
//         email.value = 'test@test.com';

//         global.fetch = jest.fn().mockImplementationOnce(() =>
//             Promise.resolve({
//                 status: 200,
//                 json: () => Promise.resolve(JSON.stringify(updatedDataResponse)),
//             })
//         )

//         let sendEmail = jest.fn();

//         const response = await verificationHandler.resendVerificationCodeNewUser(event);

//         expect(response).toBe(updatedDataResponse);
//         expect(fetch).toHaveBeenCalledTimes(1);
//         expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/users/resendVerificationCode', {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             userName: username,
//             verificationCode: verificationCode,            
//             }),
//         });
//     });
// });


describe('#verify() endpoint', () => {
    it('mocked update verification status New User', async () => {

        const updatedDataResponse = { acknowledge: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0, upsertedId: null};

        const event = {
            preventDefault: jest.fn()
          };

        document.body.innerHTML = `
            <input id="username-input" />
            <h4 id="feedback-message" />
            <input id="fullname-input" />
            <input id="verificationCodeInput" />
            <div id="login" />
            <button id="loginButton" />
        `;
      
        const username = document.getElementById('username-input');
        const feedbackMessage = document.getElementById('feedback-message');
        const fullName = document.getElementById('fullname-input');
        const enteredVerificationCode = document.getElementById('verificationCodeInput');
        const loginDiv = document.getElementById('login');
        const loginButton = document.getElementById('loginButton');
      
        username.value = 'userTest';
        fullName.value = 'Full Name Test';
        enteredVerificationCode.value = '333333';

        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                status: 200,
                json: () => Promise.resolve(JSON.stringify(updatedDataResponse)),
            })
        )

        const response = verificationHandler.updateVerificationStatusNewUser(event);

        expect(response).toBe(updatedDataResponse);
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
});