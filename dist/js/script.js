"use strict";

/* ****************************
 * Module which will have all the APP related code
 ***************************** */
const AppModule = {
    notesArray: [],
    noteIdsArray: [],

    // Method to add note into an array & also in localStorage
    addNote(note) {
        //1. Create a note object containing note with an id & date
        const date = new Date();
        let noteObj;
        if (this.notesArray.length === 0) {
            noteObj = {
                note: note,
                id: 0,
                date: `${date.getDate()}/${
                    date.getMonth() + 1
                }/${date.getFullYear()}`,
            };
        } else {
            noteObj = {
                note: note,
                id: this.notesArray[this.notesArray.length - 1].id + 1,
                date: `${date.getDate()}/${
                    date.getMonth() + 1
                }/${date.getFullYear()}`,
            };
        }

        //2. Push the note object in the notesArray
        this.notesArray.push(noteObj);

        //3. Push the note Id in the noteIdsArray
        this.noteIdsArray.push(noteObj.id);

        //4. Store the notesArray in localStorage
        localStorage.setItem("notes", JSON.stringify(this.notesArray));

        //5. Store the noteIdsArray
        localStorage.setItem("noteIds", JSON.stringify(this.noteIdsArray));

        //6.Return the note object
        return noteObj;
    },

    //Method to add localStorage notes in Array
    localNotesInArray(notes, noteIds) {
        this.notesArray = notes;
        this.noteIdsArray = noteIds;
    },

    deleteNote(id) {
        //1. Get the index of noteId
        const noteIndex = this.noteIdsArray.indexOf(id);

        //2. Check if noteIndex is not -1
        if (noteIndex >= 0) {
            // Remove the note from notesArray
            this.notesArray.splice(noteIndex, 1);

            // Remove the noteId from noteIdsArray
            this.noteIdsArray.splice(noteIndex, 1);

            //update the localStorage
            localStorage.setItem("notes", JSON.stringify(this.notesArray));
            localStorage.setItem("noteIds", JSON.stringify(this.noteIdsArray));

            //Return the index of note
            return noteIndex;
        }
    },
};

/* ****************************
 * Module which will have all the UI related code
 ***************************** */
const UIModule = {
    //property containing all the selectors
    selectors: {
        notesContainer: ".notes__container",
        themeToggler: ".theme__toggler",
        noteForm: ".note__entry__form",
        inputField: ".text__field",
    },

    //Method to add note in UI
    addNoteInUI(noteObj) {
        const notesContainer = document.querySelector(
            this.selectors.notesContainer
        );

        //raw html for new note
        let noteHtml = `<div class="note" id="note-%id%"><div class="note__content">
            <p>%note%</p><button class="delete__note__btn" title="Delete Note">
            <span class="material-icons">delete_forever</span></button>
            </div><h5 class="note__added__date">%date%</h5></div>`;

        noteHtml = noteHtml.replace("%id%", noteObj.id);
        noteHtml = noteHtml.replace("%note%", noteObj.note);
        noteHtml = noteHtml.replace("%date%", `${noteObj.date}`);

        //insert new note in UI
        notesContainer.insertAdjacentHTML("afterbegin", noteHtml);
    },

    //Method to add localStorage saved notes in UI
    localNotesInUI(notes) {
        let notesContainer = document.querySelector(
            this.selectors.notesContainer
        );

        //iterate through the notes array to all the notes
        notes.forEach(note => {
            let noteHtml = `<div class="note" id="note-%id%"><div class="note__content">
            <p>%note%</p><button class="delete__note__btn" title="Delete Note">
            <span class="material-icons">delete_forever</span></button>
            </div><h5 class="note__added__date">%date%</h5></div>`;
            noteHtml = noteHtml.replace("%id%", note.id);
            noteHtml = noteHtml.replace("%note%", note.note);
            noteHtml = noteHtml.replace("%date%", note.date);

            notesContainer.insertAdjacentHTML("afterbegin", noteHtml);
        });
    },

    //Method to delete note from UI
    deleteNoteFromUI(noteIndex) {
        const notesContainer = document.querySelector(
            this.selectors.notesContainer
        );
        const notes = notesContainer.childNodes;
        notesContainer.removeChild(notes[notes.length - 1 - noteIndex]);
    },
};

/* *****************************
 * Module which will have all the Events related code
 ***************************** */
const EventModule = {
    //Method to change application theme
    changeMode(UIMod) {
        const themeToggler = document.querySelector(
            UIMod.selectors.themeToggler
        );

        themeToggler.onclick = function () {
            let theme = localStorage.getItem("theme");
            if (!theme) {
                document.documentElement.className = "dark--theme";
                this.classList.add("translate");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.className = "light--theme";
                this.classList.remove("translate");
                localStorage.removeItem("theme");
            }
        };
    },

    //Method to add new notes in application
    addNote(AppMod, UIMod) {
        const noteEntryForm = document.querySelector(UIMod.selectors.noteForm);
        const inputField = document.querySelector(UIMod.selectors.inputField);

        noteEntryForm.addEventListener("submit", e => {
            //1. Prevent default behavior of form submission
            e.preventDefault();

            //2. get input value
            const noteText = inputField.value.trim("");

            //3. Empty the inputField & set focus
            inputField.value = "";
            inputField.focus();

            if (noteText.length > 0 && noteText.length <= 50) {
                //4. pass input value to AppModule
                const noteObj = AppMod.addNote(noteText);

                //5. pass returned note object to UIModule
                UIMod.addNoteInUI(noteObj);
            }
        });
    },

    //Method to check localStorage for saved notes & add them in UI and in the notesArray(in AppModule)
    addLocalStorageNotes(AppMod, UIMod) {
        window.onload = () => {
            const notes = JSON.parse(localStorage.getItem("notes"));
            const noteIds = JSON.parse(localStorage.getItem("noteIds"));

            if (notes && noteIds) {
                //Add localStorage saved Notes in UI
                UIMod.localNotesInUI(notes);

                //Add localStorage saved notes in notes Array
                AppMod.localNotesInArray(notes, noteIds);
            }

            //Changing the theme color if theme key is in localStorage
            document.querySelector(UIMod.selectors.inputField).focus();
            const themeToggler = document.querySelector(
                UIMod.selectors.themeToggler
            );

            const theme = localStorage.getItem("theme");
            if (theme) {
                document.documentElement.className = "dark--theme";
                themeToggler.classList.add("translate");
            }
        };
    },

    //Method to delete note
    removeNote(AppMod, UIMod) {
        const notesContainer = document.querySelector(
            UIMod.selectors.notesContainer
        );

        //listening for click event in notesContainer
        notesContainer.addEventListener("click", e => {
            const noteDelBtn = e.target.parentNode;

            //Check if target is the delete button
            if (noteDelBtn.matches("button")) {
                //1. Get the note and its id
                const note = noteDelBtn.parentNode.parentNode;
                const noteId = +note.id.split("-")[1];

                //2. delete the note from the noteArray & also from localStorage
                const noteIndex = AppMod.deleteNote(noteId);

                //3. delete the note from UI
                UIMod.deleteNoteFromUI(noteIndex);
            }
        });
    },

    //method to initialize all other methods
    init(AppMod, UIMod) {
        this.changeMode(UIMod);
        this.addNote(AppMod, UIMod);
        this.addLocalStorageNotes(AppMod, UIMod);
        this.removeNote(AppMod, UIMod);
    },
};

EventModule.init(AppModule, UIModule);
