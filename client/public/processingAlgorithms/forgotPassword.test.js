/**
 * @jest-environment jsdom
 */

const loginHandler = require('./forgotPassword');

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