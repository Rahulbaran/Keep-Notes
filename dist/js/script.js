"use strict";

//Module which will have all the APP related code
const AppModule = {};

//Module which will have all the UI related code
const UIModule = {};

// Module which will have all the Events related code
const EventModule = {
    changeMode() {
        const themeToggler = document.querySelector(".theme__toggler");

        let dark = false;
        themeToggler.onclick = function () {
            if (!dark) {
                document.documentElement.className = "dark--theme";
                this.classList.add("translate");
                dark = true;
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.className = "light--theme";
                this.classList.remove("translate");
                dark = false;
                localStorage.removeItem("theme");
            }
        };

        window.onload = function () {
            const theme = localStorage.getItem("theme");
            if (theme) {
                document.documentElement.className = "dark--theme";
                themeToggler.classList.add("translate");
                dark = true;
            }
        };
    },

    init() {
        this.changeMode();
    },
};

EventModule.init();
