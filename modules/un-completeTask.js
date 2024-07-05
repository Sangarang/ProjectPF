import { db, objUser } from "../index.js";
import { errorHandler } from "../core.js";
import { doc, updateDoc } from 'firebase/firestore';
import { editTask, deleteTask, closeTaskEdit } from "./editTask.js";

export async function completeTask() {
    const elmntCompletedTask = this.parentElement.parentElement,
        elmntTaskHeaderContainer = elmntCompletedTask.querySelector(".taskHeaderContainer"),
        varTime = new Date();

    if (elmntCompletedTask.classList.contains('inEdit')) {
        closeTaskEdit();
    }

    const documentToUpdate = doc(db, "userItems", objUser.uid, "Tasks", elmntCompletedTask.id);
    await updateDoc(documentToUpdate, {
        taskTimeCompleted: varTime,
    })
        .then(() => {
            this.removeEventListener("click", completeTask);
            elmntCompletedTask.removeEventListener("click", editTask);

            elmntCompletedTask.classList.add("taskCompleted");

            var elmntDateCompletedContainer = document.createElement("div");
            elmntDateCompletedContainer.classList.add("dateCompletedContainer");
            elmntCompletedTask.appendChild(elmntDateCompletedContainer);

            var elmntDateCompletedIcon = document.createElement("div");
            elmntDateCompletedIcon.classList.add("dateCompletedIcon");
            elmntDateCompletedContainer.appendChild(elmntDateCompletedIcon);

            var elmntDateCompletedContainerText = document.createElement("small");
            elmntDateCompletedContainerText.innerText = varTime.toDateString() + ' ' + varTime.toLocaleTimeString();
            elmntDateCompletedContainer.appendChild(elmntDateCompletedContainerText);

            var elmntDeleteTaskButton = document.createElement("div");
            elmntDeleteTaskButton.classList.add("deleteTaskButton");
            elmntDeleteTaskButton.addEventListener("click", deleteTask);
            elmntTaskHeaderContainer.appendChild(elmntDeleteTaskButton);

            this.addEventListener("click", uncompleteTask);
        })
        .catch(error => {
            errorHandler(error);
        });
}

export async function uncompleteTask() {
    const elmntCompletedTask = this.parentElement.parentElement,
        elmntDeleteTaskButton = elmntCompletedTask.querySelector(".deleteTaskButton"),
        elmntDateCompletedContainer = elmntCompletedTask.querySelector(".dateCompletedContainer");

    const documentToUpdate = doc(db, "userItems", objUser.uid, "Tasks", elmntCompletedTask.id);
    await updateDoc(documentToUpdate, {
        taskTimeCompleted: null,
    })
        .then(() => {
            this.removeEventListener("click", uncompleteTask);
            this.addEventListener("click", completeTask);

            elmntCompletedTask.addEventListener("click", editTask);
            elmntCompletedTask.classList.remove("taskCompleted");

            elmntDeleteTaskButton.remove();
            elmntDateCompletedContainer.remove();
        })
        .catch(error => {
            errorHandler(error);
        });
}