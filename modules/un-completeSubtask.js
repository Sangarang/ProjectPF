import { db, objUser } from "../index.js";
import { errorHandler } from "../core.js";
import { doc, updateDoc } from 'firebase/firestore';
import { editSubtask, deleteSubtask, closeSubtaskEdit } from "./editSubtask.js";

export async function completeSubtask() {
    const elmntCompletedSubtask = this.parentElement;

    if (elmntCompletedSubtask.classList.contains('inEdit')) {
        closeSubtaskEdit();
    }

    const documentToUpdate = doc(db, "userItems", objUser.uid, "Subtasks", elmntCompletedSubtask.id);
    await updateDoc(documentToUpdate, {
        subtaskCompleted: true
    })
        .then(() => {
            this.removeEventListener("click", completeSubtask);
            elmntCompletedSubtask.removeEventListener("click", editSubtask);

            elmntCompletedSubtask.classList.add("taskCompleted");

            var elmntDeleteTaskButton = document.createElement("div");
            elmntDeleteTaskButton.classList.add("deleteTaskButton");
            elmntDeleteTaskButton.addEventListener("click", deleteSubtask);
            elmntCompletedSubtask.appendChild(elmntDeleteTaskButton);
            elmntCompletedSubtask.insertBefore(elmntDeleteTaskButton, elmntCompletedSubtask.children[2]);

            this.addEventListener("click", uncompleteSubtask);
        })
        .catch(error => {
            errorHandler(error);
        });
}

export async function uncompleteSubtask() {
    const elmntCompletedSubtask = this.parentElement,
        elmntDeleteTaskButton = elmntCompletedSubtask.querySelector(".deleteTaskButton");

    const documentToUpdate = doc(db, "userItems", objUser.uid, "Subtasks", elmntCompletedSubtask.id);
    await updateDoc(documentToUpdate, {
        subtaskCompleted: false
    })
        .then(() => {
            this.removeEventListener("click", uncompleteSubtask);
            this.addEventListener("click", completeSubtask);

            elmntCompletedSubtask.addEventListener("click", editSubtask);
            elmntCompletedSubtask.classList.remove("taskCompleted");

            elmntDeleteTaskButton.remove();
        })
        .catch(error => {
            errorHandler(error);
        });
}