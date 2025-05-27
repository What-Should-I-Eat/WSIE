import { insertRealNavbar } from './dynamic-navbar';


function setupHTML() {
    document.body.innerHTML = `
            <div class="row navbar-row px-3">
                <div>Old content</div>
            </div>
        `;
}

describe('insertRealNavbar function', () => {
    beforeEach(() => {
        setupHTML();
        insertRealNavbar();
    });

    const getNavbarContainer = () => document.getElementsByClassName("row navbar-row px-3")[0];

    it('should replace old content with the real navbar', () => {
        const navbar: NonNullable<Element> | false  = getNavbarContainer().querySelector('nav.navbar') || false;
        expect(navbar).toBeTruthy();
        if(!!navbar) {
            expect(navbar.classList.contains('navbar-expand-md')).toBe(true);
            expect(navbar.classList.contains('navbar-light')).toBe(true);
        }
    });

    it('should have correct brand section', () => {
        const brand: NonNullable<Element> | false = getNavbarContainer().querySelector('.navbar-brand') || false;
        expect(brand).toBeTruthy();
        if(!!brand) {
            expect(brand.getAttribute('href')).toBe('/');

            const logo: NonNullable<HTMLImageElement> | false = brand.querySelector('img') || false;
            expect(logo).toBeTruthy();
            if (!!logo) {
                expect(logo.getAttribute('src')).toBe('/static/img/recipe-logo.svg');
                expect(logo.style.maxHeight).toBe('100px');
            }

            const title: NonNullable<HTMLHeadingElement> | false = brand.querySelector('h1') || false;
            expect(title).toBeTruthy();
            if (!!title) {
                expect(title.textContent).toBe('What Should I Eat?');
            }
        }
    });

    it('should have navbar toggler button', () => {
        const button: NonNullable<Element> | false = getNavbarContainer().querySelector('.navbar-toggler') || false;
        expect(button).toBeTruthy();
        if(!!button) {
            expect(button.getAttribute('data-toggle')).toBe('collapse');
            expect(button.getAttribute('data-target')).toBe('#navbarSupportedContent');
            expect(button.querySelector('.navbar-toggler-icon')).toBeTruthy();
        }
    });

    it('should have correct navigation links', () => {
        const links: NodeListOf<Element> = getNavbarContainer().querySelectorAll('.nav-link');
        expect(links.length).toBe(5);

        expect(links[0].textContent).toBe('Home');
        expect(links[0].getAttribute('href')).toBe('/');

        expect(links[1].textContent).toBe('About Us');
        expect(links[1].getAttribute('href')).toBe('/about');

        expect(links[2].textContent).toBe('Find Recipes');
        expect(links[2].getAttribute('href')).toBe('/recipes');

        expect(links[3].textContent).toBe('Contact Us');
        expect(links[3].getAttribute('href')).toBe('/contact');
    });

    it('should have admin tab placeholder', () => {
        const adminTab: NonNullable<Element> | false = getNavbarContainer().querySelector('#enable-admin-tab') || false;
        expect(adminTab).toBeTruthy();
        if(!!adminTab) {
            expect(adminTab.classList.contains('nav-item')).toBe(true);
        }
    });

    it('should have hidden public profile link', () => {
        const profileItem: NonNullable<HTMLElement> | false = getNavbarContainer().querySelector('#publicProfileNavItem') as HTMLElement || false;
        expect(profileItem).toBeTruthy();
        if(!!profileItem) {
            expect(profileItem.style.display).toBe('none');
            const link: NonNullable<Element> | false = profileItem.querySelector('.nav-link') || false;
            if (!!link) {
                expect(link.textContent).toBe('Public Profile');
                expect(link.getAttribute('href')).toBe('/public_user_profile');
            }
        }
    });

    it('should have account section', () => {
        const accountSection: NonNullable<Element> | false = getNavbarContainer().querySelector('#navBarMyAccountSignInSignUp') || false;
        expect(accountSection).toBeTruthy();
        if(!!accountSection) {
            expect(accountSection.classList.contains('mr-2')).toBe(true);
            expect(accountSection.classList.contains('d-flex')).toBe(true);
            expect(accountSection.classList.contains('flex-column')).toBe(true);
            expect(accountSection.classList.contains('flex-md-row')).toBe(true);
        }
    });
});