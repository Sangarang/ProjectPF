// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getAnalytics } from 'firebase/analytics';
import { getAuth, onAuthStateChanged, sendEmailVerification, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB230IJ8rYMvHDaAI-JHWMuxDoboFNQ8dI",
  authDomain: "projectpf.app",
  projectId: "project-productive-feline",
  storageBucket: "project-productive-feline.appspot.com",
  messagingSenderId: "302590284101",
  appId: "1:302590284101:web:dc756c8aae5b49d72eee2c",
  measurementId: "G-L7L8Q06N63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig),
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider('6LcG_a4nAAAAAMdPLXQOleiKpP4n2-wS5H4iWX3U'),
    isTokenAutoRefreshEnabled: true // Set to true to allow auto-refresh.
  }),
  analytics = getAnalytics(app);

export const auth = getAuth(app),
  db = getFirestore(app);

export let objUser;

//-------------------------------

const varHue = localStorage.getItem("setting_Hue");
document.documentElement.setAttribute('data-theme-hue', varHue);

const varMode = localStorage.getItem("setting_Mode");
document.documentElement.setAttribute('data-theme-mode', varMode);

//-------------------------------

//Check if a user is signed in already.
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.emailVerified == false) {
      if (!document.URL.endsWith("verify-email/")) {
        sendEmailVerification(auth.currentUser)
          .then(() => {
            window.location.replace("/verify-email");
          });

      } else if (document.URL.endsWith("verify-email/")) {

        const elmntMessage = document.querySelector(".mainContainer span.email");
        elmntMessage.innerHTML = user.email;

        const elmntLogoutButton = document.querySelector(".logoutButton");

        elmntLogoutButton.addEventListener("click", function () {
          //Log out user
          signOut(auth).then(() => {
            // Sign-out successful.
            window.location.replace("/welcome");
          }).catch((error) => {
            // An error happened.
          });
        });


      }
    } else if (user.emailVerified == true) {
      if (document.URL.endsWith("verify-email/") || document.URL.endsWith("log-in/")) {
        window.location.replace("/");
      } else {
        objUser = user;
        // Note that because a network request is involved, some indication
        // of loading would need to be shown in a production-level site/app.
        import(/* webpackChunkName: "print" */ './core');
      }
    }


  } else {
    if (document.URL.endsWith("log-in/")) {

      const elmntLoader = document.querySelector("#loaderBackdrop");
      elmntLoader.classList.add("hide");

    } else {
      window.location.replace("/welcome");
    }
  }
});
//----------------------------------

