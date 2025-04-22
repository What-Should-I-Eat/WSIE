function insertRealNavbar() {
    const element: HTMLCollectionOf<Element> = document.getElementsByClassName("row navbar-row px-3");
    if (element) {
        element[0].innerHTML = `
        <nav class="navbar navbar-expand-md navbar-light">
          <a class="navbar-brand" href="/">
            <img src="/static/img/recipe-logo.svg" style="max-height: 100px" />
            <h1>What Should I Eat?</h1>
          </a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span
              class="navbar-toggler-icon"></span></button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">
                <a class="nav-link" href="/">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/about">About Us</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/recipes">Find Recipes</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/contact">Contact Us</a>
              </li>
              <li id="enable-admin-tab" class="nav-item">
              </li>
              <li id="publicProfileNavItem" class="nav-item" style="display: none;">
                <a class="nav-link" href="/public_user_profile">Public Profile</a>
              </li>
            </ul>

            <div id="navBarMyAccountSignInSignUp" class="mr-2 d-flex flex-column flex-md-row">
              <!-- Dynamically populate via login.js -->
            </div>
          </div>
        </nav>
        `;
    }
}

export {insertRealNavbar};