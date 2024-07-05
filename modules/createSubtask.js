import { editSubtask } from "./editSubtask.js";
import { completeSubtask } from "./un-completeSubtask.js";
import { db, objUser } from "../index.js";
import { addDoc, collection } from 'firebase/firestore';
import { errorHandler } from "../core.js";

export async function confirmNewSubtask() {
    const elmntSubtaskInCreation = document.querySelector(".subtask.createTaskPrompt"),
        elmntNewTaskInputField = elmntSubtaskInCreation.querySelector("input"),
        varNewTaskTitle = elmntNewTaskInputField.value.trim(),
        elmntTaskSubContainer = elmntSubtaskInCreation.parentElement.querySelector(".taskSubContainer"),
        objChildrenOfTaskSubContainer = elmntTaskSubContainer.children;

    if (varNewTaskTitle === "") {
        return;
    }

    await addDoc(collection(db, "userItems", objUser.uid, "Subtasks"), {
        subtaskParentTaskId: elmntTaskSubContainer.parentElement.id,
        subtaskPosition: objChildrenOfTaskSubContainer.length - 1,
        subtaskTitle: varNewTaskTitle,
        subtaskCompleted: false
    })
        .then((docRef) => {
            var elmntNewTask = document.createElement("div");
            elmntNewTask.classList.add("subtask");
            elmntNewTask.classList.add("handle");
            elmntNewTask.addEventListener("click", editSubtask);

            var elmntCheckBox = document.createElement("div");
            elmntCheckBox.classList.add("checkButton");
            elmntCheckBox.addEventListener("click", completeSubtask);
            elmntNewTask.appendChild(elmntCheckBox);

            var elmntTaskTitle = document.createElement("p");
            elmntTaskTitle.innerText = varNewTaskTitle;
            elmntNewTask.appendChild(elmntTaskTitle);

            var elmntDragHandle = document.createElement("div");
            elmntDragHandle.classList.add("dragHandle");
            elmntNewTask.appendChild(elmntDragHandle);

            elmntTaskSubContainer.appendChild(elmntNewTask);

            elmntNewTaskInputField.value = "";

            elmntNewTask.setAttribute("id", docRef.id);
        })
        .catch(error => {
            errorHandler(error);

            elmntNewTaskInputField.value = "";
        });
}


