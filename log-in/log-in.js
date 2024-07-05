import { auth } from "../index.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, setPersistence, inMemoryPersistence, sendPasswordResetEmail } from 'firebase/auth';

const elmntLoginAndSignupHeaders = document.querySelectorAll(".header");

for (let i = 0; i < elmntLoginAndSignupHeaders.length; i++) {
    const node = elmntLoginAndSignupHeaders[i];
    node.addEventListener("click", async function () {

        if (!this.classList.contains("selected")) {
            const elmntPreviouslySelectedHeader = document.querySelector(".selected"),
                elmntLoginContainer = document.querySelector(".loginContainer"),
                elmntSignupContainer = document.querySelector(".signupContainer");

            elmntPreviouslySelectedHeader.classList.remove("selected");
            this.classList.add("selected");
            if (this.classList.contains("signup")) {
                elmntLoginContainer.classList.add("hide");
                elmntSignupContainer.classList.remove("hide");
            } else if (this.classList.contains("login")) {
                elmntSignupContainer.classList.add("hide");
                elmntLoginContainer.classList.remove("hide");
            }
        }
    }
    );
}

const elmntPasswordSignupInput = document.querySelector("#passwordSignupInput"),
    length = document.getElementById("length");

elmntPasswordSignupInput.oninput = function () {
    // Validate length
    if (elmntPasswordSignupInput.value.length >= 12) {
        length.classList.remove("invalid");
        length.classList.add("valid");
    } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
    }
}

const elmntLoginForm = document.querySelector(".loginForm");
elmntLoginForm.addEventListener('submit', event => {
    event.preventDefault();
    loginWithPassword();
});

const elmntSignupForm = document.querySelector(".signupForm");
elmntSignupForm.addEventListener('submit', event => {
    event.preventDefault();
    signupWithPassword();
});


function signupWithPassword() {
    const elmntEmailSignupInput = document.querySelector("#emailSignupInput"),
        elmntPasswordRepeatSignupInput = document.querySelector("#confirmPasswordSignupInput"),
        elmntPasswordInitialSignupInput = document.querySelector("#passwordSignupInput"),
        varEmailInputValue = elmntEmailSignupInput.value,
        varPasswordInitialInputValue = elmntPasswordInitialSignupInput.value,
        varPasswordRepeatInputValue = elmntPasswordRepeatSignupInput.value;

    if (varPasswordInitialInputValue === varPasswordRepeatInputValue) {
        createUserWithEmailAndPassword(auth, varEmailInputValue, varPasswordRepeatInputValue)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
            })
            .catch((error) => {
                errorHandlerAuth(error);
            });
    } else {
        const elmntErrorContainer = document.querySelector(".errorMessage");
        elmntErrorContainer.innerText = "Password doesn't match.";
    }
}



function loginWithPassword() {
    const elmntEmailLoginInput = document.querySelector("#emailLoginInput"),
        elmntPasswordLoginInput = document.querySelector("#passwordLoginInput"),
        varEmailInputValue = elmntEmailLoginInput.value,
        varPasswordInputValue = elmntPasswordLoginInput.value;

    signInWithEmailAndPassword(auth, varEmailInputValue, varPasswordInputValue)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            errorHandlerAuth(error);
        });
}

const elmntLoginButtonGoogle = document.querySelector(".loginButton.google")
elmntLoginButtonGoogle.addEventListener("click", googleLogin);

function googleLogin() {
    setPersistence(auth, inMemoryPersistence)
        .then(async () => {
            const provider = new GoogleAuthProvider();
            // In memory persistence will be applied to the signed in Google user
            // even though the persistence was set to 'none' and a page redirect
            // occurred.
            return signInWithRedirect(auth, provider);
        })
        .catch((error) => {
            errorHandlerAuth(error);
        });
}

//elmntLoginButtonFacebook.addEventListener("click", facebooklogin);

function facebooklogin() {
    setPersistence(auth, inMemoryPersistence)
        .then(async () => {
            const provider = new FacebookAuthProvider();

            // In memory persistence will be applied to the signed in Google user
            // even though the persistence was set to 'none' and a page redirect
            // occurred.

            return signInWithRedirect(auth, provider);

        })
        .catch((error) => {
            // Handle Errors here.
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = FacebookAuthProvider.credentialFromError(error);
            errorHandlerAuth(error);
        });
}
//----------------------------------------------
const elmntForgotPasswordButton = document.querySelector(".forgotPasswordButton"),
    elmntResetPasswordForm = document.querySelector(".resetPasswordForm");
elmntForgotPasswordButton.addEventListener('click', function () {
    elmntResetPasswordForm.classList.remove("hide");
});

elmntResetPasswordForm.addEventListener('submit', event => {
    event.preventDefault();
    resetPassword();
});

function resetPassword() {
    const elmntResetPasswordEmailInput = document.querySelector("#resetPasswordEmailInput"),
        varEmailInputValue = elmntResetPasswordEmailInput.value;

    sendPasswordResetEmail(auth, varEmailInputValue)
        .then(() => {
            // Password reset email sent!
            const elmntErrorContainer = document.querySelector(".errorMessage");
            const clone = elmntErrorContainer.cloneNode(true);

            const elmntLoginContainer = document.querySelector(".loginContainer");

            clone.classList.remove("hide", "errorMessage");
            clone.classList.add("resetLinkSentSuccess");
            clone.innerHTML = "Success! If the account exists, <br> you will receive an email with further instructions."
            elmntLoginContainer.appendChild(clone);


        })
        .catch((error) => {
            errorHandlerAuth(error);
        });
}



//----------------------------------------------

const elmntAllInputs = document.querySelectorAll("input");
for (let i = 0; i < elmntAllInputs.length; i++) {
    elmntAllInputs[i].addEventListener("oninput", function () {
        const elmntErrorContainer = document.querySelector(".errorMessage");
        elmntErrorContainer.innerText = "";
    });
}

document.onclick = function (event) {
    const elmntErrorContainer = document.querySelector(".errorMessage");
    elmntErrorContainer.innerText = "";
};

function errorHandlerAuth(error) {
    const errorMessage = error.message || 'Unknown error';
    console.log(`Error: ${errorMessage}`);

    const elmntErrorContainer = document.querySelector(".errorMessage");

    if (error.code == 'auth/email-already-in-use') {
        elmntErrorContainer.innerText = "An account already exists with that email.";
    } else if (error.code == 'auth/invalid-email') {
        elmntErrorContainer.innerText = "Invalid email.";
    } else if (error.code == 'auth/invalid-credential') {
        elmntErrorContainer.innerText = "Invalid/incorrect credentials.";
    } else if (error.code == 'auth/too-many-requests') {
        elmntErrorContainer.innerText = "Too many attempts. Please try later.";
    } else {
        elmntErrorContainer.innerText = error.code;
    }
}

//---------------------------------------