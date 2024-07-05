import { editTask } from "./editTask.js";
import { completeTask } from "./un-completeTask.js";
import { db, objUser } from "../index.js";
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { errorHandler } from "../core.js";
import { subtaskDragEnd, documentOnclick } from "./mouseHandler.js";

import Sortable from "sortablejs";

export function createNewTask() {
    const elmntTaskInCreation = document.querySelector(".task.createTaskPrompt");

    if (elmntTaskInCreation !== null) {
        const varEnterOrMouse = "mouse";
        confirmNewTask(varEnterOrMouse);
    }

    const elmntColumnContainer = this.parentElement.parentElement,
        elmntSubColumnContainer = document.getElementById("sub-" + elmntColumnContainer.id);

    const elmntNewTask = document.createElement("div");
    elmntNewTask.classList.add("task");
    elmntNewTask.classList.add("createTaskPrompt");

    const elmntTaskHeaderContainer = document.createElement("div");
    elmntTaskHeaderContainer.classList.add("taskHeaderContainer");
    elmntNewTask.appendChild(elmntTaskHeaderContainer);

    const elmntCheckBox = document.createElement("div");
    elmntCheckBox.classList.add("checkButton");
    elmntTaskHeaderContainer.appendChild(elmntCheckBox);

    const taskTitleInput = document.createElement("input");
    taskTitleInput.setAttribute("type", "text");
    taskTitleInput.setAttribute("enterkeyhint", "done");
    taskTitleInput.setAttribute("id", "input-" + elmntColumnContainer.id);
    taskTitleInput.setAttribute("name", "taskTitleInput");
    taskTitleInput.setAttribute("placeholder", "Add task");
    taskTitleInput.setAttribute("maxlength", "160");
    elmntTaskHeaderContainer.appendChild(taskTitleInput);

    const taskTitleInputLabel = document.createElement("label");
    taskTitleInputLabel.setAttribute("for", "input-" + elmntColumnContainer.id);
    elmntTaskHeaderContainer.appendChild(taskTitleInputLabel);

    taskTitleInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();

            const varEnterOrMouse = "enter";
            confirmNewTask(varEnterOrMouse);
        }
    });

    elmntColumnContainer.appendChild(elmntNewTask);
    elmntColumnContainer.insertBefore(elmntNewTask, elmntSubColumnContainer);
    taskTitleInput.focus();
}

export async function confirmNewTask(varEnterOrMouse) {

    const elmntTaskInCreation = document.querySelector(".task.createTaskPrompt"),
        elmntNewTaskInputField = elmntTaskInCreation.querySelector("input"),
        varNewTaskTitle = elmntNewTaskInputField.value.trim(),
        elmntSubColumn = document.getElementById("sub-" + elmntTaskInCreation.parentElement.id),
        objChildrenOfSubColumn = elmntSubColumn.children;

    if (varNewTaskTitle === "") {
        elmntTaskInCreation.remove();
        return;
    }

    await addDoc(collection(db, "userItems", objUser.uid, "Tasks"), {
        taskColumnId: elmntSubColumn.parentElement.id,
        taskPosition: 0,
        taskTitle: varNewTaskTitle,
        taskTimeCompleted: null,
        taskProgress: 0,
        taskDueDate: null,
        taskPriority: null
    })
        .then((docRef) => {
            let elmntNewTask;
            if (varEnterOrMouse == "mouse") {

                const elmntTaskInCreation = document.querySelector(".task.createTaskPrompt"),
                    elmntNewTaskInputField = elmntTaskInCreation.querySelector("input"),
                    elmntNewTaskInputLabel = elmntTaskInCreation.querySelector("label"),
                    elmntNewTaskCheckBox = elmntTaskInCreation.querySelector(".checkButton"),
                    elmntTaskHeaderContainer = elmntTaskInCreation.querySelector(".taskHeaderContainer"),
                    varNewTaskTitle = elmntNewTaskInputField.value.trim(),
                    elmntSubColumn = document.getElementById("sub-" + elmntTaskInCreation.parentElement.id);

                elmntTaskInCreation.classList.add("handle");
                elmntTaskInCreation.classList.remove("createTaskPrompt");
                elmntTaskInCreation.addEventListener("click", editTask);

                elmntNewTaskCheckBox.addEventListener("click", completeTask);

                elmntNewTaskInputField.remove();
                elmntNewTaskInputLabel.remove();

                const elmntTaskTitle = document.createElement("p");
                elmntTaskTitle.innerText = varNewTaskTitle;
                elmntTaskHeaderContainer.appendChild(elmntTaskTitle);

                const elmntNewSubTaskContainer = document.createElement("div");
                elmntNewSubTaskContainer.classList.add("taskSubContainer");
                elmntTaskInCreation.appendChild(elmntNewSubTaskContainer);

                new Sortable(elmntNewSubTaskContainer, {
                    animation: 150,
                    handle: '.handle',
                    fallbackTolerance: 3,
                    forceFallback: true,
                    onStart: function (/**Event*/evt) {
                        const elmntOnMouseDown = evt.item,
                            elmntClicked = evt.item;

                        documentOnclick(elmntClicked, elmntOnMouseDown);
                    },
                    onEnd: function (/**Event*/evt) {
                        const elmntTaskSubColumn = evt.to;
                        subtaskDragEnd(elmntTaskSubColumn);
                    },
                    onChoose: function (/**Event*/evt) {
                        //For touch devices, vibrate when drag item chosen (As at early 2024, doesn't work for IOS Safari devices.)
                        navigator.vibrate([30]);
                    }
                });

                //-------------------------------------

                elmntSubColumn.insertBefore(elmntTaskInCreation, elmntSubColumn.children[0]);

                elmntNewTask = elmntTaskInCreation;

            } else if (varEnterOrMouse == "enter") {

                elmntNewTask = document.createElement("div");
                elmntNewTask.classList.add("task");
                elmntNewTask.classList.add("handle");
                elmntNewTask.addEventListener("click", editTask);

                const elmntTaskHeaderContainer = document.createElement("div");
                elmntTaskHeaderContainer.classList.add("taskHeaderContainer");
                elmntNewTask.appendChild(elmntTaskHeaderContainer);

                const elmntCheckBox = document.createElement("div");
                elmntCheckBox.classList.add("checkButton");
                elmntCheckBox.addEventListener("click", completeTask);
                elmntTaskHeaderContainer.appendChild(elmntCheckBox);

                const elmntTaskTitle = document.createElement("p");
                elmntTaskTitle.innerText = varNewTaskTitle;
                elmntTaskHeaderContainer.appendChild(elmntTaskTitle);

                const elmntNewSubTaskContainer = document.createElement("div");
                elmntNewSubTaskContainer.classList.add("taskSubContainer");
                elmntNewTask.appendChild(elmntNewSubTaskContainer);

                new Sortable(elmntNewSubTaskContainer, {
                    animation: 150,
                    handle: '.handle',
                    fallbackTolerance: 3,
                    forceFallback: true,
                    onStart: function (/**Event*/evt) {
                        const elmntOnMouseDown = evt.item,
                            elmntClicked = evt.item;

                        documentOnclick(elmntClicked, elmntOnMouseDown);
                    },
                    onEnd: function (/**Event*/evt) {
                        const elmntTaskSubColumn = evt.to;
                        subtaskDragEnd(elmntTaskSubColumn);
                    },
                    onChoose: function (/**Event*/evt) {
                        //For touch devices, vibrate when drag item chosen (As at early 2024, doesn't work for IOS Safari devices.)
                        navigator.vibrate([30]);
                    }
                });

                elmntSubColumn.appendChild(elmntNewTask);
                elmntSubColumn.insertBefore(elmntNewTask, elmntSubColumn.children[0]);

                //-------------------------------------

                elmntNewTaskInputField.value = "";
            }

            //-------------------------------------

            elmntNewTask.setAttribute("id", docRef.id);

            //--------------------------------------

            const elmntTaskDueDateContainer = document.createElement("div");
            elmntTaskDueDateContainer.classList.add("taskDueDateContainer", "taskDueDate");
            elmntNewTask.appendChild(elmntTaskDueDateContainer);

            const elmntTaskDueDateIcon = document.createElement("div");
            elmntTaskDueDateIcon.classList.add("taskDueDateIcon");
            elmntTaskDueDateContainer.appendChild(elmntTaskDueDateIcon);

            const elmntTaskDueDateContainerText = document.createElement("small");
            elmntTaskDueDateContainer.appendChild(elmntTaskDueDateContainerText);

            //-------------------------------------

            const elmntProgressBar = document.createElement("progress");
            elmntProgressBar.setAttribute("max", "100");
            elmntProgressBar.setAttribute("value", 0);
            elmntNewTask.appendChild(elmntProgressBar);

            const elmntProgressBarLabel = document.createElement("label");
            elmntProgressBarLabel.setAttribute("class", "progressBarLabel");
            elmntNewTask.appendChild(elmntProgressBarLabel);

            //-------------------------------------

            const elmntTaskHeaderContainer = elmntNewTask.querySelector(".taskHeaderContainer");

            const elmntPriorityIconContainer = document.createElement("div");
            elmntPriorityIconContainer.classList.add("priorityIcon");
            elmntTaskHeaderContainer.appendChild(elmntPriorityIconContainer);
            elmntPriorityIconContainer.classList.add("priority-null");

            //-------------------------------------


            elmntProgressBar.setAttribute("id", "progressbar-" + docRef.id);
            elmntProgressBarLabel.setAttribute("for", "progressbar-" + docRef.id);

            for (let i = 1; i < objChildrenOfSubColumn.length; i++) {
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
            if (varEnterOrMouse == "mouse") {
                elmntTaskInCreation.remove();
            } else if (varEnterOrMouse == "enter") {
                const elmntTaskInCreation = document.querySelector(".task.createTaskPrompt"),
                    elmntNewTaskInputField = elmntTaskInCreation.querySelector("input");

                elmntNewTaskInputField.value = "";

            }
        });
}