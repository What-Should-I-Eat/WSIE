import { insertRealNavbar } from "./dynamic-navbar";

jest.mock("./dynamic-navbar");

describe('onload-list', () => {
    beforeEach(() => {
        require('./onload-list');
        const handler: NonNullable<typeof window.onload> | false = window.onload || false;
        expect(handler).toBeTruthy();
        if (!!handler) {
            handler.call(window, new Event('load'));
        }
    });

    it('should call insertRealNavbar on window load', () => {
        expect(insertRealNavbar).toHaveBeenCalled();
    });
});