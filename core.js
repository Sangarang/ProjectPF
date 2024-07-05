import { collection, doc, getDoc, getDocs, setDoc, orderBy, query, updateDoc } from 'firebase/firestore';
import { queryNewTask, createNewColumn, queryNewSubtask } from "./modules/intialQuery.js";
import { documentOnMouseDown, documentOnclick, columnDragEnd } from "./modules/mouseHandler.js";
import { confirmNewColumn } from "./modules/createColumn.js";
import { auth, db, objUser } from "./index.js";
import { signOut } from 'firebase/auth';

import Sortable from "sortablejs";

//Open or close menu as well as rotate expand_less icon.
document.getElementById("buttonContainer").addEventListener("click", function () {
  const elmntDropupMenu = document.getElementById("dropupMenu");

  if (elmntDropupMenu.classList.contains('show')) {
    document.getElementById("expandMoreIcon").style.transform = "rotate(0deg)";
    elmntDropupMenu.classList.remove("show");
  } else {
    document.getElementById("expandMoreIcon").style.transform = "rotate(180deg)";
    elmntDropupMenu.classList.add("show");
  }
});

document.getElementById("settingsButton").addEventListener("click", function () {
  document.getElementById("popupModalSettings").classList.add('show');
});

document.getElementById("closePopupModalSettings").addEventListener("click", function () {
  document.getElementById("popupModalSettings").classList.remove('show');
});

document.getElementById("aboutButton").addEventListener("click", function () {
  document.getElementById("popupModalAbout").classList.add('show');
});

document.getElementById("closePopupModalAbout").addEventListener("click", function () {
  document.getElementById("popupModalAbout").classList.remove('show');
});

//Add functionality to toggle hue. 
const elmntAllHueButtons = document.querySelectorAll(".hueItem");

for (let i = 0; i < elmntAllHueButtons.length; i++) {
  const node = elmntAllHueButtons[i];
  node.addEventListener("click", async function () {

    const funcHue = () => {
      if (this.classList.contains("red")) {
        return "red";
      } else if (this.classList.contains("orange")) {
        return "orange";
      } else if (this.classList.contains("green")) {
        return "green";
      } else if (this.classList.contains("blue")) {
        return "blue";
      } else if (this.classList.contains("purple")) {
        return "purple";
      } else if (this.classList.contains("black")) {
        return "black";
      }
    }

    const varHue = funcHue();

    if (!this.classList.contains("selected")) {
      const documentToUpdate = doc(db, "userItems", objUser.uid);
      await updateDoc(documentToUpdate, {
        "settings.theme.hue": varHue
      })
        .then(() => {
          document.querySelector("#hueSelectorGridContainer .selected").classList.remove("selected");
          this.classList.add("selected");

          document.documentElement.setAttribute('data-theme-hue', varHue);
          localStorage.setItem("setting_Hue", varHue);
        })
        .catch(error => {
          errorHandler(error);
        });
    }

  });
}

const elmntThemeSwitch = document.querySelector(".themeSwitch input");
//Load functionality for dark mode switch.
elmntThemeSwitch.addEventListener("change", async function () {

  const funcMode = () => {
    if (elmntThemeSwitch.checked == true) {
      return "dark";
    } else {
      return "light";
    }
  }
  const varMode = funcMode();

  const documentToUpdate = doc(db, "userItems", objUser.uid);
  await updateDoc(documentToUpdate, {
    "settings.theme.mode": varMode
  })
    .then(() => {
      document.documentElement.setAttribute('data-theme-mode', varMode);
      localStorage.setItem("setting_Mode", varMode);
    })
    .catch(error => {
      errorHandler(error);

      if (elmntThemeSwitch.checked == true) {
        elmntThemeSwitch.checked = false;
      } else {
        elmntThemeSwitch.checked = true;
      }
    });
});
//----------------------------------------------------
//Add functionality for profile picture settings.
const elmntAllProfilePictureButtons = document.querySelectorAll("#accountPictureGridContainer span");

for (let i = 0; i < elmntAllProfilePictureButtons.length; i++) {
  const node = elmntAllProfilePictureButtons[i];
  node.addEventListener("click", async function () {
    const funcProfilePicture = () => {
      if (this.classList.contains("sentiment_excited")) {
        return "sentiment_excited";
      } else if (this.classList.contains("sentiment_very_satisfied")) {
        return "sentiment_very_satisfied";
      } else if (this.classList.contains("mood")) {
        return "mood";
      } else if (this.classList.contains("sentiment_satisfied")) {
        return "sentiment_satisfied";
      } else if (this.classList.contains("sentiment_calm")) {
        return "sentiment_calm";
      } else if (this.classList.contains("sentiment_content")) {
        return "sentiment_content";
      } else if (this.classList.contains("sentiment_neutral")) {
        return "sentiment_neutral";
      } else if (this.classList.contains("sentiment_dissatisfied")) {
        return "sentiment_dissatisfied";
      } else if (this.classList.contains("sentiment_sad")) {
        return "sentiment_sad";
      } else if (this.classList.contains("mood_bad")) {
        return "mood_bad";
      } else if (this.classList.contains("sentiment_very_dissatisfied")) {
        return "sentiment_very_dissatisfied";
      } else if (this.classList.contains("sentiment_worried")) {
        return "sentiment_worried";
      } else if (this.classList.contains("sentiment_frustrated")) {
        return "sentiment_frustrated";
      } else if (this.classList.contains("sentiment_stressed")) {
        return "sentiment_stressed";
      } else if (this.classList.contains("sentiment_extremely_dissatisfied")) {
        return "sentiment_extremely_dissatisfied";
      } else if (this.classList.contains("account_circle")) {
        return "user";
      }
    }
    const varProfilePicture = funcProfilePicture();

    if (!this.classList.contains("selected")) {

      const documentToUpdate = doc(db, "userItems", objUser.uid);
      await updateDoc(documentToUpdate, {
        "settings.theme.profilePicture": varProfilePicture
      })
        .then(() => {
          document.querySelector("#accountPictureGridContainer .selected").classList.remove("selected");
          this.classList.add("selected");

          if (varProfilePicture == "user") {
            document.querySelector("#buttonContainer .accountImg").innerHTML = "<img referrerpolicy='no-referrer' src='" + objUser.photoURL + "'</img>";
            document.querySelector("#accountDetailsContainer .accountImg").innerHTML = "<img referrerpolicy='no-referrer' src='" + objUser.photoURL + "'</img>";
          } else {
            document.querySelector("#buttonContainer .accountImg").innerText = varProfilePicture;
            document.querySelector("#accountDetailsContainer .accountImg").innerText = varProfilePicture;
          }
        })
        .catch(error => {
          errorHandler(error);
        });
    }

  });
}
//------------------------------------

//If logging in for first time, create their document on Firestore.
const userDocument = doc(db, "userItems", objUser.uid),
  getUser = await getDoc(userDocument).catch((error) => {
    errorHandler(error);
  });
if (!getUser.exists()) {

  const funcProfilePicture = () => {

    if (objUser.photoURL != null) {
      document.querySelector("#buttonContainer .accountImg").innerHTML = "<img referrerpolicy='no-referrer' src='" + objUser.photoURL + "'</img>";
      document.querySelector("#accountDetailsContainer .accountImg").innerHTML = "<img referrerpolicy='no-referrer' src='" + objUser.photoURL + "'</img>";
      document.querySelector(".account_circle").classList.add("selected");

      return "user";
    } else {
      document.querySelector(".account_circle").classList.add("hide");

      document.querySelector("#buttonContainer .accountImg").innerText = "sentiment_very_satisfied";
      document.querySelector("#accountDetailsContainer .accountImg").innerText = "sentiment_very_satisfied";
      document.querySelector(".sentiment_very_satisfied").classList.add("selected");

      return "sentiment_very_satisfied";
    }
  }
  const varProfilePicture = funcProfilePicture();

  const funcMode = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return "dark";
    } else {
      return "light";
    }
  }

  const varMode = funcMode();
  document.documentElement.setAttribute('data-theme-mode', varMode)
  localStorage.setItem("setting_Mode", varMode);

  await setDoc(userDocument, {
    settings: {
      theme: {
        hue: "orange",
        mode: varMode,
        profilePicture: varProfilePicture
      }
    }
  }).catch((error) => {
    errorHandler(error);
  });

} else {

  //Check for another currently set hue value.
  let varSettingHue = getUser.data().settings.theme.hue;
  //Reset to default orange just in case an unexpected value is returned.
  if (varSettingHue !== "red" && varSettingHue !== "orange" && varSettingHue !== "green" && varSettingHue !== "blue" && varSettingHue !== "purple" && varSettingHue !== "black") {
    await updateDoc(userDocument, {
      "settings.theme.hue": "orange"
    });
    varSettingHue = "orange";
  }

  //Load in the theme.
  if (varSettingHue !== "orange") {
    document.querySelector(".hueItem.orange.selected").classList.remove("selected");
    document.querySelector("." + varSettingHue).classList.add("selected");
  }

  document.documentElement.setAttribute('data-theme-hue', varSettingHue)
  localStorage.setItem("setting_Hue", varSettingHue);

  //Load in light or dark mode.
  let varSettingMode = getUser.data().settings.theme.mode;
  if (varSettingMode !== "light" && varSettingMode !== "dark") {
    await updateDoc(userDocument, {
      "settings.theme.mode": "light"
    });
    varSettingMode = "light";
  }

  if (varSettingMode == "light") {
    elmntThemeSwitch.checked = false;
  } else if (varSettingMode == "dark") {
    elmntThemeSwitch.checked = true;
  }

  document.documentElement.setAttribute('data-theme-mode', varSettingMode)
  localStorage.setItem("setting_Mode", varSettingMode);


  //Load in profile picture.
  if (objUser.photoURL == null) {
    document.querySelector(".account_circle").classList.add("hide");
  }
  const varSettingPicture = getUser.data().settings.theme.profilePicture;

  if (varSettingPicture != "user") {
    document.querySelector("#buttonContainer .accountImg").innerText = varSettingPicture;
    document.querySelector("#accountDetailsContainer .accountImg").innerText = varSettingPicture;
    document.querySelector("." + varSettingPicture).classList.add("selected");

  } else {
    //If using provider account, e.g., Google, and have profile picture set to their own.
    document.querySelector("#buttonContainer .accountImg").innerHTML = "<img referrerpolicy='no-referrer' src='" + objUser.photoURL + "'</img>";
    document.querySelector("#accountDetailsContainer .accountImg").innerHTML = "<img referrerpolicy='no-referrer' src='" + objUser.photoURL + "'</img>";
    document.querySelector(".account_circle").classList.add("selected");

  }
}

const elmntLogOutButton = document.querySelector("#logoutButton");
elmntLogOutButton.addEventListener("click", function () {
  //Log out user
  signOut(auth).then(() => {
    // Sign-out successful.
    //Make loader revert back to orange and light mode.
    document.documentElement.setAttribute('data-theme-hue', "orange");
    localStorage.setItem("setting_Hue", "orange");
    document.documentElement.setAttribute('data-theme-mode', "light");
    localStorage.setItem("setting_Mode", "light");

    document.getElementById("loaderBackdrop").classList.remove("hide");

    document.querySelector(".appNameWatermark").style.zIndex = "2";
    window.location.replace("/welcome");
  }).catch((error) => {
    // An error happened.
  });
});

document.querySelector("#accountName").innerText = objUser.displayName;
document.querySelector("#accountEmail").innerText = objUser.email;

//-----------------------------------

//Query columns.
const objAllColumnQuery = await getDocs(query(collection(db, "userItems", objUser.uid, "Columns"), orderBy("columnPosition", "asc"))).catch((error) => {
  errorHandler(error);
});
objAllColumnQuery.forEach((doc) => {
  const objSingleQueryData = doc.data(),
    varDocId = doc.id,
    varNewColumnTitle = objSingleQueryData.columnTitle;

  createNewColumn(varNewColumnTitle, varDocId);
});

//Query tasks.
const objAllTaskQuery = await getDocs(query(collection(db, "userItems", objUser.uid, "Tasks"), orderBy("taskPosition", "asc"))).catch((error) => {
  errorHandler(error);
});
objAllTaskQuery.forEach((doc1) => {
  const objSingleQueryData = doc1.data(),
    varDocId = doc1.id,
    varColumnId = objSingleQueryData.taskColumnId,
    varTaskCompletedTime = objSingleQueryData.taskTimeCompleted,
    varTaskTitle = objSingleQueryData.taskTitle,
    varTaskProgress = objSingleQueryData.taskProgress,
    varTaskPriority = objSingleQueryData.taskPriority,
    varTaskDueDate = objSingleQueryData.taskDueDate;

  queryNewTask(varDocId, varColumnId, varTaskCompletedTime, varTaskTitle, varTaskProgress, varTaskPriority, varTaskDueDate);
});

//Query subtasks.
const objAllSubTaskQuery = await getDocs(query(collection(db, "userItems", objUser.uid, "Subtasks"), orderBy("subtaskPosition", "asc"))).catch((error) => {
  errorHandler(error);
});
objAllSubTaskQuery.forEach((doc) => {
  const objSingleQueryData = doc.data(),
    varDocId = doc.id,
    varParentTaskId = objSingleQueryData.subtaskParentTaskId,
    varTaskCompleted = objSingleQueryData.subtaskCompleted,
    varTaskTitle = objSingleQueryData.subtaskTitle;

  queryNewSubtask(varDocId, varParentTaskId, varTaskCompleted, varTaskTitle);
});



//Add functionality to new column input prompt.
document.getElementById("newColumnInput").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    confirmNewColumn();
  }
});

// Make columns sortable.
new Sortable(document.getElementById("mainContainer"), {
  animation: 150,
  handle: '.handle',
  fallbackTolerance: 3,
  delayOnTouchOnly: true,
  delay: 250,
  onStart: function (/**Event*/evt) {
    const elmntOnMouseDown = evt.item,
      elmntClicked = evt.item;

    documentOnclick(elmntClicked, elmntOnMouseDown);
  },
  onEnd: function (evt) {
    columnDragEnd();
  },
  onChoose: function (/**Event*/evt) {
    //For touch devices, vibrate when drag item chosen (As at early 2024, doesn't work for IOS Safari devices.)
    navigator.vibrate([30]);
  }
});

//------------------------------------

//Add scroll function and document mouseonclick handler.
document.onmousedown = function (e) {
  documentOnMouseDown(e);
  const elmntOnMouseDown = e.target;
  document.onclick = function (event) {
    const elmntClicked = event.target;
    documentOnclick(elmntClicked, elmntOnMouseDown);
  };
}

//------------------------------------
//Handles all known errors.
export function errorHandler(error) {
  const errorMessage = error.message || 'Unknown error';
  console.error(`Error: ${errorMessage}`);

  errorPopup(errorMessage);

}

//Handles errors not caught by existing catchers (the rare ones).
window.addEventListener('error', (event) => {
  const errorMessage = event.reason.message || 'Unknown error';
  console.error(`Unhandled promise rejection: ${errorMessage}`);

  errorPopup(errorMessage);
});


function errorPopup(errorMessage) {
  const elmntPopupModalError = document.querySelector("#popupModalError"),
    elmntErrorMessage = elmntPopupModalError.querySelector(".errorMessage"),
    elmntClosePopupModalError = elmntPopupModalError.querySelector(".closePopupModal");

  elmntPopupModalError.classList.remove("hide");
  elmntErrorMessage.innerText = errorMessage;

  elmntClosePopupModalError.addEventListener("click", function () {
    elmntPopupModalError.classList.add("hide");

    const elmntAllInputs = document.querySelectorAll("input");
    for (var i = 0; i < elmntAllInputs.length; i++) {
      if (elmntAllInputs[i].type == "text") {
        elmntAllInputs[i].value = "";
      }
    }
  })
}

//------------------------------------

document.getElementById("loaderBackdrop").classList.add("hide");
//Place watermark behind everything after loader hides.
document.querySelector(".appNameWatermark").style.zIndex = "-1";