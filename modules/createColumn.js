import { db, objUser } from "../index.js";
import { createNewColumn } from "./intialQuery.js";
import { errorHandler } from "../core.js";
import { addDoc, collection } from 'firebase/firestore';

export async function confirmNewColumn() {
    const elmntMainContainer = document.getElementById("mainContainer"),
        elmntNewColumnInput = document.getElementById("newColumnInput"),
        varNewColumnTitle = elmntNewColumnInput.value.trim(),
        objChildrenOfMainContainer = elmntMainContainer.children;

    if (varNewColumnTitle !== "") {
        await addDoc(collection(db, "userItems", objUser.uid, "Columns"), {
            columnPosition: objChildrenOfMainContainer.length + 1,
            columnTitle: varNewColumnTitle
        })
            .then((docRef) => {

                elmntNewColumnInput.value = "";

                createNewColumn(varNewColumnTitle, docRef.id);
                elmntNewColumnInput.scrollIntoView();
            })
            .catch(error => {
                elmntNewColumnInput.value = "";
                errorHandler(error);

            });
    }
}