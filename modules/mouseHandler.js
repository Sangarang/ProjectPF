import { errorHandler } from "../core.js";
import { doc, updateDoc } from 'firebase/firestore';
import { db, objUser } from "../index.js";
import { closeTaskEdit } from "./editTask.js";
import { closeSubtaskEdit } from "./editSubtask.js";
import { closeColumnEdit } from "./editColumn.js";
import { confirmNewTask } from "./createTask.js";
import { confirmNewColumn } from "./createColumn.js";

//Handle mouse clicks when certain events are active.
export function documentOnclick(elmntClicked, elmntOnMouseDown) {
    const elmntColumnHeaderInEdit = document.querySelector(".inEdit.columnContainerHeader"),
        elmntTaskInEdit = document.querySelector(".inEdit.task"),
        elmntSubtaskInEdit = document.querySelector(".inEdit.subtask"),
        elmntTaskInCreation = document.querySelector(".task.createTaskPrompt"),
        elmntNewColumnInput = document.getElementById("newColumnInput"),
        varNewColumnTitle = elmntNewColumnInput.value;

    const elmntDropupMenu = document.getElementById("dropupMenu"),
        elmntPopupModalSettings = document.getElementById("popupModalSettings"),
        elmntPopupModalAbout = document.getElementById("popupModalAbout");

    //Close dropup menu.
    if (!buttonContainer.contains(elmntClicked) && !elmntDropupMenu.contains(elmntClicked) && !elmntPopupModalSettings.contains(elmntClicked) && !elmntPopupModalAbout.contains(elmntClicked)) {
        elmntDropupMenu.classList.remove('show');
        document.getElementById("expandMoreIcon").style.transform = "rotate(0deg)";
    }

    //Close modals if clicked occurs outside.
    if (elmntClicked === elmntPopupModalSettings) {
        elmntPopupModalSettings.classList.remove('show');
    }
    if (elmntClicked === elmntPopupModalAbout) {
        elmntPopupModalAbout.classList.remove('show');
    }

    //Edit new task from mouse press.
    if (elmntTaskInEdit !== null && !elmntTaskInEdit.contains(elmntClicked) && !elmntClicked.classList.contains('deleteTaskButton') && !elmntTaskInEdit.contains(elmntOnMouseDown)) {
        closeTaskEdit();
    }

    //Edit new subtask from mouse press.
    if (elmntSubtaskInEdit !== null && !elmntSubtaskInEdit.contains(elmntClicked) && !elmntSubtaskInEdit.contains(elmntOnMouseDown)) {
        closeSubtaskEdit();
    }

    //Edit new column from mouse press.
    if (elmntColumnHeaderInEdit !== null && !elmntColumnHeaderInEdit.contains(elmntClicked) && !elmntColumnHeaderInEdit.contains(elmntOnMouseDown)) {
        closeColumnEdit();
    }

    //Creating new column from mouse press.
    if (varNewColumnTitle !== "" && !elmntNewColumnInput.contains(elmntOnMouseDown)) {
        const varNewColumnTitleTrimmed = varNewColumnTitle.trim();
        if (varNewColumnTitleTrimmed != "") {
            confirmNewColumn();
        } else {
            //Input element value already cleared in confirmNewColumn(), hence the else condition.
            elmntNewColumnInput.value = "";
        }
    }

    //Creating new task from mouse press.
    if (elmntTaskInCreation !== null && !elmntTaskInCreation.contains(elmntClicked) && !elmntClicked.classList.contains('addButton')) {
        const varEnterOrMouse = "mouse";
        confirmNewTask(varEnterOrMouse);
    }
}


//--------------------------------
//Update database after any drag is completed.

export async function columnDragEnd() {
    const elmntMainContainer = document.getElementById("mainContainer"),
        objChildrenOfMainContainer = elmntMainContainer.children;

    for (let i = 0; i < objChildrenOfMainContainer.length; i++) {
        const documentToUpdate = doc(db, "userItems", objUser.uid, "Columns", objChildrenOfMainContainer[i].id);
        await updateDoc(documentToUpdate, {
            columnPosition: i
        }).catch(error => {
            errorHandler(error);
        });
    }
}

export async function taskDragEnd(elmntColumnBeforeDrag, elmntColumnAfterDrag, elmntDraggedTask) {
    const varColumnIdAfterDrag = elmntColumnAfterDrag.parentElement.id,
        objColumnAfterDragChildren = elmntColumnAfterDrag.children,
        objChildrenOfColumnBeforeDrag = elmntColumnBeforeDrag.children;

    //Update taskColumnId of recently dragged task.
    const documentToUpdate = doc(db, "userItems", objUser.uid, "Tasks", elmntDraggedTask.id);
    await updateDoc(documentToUpdate, {
        taskColumnId: varColumnIdAfterDrag
    }).catch(error => {
        errorHandler(error);
    });

    //Update tasks' positions in new column.
    for (let i = 0; i < objColumnAfterDragChildren.length; i++) {
        const documentToUpdate = doc(db, "userItems", objUser.uid, "Tasks", objColumnAfterDragChildren[i].id);
        await updateDoc(documentToUpdate, {
            taskPosition: i
        }).catch(error => {
            errorHandler(error);
        });
    };

    //Update tasks' positions in old column.
    if (elmntColumnBeforeDrag !== elmntColumnAfterDrag) {
        for (let i = 0; i < objChildrenOfColumnBeforeDrag.length; i++) {
            const documentToUpdate = doc(db, "userItems", objUser.uid, "Tasks", objChildrenOfColumnBeforeDrag[i].id);
            await updateDoc(documentToUpdate, {
                taskPosition: i
            }).catch(error => {
                errorHandler(error);
            });
        };
    }
}

export async function subtaskDragEnd(elmntTaskSubColumn) {
    const objTaskSubColumnChildren = elmntTaskSubColumn.children;
    for (let i = 0; i < objTaskSubColumnChildren.length; i++) {
        const documentToUpdate = doc(db, "userItems", objUser.uid, "Subtasks", objTaskSubColumnChildren[i].id);
        await updateDoc(documentToUpdate, {
            subtaskPosition: i
        }).catch(error => {
            errorHandler(error);
        });
    };
}

//--------------------------------
//Enable scroll by dragging mouse on background.

const elmntMain = document.querySelector('main');
let varMousePosition = { top: 0, left: 0, x: 0, y: 0 };

//Scroll using mouse.
function mouseDownHandler(e) {
    varMousePosition = {
        // The current scroll
        left: elmntMain.scrollLeft,
        top: elmntMain.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    elmntMain.style.userSelect = 'none';
}

function mouseMoveHandler(e) {
    // How far the mouse has been moved
    const dx = e.clientX - varMousePosition.x,
        dy = e.clientY - varMousePosition.y;

    // Scroll the element
    elmntMain.scrollTop = varMousePosition.top - dy;
    elmntMain.scrollLeft = varMousePosition.left - dx;
}

function mouseUpHandler() {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    elmntMain.style.removeProperty('user-select');
}

export function documentOnMouseDown(e) {
    const elmntClicked = e.target;

    if (!elmntClicked.closest(".task") && !elmntClicked.closest(".columnContainerHeader") && !elmntClicked.closest("#masterButton")
        && !elmntClicked.closest("#popupModalAbout") && !elmntClicked.closest("#popupModalSettings") && !elmntClicked.closest("#popupModalError")) {
        mouseDownHandler(e);
    }
}