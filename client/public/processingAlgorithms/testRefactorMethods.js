var loginHandler2 = (() => {
    
    var togglePassword = (passwordInput, idString) => {

        var password = document.getElementById(passwordInput);
        var passwordToggler = document.getElementById(idString);
        passwordToggler.classList.toggle("bi-eye");
        if(password.type === "password"){
          password.type = "text";
        } else{
          password.type = "password";
        }
      }
    
    
    
    return {
        togglePassword,
      };
})();