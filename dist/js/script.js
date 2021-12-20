"use strict";

/* ****************************
 * Module which will have all the APP related code
 ***************************** */
const AppModule = {
    noteArray: [],

    // Method to add note into an array & also in localStorage
    addNote(note) {
        //1. Create a note object containing note with an id & date
        const date = new Date();
        let noteObj;
        if (this.noteArray.length === 0) {
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
                id: this.noteArray[this.noteArray.length - 1].id + 1,
                date: `${date.getDate()}/${
                    date.getMonth() + 1
                }/${date.getFullYear()}`,
            };
        }

        //2. Push the note object in the noteArray
        this.noteArray.push(noteObj);

        //3. Store the notes in localStorage
        localStorage.setItem("notes", JSON.stringify(this.noteArray));

        //4.Return the note object
        return noteObj;
    },

    //Method to add localStorage notes in Array
    localNotesInArray(notes) {
        this.noteArray = notes;
    },
};

/* ****************************
 * Module which will have all the UI related code
 ***************************** */
const UIModule = {
    //Method to add note in UI
    addNoteInUI(noteObj) {
        const notesContainer = document.querySelector(".notes__container");

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
        let notesContainer = document.querySelector(".notes__container");

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
};

/* *****************************
 * Module which will have all the Events related code
 ***************************** */
const EventModule = {
    //Method to change application theme
    changeMode() {
        const themeToggler = document.querySelector(".theme__toggler");

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
        const form = document.querySelector(".note__entry__form");
        const inputField = document.querySelector(".text__field");
        //const addBtn = document.querySelector(".note__add__btn span");

        form.addEventListener("submit", e => {
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
    addLocalNotes(AppMod, UIMod) {
        window.onload = () => {
            const notes = JSON.parse(localStorage.getItem("notes"));

            if (notes) {
                //Add localStorage saved Notes in UI
                UIMod.localNotesInUI(notes);

                //Add localStorage saved notes in notes Array
                AppMod.localNotesInArray(notes);
            }

            //Changing the theme color if theme key is in localStorage
            document.querySelector(".text__field").focus();
            const themeToggler = document.querySelector(".theme__toggler");

            const theme = localStorage.getItem("theme");
            if (theme) {
                document.documentElement.className = "dark--theme";
                themeToggler.classList.add("translate");
            }
        };
    },

    //method to initialize all other methods
    init(AppMod, UIMod) {
        this.changeMode();
        this.addNote(AppMod, UIMod);
        this.addLocalNotes(AppMod, UIMod);
    },
};

EventModule.init(AppModule, UIModule);
