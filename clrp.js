'use strict'

var clrp;
var clrpWindow = `
    <div class="clrp-window">
        <input name="clrp-text" type="text">
        <button name="clrp-ok-btn">Okay</button>
        <button name="clrp-close-btn">Close</button>
    </div>
`;

document.addEventListener("DOMContentLoaded", function() {
    clrp = new CLRP();

    // for closing clrp windows when clicking somewhere else
    window.addEventListener("click", function(event) {
        if (!event.target.matches('.clrp, .clrp-window, .clrp-window *')) {
            var clrpWindows = document.getElementsByClassName("clrp-window");
            for (var i = 0; i < clrpWindows.length; i++) {
                clrpWindows[i].remove();
            }
        }
    });
});

/**
 * Master class to manage all clrp objects
 */
class CLRP {
    // array of clrp inputs
    clrps = [];
    constructor() {
        this.init();
        this.addStyles();
    }

    init() {
        var inputs = document.getElementsByClassName("clrp");
        this.clrps = [];

        for (var i = 0; i < inputs.length; i++) {
            var element = new CLRPInput(inputs[i]);
            this.clrps.push(element);
        }
    }

    // add default styles to page head
    addStyles() {
        var style = document.createElement("style");
        var rules = `
            .clrp {
                --color-value: #ff0000;
                background-color: var(--color-value);
                color: var(--color-value);
                cursor: pointer;
                height: 2em;
                width: 2em;
                padding: 0;
            }

            .clrp-window {
                width: 10em;
                height: auto;
                padding: 0.5em;
                position: absolute;
                display: inline-block;
                text-align: center;
                background-color: #dfdfdf;
                border: solid 1px black;
            }

            .clrp-window input {
                width: auto;
                margin: 0;
            }
        `;

        style.innerHTML = rules;
        document.head.appendChild(style);
    }
}

class CLRPInput {
    constructor(element) {
        this.element = element;
        this.element.setAttribute("type", "button");
        this.element.addEventListener("click", this.setOpen);
        this.element.addEventListener("change", function(e) {
            this.setAttribute("style", "background-color: " + this.value + "; color: " + this.value + ";");
        });

        // apply existing color or make default
        var color = "#000000";
        if (this.element.hasAttribute("value")) {
            color = this.element.value;
        } else {
            this.element.value = color;
        }

        this.element.style.backgroundColor = color;
        this.element.style.color = color;
    }

    setOpen(event) {
//        this.classList.toggle("clrp-show");
        this.insertAdjacentHTML("afterend", clrpWindow);
        var cw = this.nextElementSibling;
        var text = cw.querySelector("input[name='clrp-text']");
        var okbtn = cw.querySelector("button[name='clrp-ok-btn']");
        var closebtn = cw.querySelector("button[name='clrp-close-btn']");
//        console.log(cw);
//        console.log(text);
//        console.log(okbtn);
//        console.log(cancelbtn);

        text.value = this.value;
        text.addEventListener('change', function(e) {
            // as long as somebody isn't inserting between window and button while
            // window is open, this should be fine.
            var c = this.parentElement.previousElementSibling;
            c.value = text.value;
            c.dispatchEvent(new Event('change'));
        });

        okbtn.addEventListener('click', function(e) {
            var c = this.parentElement.previousElementSibling;
            c.value = text.value;
            c.dispatchEvent(new Event('change'));
            this.parentElement.remove();
        });

        closebtn.addEventListener('click', function(e) {
            this.parentElement.remove();
        });
    }
}
