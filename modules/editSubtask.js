import { db, objUser } from "../index.js";
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { errorHandler } from "../core.js";

export function editSubtask() {
    const elmntSubtaskInEdit = document.querySelector(".inEdit.subtask"),
        elmntCheckButton = this.querySelector(".checkButton"),
        elmntParentTask = this.parentElement.parentElement;

    if (elmntSubtaskInEdit == this || elmntCheckButton.contains(event.target) || !elmntParentTask.classList.contains("inEdit")) {
        return;
    } else if (elmntSubtaskInEdit !== null) {
        //If another task is already in edit when a new one is pressed, confirm that first before proceeding.
        closeSubtaskEdit();
    }

    const elmntTaskTitle = this.querySelector("p"),
        varIntialTaskTitle = elmntTaskTitle.innerText;

    elmntTaskTitle.style.display = "none";
    this.classList.remove("handle");
    this.classList.add("inEdit");

    var elmntTaskInputField = document.createElement("input");
    elmntTaskInputField.setAttribute("type", "text");
    elmntTaskInputField.setAttribute("enterkeyhint", "done");
    elmntTaskInputField.setAttribute("id", "input-" + this.id);
    elmntTaskInputField.setAttribute("name", "taskTitleInput");
    elmntTaskInputField.setAttribute("placeholder", "Specify subtask");
    elmntTaskInputField.setAttribute("value", varIntialTaskTitle);
    elmntTaskInputField.setAttribute("maxlength", "160");
    this.appendChild(elmntTaskInputField);
    this.insertBefore(elmntTaskInputField, this.children[1]);

    var elmntTaskInputLabel = document.createElement("label");
    elmntTaskInputLabel.setAttribute("for", "input-" + this.id);
    this.appendChild(elmntTaskInputLabel);
    this.insertBefore(elmntTaskInputLabel, this.children[2]);

    const end = elmntTaskInputField.value.length;
    elmntTaskInputField.setSelectionRange(end, end);
    elmntTaskInputField.focus();

    elmntTaskInputField.addEventListener("change", confirmSubtaskEdit);

    elmntTaskInputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            closeSubtaskEdit();
        }
    });
}

export async function deleteSubtask() {
    const elmntSubtaskElement = this.parentElement,
        elmntTaskSubColumn = elmntSubtaskElement.parentElement,
        objChildrenOfTaskSubColumn = elmntTaskSubColumn.children;

    const documentToDelete = doc(db, "userItems", objUser.uid, "Subtasks", elmntSubtaskElement.id);
    await deleteDoc(documentToDelete)
        .then(() => {
            elmntSubtaskElement.remove();

            for (let i = 0; i < objChildrenOfTaskSubColumn.length; i++) {
                const documentToUpdate = doc(db, "userItems", objUser.uid, "Subtasks", objChildrenOfTaskSubColumn[i].id);
                updateDoc(documentToUpdate, {
                    subtaskPosition: i
                }).catch(error => {
                    errorHandler(error);
                });
            };
        })
        .catch(error => {
            errorHandler(error);
        });
}

function confirmSubtaskEdit() {
    const elmntSubtaskInEdit = document.querySelector(".inEdit.subtask"),
        elmntTaskInputField = elmntSubtaskInEdit.querySelector("input"),
        elmntTaskTitle = elmntSubtaskInEdit.querySelector("p"),
        varNewTaskTitle = elmntTaskInputField.value.trim();

    if (varNewTaskTitle !== "") {
        const documentToUpdate = doc(db, "userItems", objUser.uid, "Subtasks", elmntSubtaskInEdit.id);
        updateDoc(documentToUpdate, {
            subtaskTitle: varNewTaskTitle
        })
            .then(() => {
                elmntTaskTitle.innerText = varNewTaskTitle;
            })
            .catch(error => {
                errorHandler(error);
            });
        elmntSubtaskInEdit.appendChild(elmntTaskTitle);
    }

}

export function closeSubtaskEdit() {
    const elmntSubtaskInEdit = document.querySelector(".inEdit.subtask"),
        elmntTaskInputField = elmntSubtaskInEdit.querySelector("input"),
        elmntTaskInputLabel = elmntSubtaskInEdit.querySelector("label"),
        elmntTaskTitle = elmntSubtaskInEdit.querySelector("p");

    elmntTaskInputField.remove();
    elmntTaskInputLabel.remove();
    elmntTaskTitle.style.display = "block";
    elmntSubtaskInEdit.classList.add("handle");
    elmntSubtaskInEdit.classList.remove("inEdit");
}