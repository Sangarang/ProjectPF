import { editTask, deleteTask } from "./editTask.js";
import { editSubtask, deleteSubtask } from "./editSubtask.js";
import { editColumn } from "./editColumn.js";
import { createNewTask } from "./createTask.js";
import { completeTask, uncompleteTask } from "./un-completeTask.js";
import { completeSubtask, uncompleteSubtask } from "./un-completeSubtask.js";
import { taskDragEnd, subtaskDragEnd, documentOnclick } from "./mouseHandler.js";

import Sortable from "sortablejs";

export function createNewColumn(varNewColumnTitle, varDocId) {
    var elmntNewColumnContainer = document.createElement("div");
    elmntNewColumnContainer.classList.add("columnContainer");
    elmntNewColumnContainer.setAttribute("id", varDocId);

    document.getElementById("mainContainer").appendChild(elmntNewColumnContainer);

    var elmntColumnContainerHeader = document.createElement("div");
    elmntColumnContainerHeader.classList.add("columnContainerHeader");
    elmntColumnContainerHeader.classList.add("handle");
    elmntNewColumnContainer.appendChild(elmntColumnContainerHeader);

    var elmntColumnTitle = document.createElement("p");
    elmntColumnTitle.innerText = varNewColumnTitle;
    elmntColumnContainerHeader.appendChild(elmntColumnTitle);

    elmntColumnContainerHeader.addEventListener("click", editColumn);

    var elmntAddButton = document.createElement("div");
    elmntAddButton.classList.add("addButton");
    elmntColumnContainerHeader.appendChild(elmntAddButton);

    elmntAddButton.addEventListener("click", createNewTask);

    var elmntNewSubColumnContainer = document.createElement("div");
    elmntNewSubColumnContainer.classList.add("columnSub");
    elmntNewSubColumnContainer.setAttribute("id", "sub-" + varDocId);
    elmntNewColumnContainer.appendChild(elmntNewSubColumnContainer);

    new Sortable(elmntNewSubColumnContainer, {
        group: "shared",
        animation: 150,
        handle: '.handle',
        fallbackTolerance: 3,
        forceFallback: true,
        delayOnTouchOnly: true,
        delay: 250,
        onStart: function (/**Event*/evt) {
            const elmntOnMouseDown = evt.item,
                elmntClicked = evt.item;

            documentOnclick(elmntClicked, elmntOnMouseDown);
        },
        onEnd: function (/**Event*/evt) {
            const elmntColumnBeforeDrag = evt.from,
                elmntColumnAfterDrag = evt.to,
                elmntDraggedTask = evt.item;
            taskDragEnd(elmntColumnBeforeDrag, elmntColumnAfterDrag, elmntDraggedTask);
        },
        onChoose: function (/**Event*/evt) {
            //For touch devices, vibrate when drag item chosen (As at early 2024, doesn't work for IOS Safari devices.)
            navigator.vibrate([30]);
        }
    });
}

export function queryNewTask(varDocId, varColumnId, varTaskCompletedTime, varTaskTitle, varTaskProgress, varTaskPriority, varTaskDueDate) {

    var elmntNewTask = document.createElement("div");
    elmntNewTask.classList.add("task");
    elmntNewTask.classList.add("handle");
    elmntNewTask.setAttribute("id", varDocId);

    var elmntTaskHeaderContainer = document.createElement("div");
    elmntTaskHeaderContainer.classList.add("taskHeaderContainer");
    elmntNewTask.appendChild(elmntTaskHeaderContainer);

    var elmntCheckBox = document.createElement("div");
    elmntCheckBox.classList.add("checkButton");
    elmntTaskHeaderContainer.appendChild(elmntCheckBox);

    var elmntTaskTitle = document.createElement("p");
    elmntTaskTitle.innerText = varTaskTitle;
    elmntTaskHeaderContainer.appendChild(elmntTaskTitle);

    //-------------------------------------



    var elmntNewSubTaskContainer = document.createElement("div");
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
    //-------------------------------------

    var elmntTaskDueDateContainer = document.createElement("div");
    elmntTaskDueDateContainer.classList.add("taskDueDateContainer", "taskDueDate");
    elmntNewTask.appendChild(elmntTaskDueDateContainer);

    var elmntTaskDueDateIcon = document.createElement("div");
    elmntTaskDueDateIcon.classList.add("taskDueDateIcon");
    elmntTaskDueDateContainer.appendChild(elmntTaskDueDateIcon);

    var elmntTaskDueDateContainerText = document.createElement("small");
    elmntTaskDueDateContainer.appendChild(elmntTaskDueDateContainerText);

    if (varTaskDueDate != null) {
        varTaskDueDate = varTaskDueDate.toDate();

        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            varTaskDueDateMonth = month[varTaskDueDate.getMonth()],
            varTaskDueDateDate = varTaskDueDate.getDate();

        elmntTaskDueDateContainerText.innerText = varTaskDueDateMonth + ' ' + varTaskDueDateDate;

        elmntTaskDueDateContainer.setAttribute("data-duedate", varTaskDueDate);

    }

    //-------------------------------------

    var elmntProgressBar = document.createElement("progress");
    elmntProgressBar.setAttribute("id", "progressbar-" + varDocId);
    elmntProgressBar.setAttribute("max", "100");
    elmntProgressBar.setAttribute("value", varTaskProgress);
    elmntNewTask.appendChild(elmntProgressBar);

    var elmntProgressBarLabel = document.createElement("label");
    elmntProgressBarLabel.setAttribute("for", "progressbar-" + varDocId);
    elmntProgressBarLabel.setAttribute("class", "progressBarLabel");
    elmntNewTask.appendChild(elmntProgressBarLabel);

    //-------------------------------------

    var elmntPriorityIconContainer = document.createElement("div");
    elmntPriorityIconContainer.classList.add("priorityIcon");
    elmntTaskHeaderContainer.appendChild(elmntPriorityIconContainer);

    if (varTaskPriority != null) {
        elmntNewTask.classList.add("priorityStatusEnabled");
    }
    elmntPriorityIconContainer.classList.add("priority-" + varTaskPriority);

    //-------------------------------------

    if (varTaskCompletedTime == null) {
        elmntNewTask.addEventListener("click", editTask);
        elmntCheckBox.addEventListener("click", completeTask);
    } else {
        varTaskCompletedTime = varTaskCompletedTime.toDate();
        elmntNewTask.classList.add("taskCompleted");
        elmntCheckBox.addEventListener("click", uncompleteTask);

        var elmntDeleteColumnButtonContainer = document.createElement("div");
        elmntDeleteColumnButtonContainer.classList.add("deleteTaskButton");
        elmntDeleteColumnButtonContainer.addEventListener("click", deleteTask);
        elmntTaskHeaderContainer.appendChild(elmntDeleteColumnButtonContainer);

        var elmntDateCompletedContainer = document.createElement("div");
        elmntDateCompletedContainer.classList.add("dateCompletedContainer");
        elmntNewTask.appendChild(elmntDateCompletedContainer);

        var elmntDateCompletedIcon = document.createElement("div");
        elmntDateCompletedIcon.classList.add("dateCompletedIcon");
        elmntDateCompletedContainer.appendChild(elmntDateCompletedIcon);

        var elmntDateCompletedContainerText = document.createElement("small");
        elmntDateCompletedContainerText.innerText = varTaskCompletedTime.toDateString() + ' ' + varTaskCompletedTime.toLocaleTimeString();
        elmntDateCompletedContainer.appendChild(elmntDateCompletedContainerText);

    }
    const elmntColumnToGoTo = document.getElementById("sub-" + varColumnId);
    elmntColumnToGoTo.appendChild(elmntNewTask);
}

export function queryNewSubtask(varDocId, varParentTaskId, varTaskCompleted, varTaskTitle) {

    var elmntNewSubtask = document.createElement("div");
    elmntNewSubtask.classList.add("subtask");
    elmntNewSubtask.setAttribute("id", varDocId);

    var elmntCheckBox = document.createElement("div");
    elmntCheckBox.classList.add("checkButton");
    elmntNewSubtask.appendChild(elmntCheckBox);

    var elmntTaskTitle = document.createElement("p");
    elmntTaskTitle.innerText = varTaskTitle;
    elmntNewSubtask.appendChild(elmntTaskTitle);

    var elmntDragHandle = document.createElement("div");
    elmntDragHandle.classList.add("dragHandle");
    elmntNewSubtask.appendChild(elmntDragHandle);

    if (varTaskCompleted == false) {
        elmntNewSubtask.addEventListener("click", editSubtask);
        elmntCheckBox.addEventListener("click", completeSubtask);
    } else {
        elmntNewSubtask.classList.add("taskCompleted");
        elmntCheckBox.addEventListener("click", uncompleteSubtask);

        var elmntDeleteColumnButtonContainer = document.createElement("div");
        elmntDeleteColumnButtonContainer.classList.add("deleteTaskButton");
        elmntDeleteColumnButtonContainer.addEventListener("click", deleteSubtask);
        elmntNewSubtask.appendChild(elmntDeleteColumnButtonContainer);
    }
    const elmntParentTask = document.getElementById(varParentTaskId),
        elmntParentTaskToGoTo = elmntParentTask.querySelector(".taskSubContainer");
    elmntParentTaskToGoTo.appendChild(elmntNewSubtask);
}