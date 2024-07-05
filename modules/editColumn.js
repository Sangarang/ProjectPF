import { db, objUser } from "../index.js";
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { errorHandler } from "../core.js";

export function editColumn() {
    const elmntClicked = event.target,
        elmntColumnHeaderInEdit = document.querySelector(".inEdit.columnContainerHeader");

    if (elmntColumnHeaderInEdit == this || elmntClicked.classList.contains("addButton") || elmntClicked.classList.contains("deleteColumnButton")) {
        return;
    } else if (elmntColumnHeaderInEdit !== null) {
        closeColumnEdit();
    }

    const elmntColumnContainer = this.parentElement,
        elmntSubColumnContainer = elmntColumnContainer.querySelector(".columnSub"),
        objChildrenOfSubColumn = elmntSubColumnContainer.firstElementChild,
        elmntTaskTitle = this.querySelector("p"),
        varIntialTaskTitle = elmntTaskTitle.innerText,
        elmntAddButton = this.querySelector(".addButton");

    elmntTaskTitle.style.display = "none";

    this.classList.add("inEdit");
    this.classList.remove("handle");

    elmntAddButton.style.display = "none";

    var elmntColumnHeaderInput = document.createElement("input");
    elmntColumnHeaderInput.setAttribute("type", "text");
    elmntColumnHeaderInput.setAttribute("enterkeyhint", "done");
    elmntColumnHeaderInput.setAttribute("id", "input-" + this.parentElement.id);
    elmntColumnHeaderInput.setAttribute("name", "elmntColumnHeaderInput");
    elmntColumnHeaderInput.setAttribute("placeholder", "Specify column");
    elmntColumnHeaderInput.setAttribute("value", varIntialTaskTitle);
    elmntColumnHeaderInput.setAttribute("maxlength", "80");
    this.appendChild(elmntColumnHeaderInput);

    var elmntColumnContainerHeaderLabel = document.createElement("label");
    elmntColumnContainerHeaderLabel.setAttribute("for", "input-" + this.parentElement.id);
    this.appendChild(elmntColumnContainerHeaderLabel);

    const end = elmntColumnHeaderInput.value.length;
    elmntColumnHeaderInput.setSelectionRange(end, end);
    elmntColumnHeaderInput.focus();

    elmntColumnHeaderInput.addEventListener("change", confirmColumnEdit);

    elmntColumnHeaderInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            closeColumnEdit();
        }
    });

    var elmntDeleteColumnButton = document.createElement("div");
    elmntDeleteColumnButton.classList.add("deleteColumnButton");
    this.appendChild(elmntDeleteColumnButton);

    if (objChildrenOfSubColumn == null) {
        elmntDeleteColumnButton.addEventListener("click", function () {
            deleteColumn();
        });
    } else {
        elmntDeleteColumnButton.classList.add("deleteDisallowed");
    }

    async function deleteColumn() {
        if (objChildrenOfSubColumn == null) {

            const documentToDelete = doc(db, "userItems", objUser.uid, "Columns", elmntColumnContainer.id);
            await deleteDoc(documentToDelete)
                .then(() => {
                    elmntColumnContainer.remove();

                    const elmntMainContainer = document.getElementById("mainContainer"),
                        objChildrenOfMainContainer = elmntMainContainer.children;
                    for (let i = 0; i < objChildrenOfMainContainer.length; i++) {
                        const documentToUpdate = doc(db, "userItems", objUser.uid, "Columns", objChildrenOfMainContainer[i].id);
                        updateDoc(documentToUpdate, {
                            columnPosition: i
                        }).catch(error => {
                            errorHandler(error);
                        });
                    }
                })
                .catch(error => {
                    errorHandler(error);
                });
        }
    }
}

function confirmColumnEdit() {
    const elmntColumnHeaderInEdit = document.querySelector(".inEdit.columnContainerHeader"),
        elmntColumnHeaderInput = elmntColumnHeaderInEdit.querySelector("input"),
        elmntColumnHeaderTitle = elmntColumnHeaderInEdit.querySelector("p"),
        varNewColumnTitle = elmntColumnHeaderInput.value.trim();

    if (varNewColumnTitle !== "") {
        const documentToUpdate = doc(db, "userItems", objUser.uid, "Columns", elmntColumnHeaderInput.parentElement.parentElement.id);
        updateDoc(documentToUpdate, {
            columnTitle: varNewColumnTitle
        })
            .then(() => {
                elmntColumnHeaderTitle.innerText = varNewColumnTitle;
            })
            .catch(error => {
                errorHandler(error);
            });
    }
}

export function closeColumnEdit() {
    const elmntColumnHeaderInEdit = document.querySelector(".inEdit.columnContainerHeader"),
        elmntColumnHeaderTitle = elmntColumnHeaderInEdit.querySelector("p");

    elmntColumnHeaderInEdit.querySelector("input").remove();
    elmntColumnHeaderInEdit.querySelector("label").remove();
    elmntColumnHeaderInEdit.querySelector(".deleteColumnButton").remove();

    elmntColumnHeaderTitle.style.display = "block";
    elmntColumnHeaderInEdit.insertBefore(elmntColumnHeaderTitle, elmntColumnHeaderInEdit.children[0]);
    elmntColumnHeaderInEdit.classList.add("handle");
    elmntColumnHeaderInEdit.classList.remove("inEdit");
    elmntColumnHeaderInEdit.querySelector(".addButton").style.display = "block";
}