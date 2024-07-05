import { db, objUser } from "../index.js";
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { confirmNewSubtask } from "./createSubtask.js";
import { errorHandler } from "../core.js";

export function editTask() {
    const elmntTaskInEdit = document.querySelector(".inEdit.task"),
        elmntClicked = event.target;

    if (elmntTaskInEdit == this || elmntClicked.classList.contains("checkButton") || elmntClicked.classList.contains("deleteTaskButton")) {
        return;
    } else if (elmntTaskInEdit !== null) {
        //If another task is already in edit when a new one is pressed, confirm that first before proceeding.
        closeTaskEdit();
    }

    const elmntTaskTitle = this.querySelector("p"),
        elmntTaskHeaderContainer = this.querySelector(".taskHeaderContainer"),
        objSubtasks = this.querySelectorAll(".subtask"),
        varIntialTaskTitle = elmntTaskTitle.innerText;

    elmntTaskTitle.style.display = "none";
    this.classList.remove("handle", "priorityStatusEnabled");
    this.classList.add("inEdit");

    var elmntTaskInputField = document.createElement("input");
    elmntTaskInputField.setAttribute("type", "text");
    elmntTaskInputField.setAttribute("enterkeyhint", "done");
    elmntTaskInputField.setAttribute("id", "input-" + this.parentElement.id);
    elmntTaskInputField.setAttribute("name", "taskTitleInput");
    elmntTaskInputField.setAttribute("placeholder", "Specify task");
    elmntTaskInputField.setAttribute("value", varIntialTaskTitle);
    elmntTaskInputField.setAttribute("maxlength", "160");
    elmntTaskHeaderContainer.appendChild(elmntTaskInputField);
    elmntTaskInputField.addEventListener("change", confirmTaskEdit);

    const end = elmntTaskInputField.value.length;
    elmntTaskInputField.setSelectionRange(end, end);
    elmntTaskInputField.focus();

    elmntTaskInputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            closeTaskEdit();
        }
    });

    var elmntTaskInputLabel = document.createElement("label");
    elmntTaskInputLabel.setAttribute("for", "input-" + this.parentElement.id);
    elmntTaskHeaderContainer.appendChild(elmntTaskInputLabel);

    //Enable draggable for subtasks.
    for (let i = 0; i < objSubtasks.length; i++) {
        const elmntSubtask = objSubtasks[i];
        elmntSubtask.classList.add("handle");
    };

    //Open subtask creator.
    var elmntNewSubtask = document.createElement("div");
    elmntNewSubtask.classList.add("subtask", "createTaskPrompt");
    this.appendChild(elmntNewSubtask);

    var elmntCheckBox = document.createElement("div");
    elmntCheckBox.classList.add("checkButton");
    elmntNewSubtask.appendChild(elmntCheckBox);

    var taskTitleInput = document.createElement("input");
    taskTitleInput.setAttribute("type", "text");
    taskTitleInput.setAttribute("enterkeyhint", "done");
    taskTitleInput.setAttribute("id", "input-sub-" + this.parentElement.id);
    taskTitleInput.setAttribute("name", "taskTitleInput");
    taskTitleInput.setAttribute("placeholder", "Add subtask");
    taskTitleInput.setAttribute("maxlength", "160");
    elmntNewSubtask.appendChild(taskTitleInput);

    var taskTitleInputLabel = document.createElement("label");
    taskTitleInputLabel.setAttribute("for", "input-sub-" + this.parentElement.id);
    elmntNewSubtask.appendChild(taskTitleInputLabel);

    taskTitleInput.addEventListener("change", confirmNewSubtask);

    //Create priority and due date input container.

    var taskPriorityAndDueDateInputContainer = document.createElement("div");
    taskPriorityAndDueDateInputContainer.classList.add("taskPriorityAndDueDateInputContainer");
    this.appendChild(taskPriorityAndDueDateInputContainer);

    //Open priority editor.

    var taskPriorityInputContainer = document.createElement("div");
    taskPriorityInputContainer.classList.add("taskPriorityInputContainer");
    taskPriorityAndDueDateInputContainer.appendChild(taskPriorityInputContainer);

    const arrayPriority = ["lower", "low", "null", "medium", "high", "higher"],
        elmntCurrentPriority = this.querySelector(".priorityIcon");

    arrayPriority.forEach(function (item) {

        var selectBackdropContainer = document.createElement("div");
        selectBackdropContainer.classList.add("selectBackdropContainer");
        taskPriorityInputContainer.appendChild(selectBackdropContainer);

        var taskPriorityButton = document.createElement("div");
        taskPriorityButton.classList.add("priority-" + item, "taskPriorityButton");
        taskPriorityButton.addEventListener("click", confirmTaskPriorityEdit);
        selectBackdropContainer.appendChild(taskPriorityButton);

        if (elmntCurrentPriority.classList.contains("priority-" + item)) {
            selectBackdropContainer.classList.add("selected");
        }

    })

    //Open due date editor.
    const elmntCurrentTaskDueDateContainer = this.querySelector(".taskDueDateContainer"),
        elmntTaskDueDateInputContainer = elmntCurrentTaskDueDateContainer.cloneNode(true),
        varCurrentDueDate = elmntCurrentTaskDueDateContainer.getAttribute("data-duedate");

    taskPriorityAndDueDateInputContainer.appendChild(elmntTaskDueDateInputContainer);
    elmntTaskDueDateInputContainer.className = "taskDueDateInputContainer taskDueDate";

    var elmntTaskDueDateInput = document.createElement("input");
    elmntTaskDueDateInput.classList.add("taskDueDateInput");
    elmntTaskDueDateInput.setAttribute("type", "date");
    elmntTaskDueDateInput.addEventListener("change", confirmTaskDueDateEdit);
    elmntTaskDueDateInputContainer.appendChild(elmntTaskDueDateInput);

    if (varCurrentDueDate != null) {

        const objCurrentDueDate = new Date(varCurrentDueDate);

        function formatDate(objCurrentDueDate) {
            // Extract year, month, and day from the Date object
            const year = objCurrentDueDate.getFullYear();
            // Months are zero-indexed, so add 1 to get the correct month
            const month = String(objCurrentDueDate.getMonth() + 1).padStart(2, '0');
            const day = String(objCurrentDueDate.getDate()).padStart(2, '0');

            // Return the formatted date string
            return `${year}-${month}-${day}`;
        }

        const varFormattedDueDate = formatDate(objCurrentDueDate);
        elmntTaskDueDateInput.value = varFormattedDueDate;

    }



    //Open progress bar slider.

    var taskProgressInputContainer = document.createElement("div");
    taskProgressInputContainer.classList.add("taskProgressInputContainer");
    this.appendChild(taskProgressInputContainer);

    var taskProgressInput = document.createElement("input");
    taskProgressInput.setAttribute("type", "range");
    taskProgressInput.setAttribute("id", "taskProgressInput");
    taskProgressInput.setAttribute("class", "taskProgressInput");
    taskProgressInput.setAttribute("name", "taskProgressInput");
    taskProgressInput.setAttribute("max", "100");
    taskProgressInput.setAttribute("step", "10");
    taskProgressInputContainer.appendChild(taskProgressInput);

    const elmntProgressBar = this.querySelector("progress");
    taskProgressInput.value = elmntProgressBar.value;

    taskProgressInput.addEventListener("change", confirmTaskProgressEdit);

    var taskProgressInputLabel = document.createElement("label");
    taskProgressInputLabel.setAttribute("for", "taskProgressInput");
    taskProgressInputContainer.appendChild(taskProgressInputLabel);

}

export async function deleteTask() {
    const elmntTaskElement = this.parentElement.parentElement,
        elmntSubColumn = elmntTaskElement.parentElement,
        objChildrenOfSubColumn = elmntSubColumn.children,
        elmntTaskSubColumn = elmntTaskElement.querySelector(".taskSubContainer"),
        objChildrenOfTaskSubColumn = elmntTaskSubColumn.children;


    const documentToDelete = doc(db, "userItems", objUser.uid, "Tasks", elmntTaskElement.id);
    await deleteDoc(documentToDelete)
        .then(() => {
            elmntTaskElement.remove();

            //Delete all subtasks from database.
            for (let i = 0; i < objChildrenOfTaskSubColumn.length; i++) {
                const documentToDelete = doc(db, "userItems", objUser.uid, "Subtasks", objChildrenOfTaskSubColumn[i].id);
                deleteDoc(documentToDelete).catch(error => {
                    errorHandler(error);
                });
            }

            for (let i = 0; i < objChildrenOfSubColumn.length; i++) {
                const documentToUpdate = doc(db, "userItems", objUser.uid, "Tasks", objChildrenOfSubColumn[i].id);
                updateDoc(documentToUpdate, {
                    taskPosition: i
                }).catch(error => {
                    errorHandler(error);
                });
            };
        })
        .catch(error => {
            errorHandler(error);
        });
}

function confirmTaskEdit() {
    const elmntTaskInEdit = document.querySelector(".inEdit.task"),
        elmntTaskInputField = elmntTaskInEdit.querySelector("input"),
        varNewTaskTitle = elmntTaskInputField.value.trim();

    if (varNewTaskTitle !== "") {
        const documentToUpdate = doc(db, "userItems", objUser.uid, "Tasks", elmntTaskInEdit.id);
        updateDoc(documentToUpdate, {
            taskTitle: varNewTaskTitle
        })
            .then(() => {
                const elmntTaskTitle = elmntTaskInEdit.querySelector("p"),
                    elmntTaskHeaderContainer = elmntTaskInEdit.querySelector(".taskHeaderContainer");

                elmntTaskTitle.innerText = varNewTaskTitle;
                elmntTaskHeaderContainer.appendChild(elmntTaskTitle);
            })
            .catch(error => {
                errorHandler(error);
            });
    }
}

export function closeTaskEdit() {
    const elmntTaskInEdit = document.querySelector(".inEdit.task"),
        elmntTaskInputField = elmntTaskInEdit.querySelector("input"),
        elmntTaskInputLabel = elmntTaskInEdit.querySelector("label"),
        elmntTaskTitle = elmntTaskInEdit.querySelector("p"),
        elmntTaskSubContainer = elmntTaskInEdit.querySelector(".taskSubContainer"),
        elmntSubtaskCreatorPrompt = elmntTaskInEdit.querySelector(".subtask.createTaskPrompt"),
        elmntTaskProgressInputContainer = elmntTaskInEdit.querySelector(".taskProgressInputContainer"),
        elmntTaskPriorityAndDueDateInputContainer = elmntTaskInEdit.querySelector(".taskPriorityAndDueDateInputContainer"),
        objSubtasks = elmntTaskSubContainer.querySelectorAll(".subtask"),
        elmntPriorityIcon = elmntTaskInEdit.querySelector(".priorityIcon");

    //Disable draggable for subtasks.
    for (let i = 0; i < objSubtasks.length; i++) {
        const elmntSubtask = objSubtasks[i];
        elmntSubtask.classList.remove("handle");
    };

    elmntSubtaskCreatorPrompt.remove();
    elmntTaskInputField.remove();
    elmntTaskInputLabel.remove();
    elmntTaskProgressInputContainer.remove();
    elmntTaskPriorityAndDueDateInputContainer.remove();
    elmntTaskTitle.style.display = "block";
    elmntTaskInEdit.classList.add("handle");

    if (!elmntPriorityIcon.classList.contains("priority-null")) {
        elmntTaskInEdit.classList.add("priorityStatusEnabled");
    }

    elmntTaskInEdit.classList.remove("inEdit");
}

function confirmTaskProgressEdit() {
    const elmntTaskInEdit = document.querySelector(".inEdit.task"),
        elmntTaskProgressInput = document.querySelector(".taskProgressInputContainer input"),
        elmntProgressBar = elmntTaskInEdit.querySelector("progress");

    const documentToUpdate = doc(db, "userItems", objUser.uid, "Tasks", elmntTaskInEdit.id);
    updateDoc(documentToUpdate, {
        taskProgress: Number(elmntTaskProgressInput.value)
    })
        .then(() => {
            elmntProgressBar.value = elmntTaskProgressInput.value;
        })
        .catch(error => {
            errorHandler(error);
            elmntTaskProgressInput.value = elmntProgressBar.value;
        });
}

async function confirmTaskPriorityEdit() {
    const elmntTaskInEdit = document.querySelector(".inEdit.task"),
        elmntCurrentSelectBackdropContainer = elmntTaskInEdit.querySelector(".selectBackdropContainer.selected"),
        elmntNewSelectBackdropContainer = this.parentElement;

    const funcPriority = () => {
        if (this.classList.contains("priority-lower")) {
            return "lower";
        } else if (this.classList.contains("priority-low")) {
            return "low";
        } else if (this.classList.contains("priority-null")) {
            return null;
        } else if (this.classList.contains("priority-medium")) {
            return "medium";
        } else if (this.classList.contains("priority-high")) {
            return "high";
        } else if (this.classList.contains("priority-higher")) {
            return "higher";
        }
    }

    const varPriority = funcPriority();

    if (!elmntNewSelectBackdropContainer.classList.contains("selected")) {
        const documentToUpdate = doc(db, "userItems", objUser.uid, "Tasks", elmntTaskInEdit.id);
        updateDoc(documentToUpdate, {
            taskPriority: varPriority
        })
            .then(() => {
                elmntCurrentSelectBackdropContainer.classList.remove("selected");
                elmntNewSelectBackdropContainer.classList.add("selected");

                const elmntPriorityIcon = elmntTaskInEdit.querySelector(".priorityIcon");
                elmntPriorityIcon.className = "priorityIcon priority-" + varPriority;
            })
            .catch(error => {
                errorHandler(error);
            });
    }

}

function confirmTaskDueDateEdit() {

    const elmntTaskInEdit = document.querySelector(".inEdit.task"),
        elmntTaskDueDateInputContainerText = elmntTaskInEdit.querySelector(".taskDueDateInputContainer small"),
        elmntTaskDueDateContainerText = elmntTaskInEdit.querySelector(".taskDueDateContainer small"),
        elmntTaskDueDateContainer = elmntTaskInEdit.querySelector(".taskDueDateContainer");

    let objDate;

    if (this.value == "") {
        objDate = null;
    } else {
        objDate = new Date(this.value);
    }

    const documentToUpdate = doc(db, "userItems", objUser.uid, "Tasks", elmntTaskInEdit.id);
    updateDoc(documentToUpdate, {
        taskDueDate: objDate
    })
        .then(() => {
            if (this.value == "") {
                elmntTaskDueDateInputContainerText.innerText = "";
                elmntTaskDueDateContainerText.innerText = "";
            } else {
                const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    varTaskDueDateMonth = month[objDate.getMonth()],
                    varTaskDueDateDate = objDate.getDate();

                elmntTaskDueDateInputContainerText.innerText = varTaskDueDateMonth + ' ' + varTaskDueDateDate;
                elmntTaskDueDateContainerText.innerText = varTaskDueDateMonth + ' ' + varTaskDueDateDate;


                function formatDate(objDate) {
                    // Extract year, month, and day from the Date object
                    const year = objDate.getFullYear();
                    // Months are zero-indexed, so add 1 to get the correct month
                    const month = String(objDate.getMonth() + 1).padStart(2, '0');
                    const day = String(objDate.getDate()).padStart(2, '0');

                    // Return the formatted date string
                    return `${year}-${month}-${day}`;
                }

                const varFormattedDueDate = formatDate(objDate);
                this.value = varFormattedDueDate;
            }

            elmntTaskDueDateContainer.setAttribute("data-duedate", objDate);
        })
        .catch(error => {
            errorHandler(error);
            this.value = this.defaultValue;
        });
}