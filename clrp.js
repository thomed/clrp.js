'use strict'

var clrp;
var clrpWindow = `
    <div class="clrp-window">
        <div class="clrp-current" name="clrp-current"></div>
        <input name="clrp-text" type="text">
        <input class="clrp-hue-slider" name="clrp-hue-slider" type="range" min="0" max="360" step="1">
        <input class="clrp-light-slider" name="clrp-light-slider" type="range" min="0" max="100" step="1">
        <input class="clrp-sat-slider" name="clrp-sat-slider" type="range" min="0" max="100" step="1">
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
        style.id = "clrp-style"
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
                background-color: #f4f4f5;
                border: solid 1px black;
                border-radius: 3px;
                box-shadow: 1px 1px 1px;
                z-index: 1;
            }

            .clrp-window input {
                box-sizing: border-box;
                width: 100%;
                margin: 0;
            }

            .clrp-window > .clrp-current {
                width: auto;
                height: 5em;
                border: solid 1px black;
                background-color: hsl(var(--clrp-hue), var(--clrp-sat), var(--clrp-light));
            }

            .clrp-window input[type="range"]::-moz-range-track {
                height: 1.5em;
                border: solid 1px black;
            }

            .clrp-window input[type="range"]::-webkit-slider-runnable-track {
                height: 1.5em;
                border: solid 1px black;
            }

            .clrp-hue-slider::-moz-range-track {
                background: linear-gradient(to right,
                    hsl(0, 100%, 50%), hsl(60, 100%, 50%),
                    hsl(120, 100%, 50%), hsl(180, 100%, 50%),
                    hsl(240, 100%, 50%), hsl(300, 100%, 50%),
                    hsl(360, 100%, 50%));
            }

            .clrp-hue-slider::-webkit-slider-runnable-track {
                background: linear-gradient(to right,
                    hsl(0, 100%, 50%), hsl(60, 100%, 50%),
                    hsl(120, 100%, 50%), hsl(180, 100%, 50%),
                    hsl(240, 100%, 50%), hsl(300, 100%, 50%),
                    hsl(360, 100%, 50%));
            }

            .clrp-sat-slider::-moz-range-track {
                background: linear-gradient(to right,
                    hsl(0, 0%, 50%), hsl(var(--clrp-hue), 100%, var(--clrp-light)));
            }

            .clrp-sat-slider::-webkit-slider-runnable-track {
                background: linear-gradient(to right,
                    hsl(0, 0%, 50%), hsl(var(--clrp-hue), 100%, var(--clrp-light)));
            }

            .clrp-light-slider::-moz-range-track {
                background: linear-gradient(to right,
                    hsl(var(--clrp-hue), var(--clrp-sat), 0%),
                    hsl(var(--clrp-hue), var(--clrp-sat), 50%),
                    hsl(var(--clrp-hue), var(--clrp-sat), 100%));
            }

            .clrp-light-slider::-webkit-slider-runnable-track {
                background: linear-gradient(to right,
                    hsl(var(--clrp-hue), var(--clrp-sat), 0%),
                    hsl(var(--clrp-hue), var(--clrp-sat), 50%),
                    hsl(var(--clrp-hue), var(--clrp-sat), 100%));
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

        // apply existing color value or make default
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
        this.insertAdjacentHTML("afterend", clrpWindow);
        var cw = this.nextElementSibling;
        var text = cw.querySelector("input[name='clrp-text']");
        var hueSlider = cw.querySelector("input[name='clrp-hue-slider");
        var satSlider = cw.querySelector("input[name='clrp-sat-slider");
        var lightSlider = cw.querySelector("input[name='clrp-light-slider");
        var okbtn = cw.querySelector("button[name='clrp-ok-btn']");
        var closebtn = cw.querySelector("button[name='clrp-close-btn']");

        // var because event listener context
        var updateProperties = function() {
            cw.style.setProperty("--clrp-hue", hueSlider.value);
            cw.style.setProperty("--clrp-sat", satSlider.value + "%");
            cw.style.setProperty("--clrp-light", lightSlider.value + "%");
        };
        updateProperties();

        hueSlider.addEventListener('change', updateProperties);
        satSlider.addEventListener('change', updateProperties);
        lightSlider.addEventListener('change', updateProperties);

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

////////////////////////////////
// Color conversion functions //
////////////////////////////////
CLRP.hexRegex = /#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/g;
CLRP.rgbRegex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/g;
CLRP.hslRegex = /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/g;

CLRP.color2hex = function(c) {
    var color = CLRP.parseColor(c);
    if (color.format == "hex") {
        return "#" + color.r + color.g + color.b;
    }
    
    if (color.format == "hsl") {

    }
};

CLRP.color2hsl = function(c) {
    var color = CLRP.parseColor(c);
    console.log(color);
};

CLRP.color2rgb = function(c) {
    var color = CLRP.parseColor(c);
    if (color.format == 'hsl') {
        var r = CLRP.hsl2rgb(color.h, color.s, color.l);
        return `rgb(${r.r}, ${r.g}, ${r.b})`;
    }
    console.log(color);
};

// adapted from hsl wikipedia page
CLRP.hsl2rgb = function(h, s, l) {
    var sp = s / 100;
    var lp = l / 100;
    var chroma = (1 - Math.abs(2 * lp - 1)) * sp;
    var x = chroma * (1 - Math.abs((h / 60) % 2 - 1));
    var m = lp - (chroma / 2);
    var result = {};
    var rgb;

    var hp = Math.ceil(h / 60);
    switch(hp) {
        case 1:
            rgb = [chroma, x, 0];
            break;
        case 2:
            rgb = [x, chroma, 0];
            break;
        case 3:
            rgb = [0, chroma, x];
            break;
        case 4:
            rgb = [0, x, chroma];
            break;
        case 5:
            rgb = [x, 0, chroma];
            break;
        case 6:
            rgb = [chroma, 0, x];
            break;
        default:
            rgb = [0, 0, 0];
    }

    result.format = "rgb";
    result.r = Math.round((m + rgb[0]) * 255);
    result.g = Math.round((m + rgb[1]) * 255);
    result.b = Math.round((m + rgb[2]) * 255);
    return result;
}

CLRP.rgb2hex = function(r, g, b) {

}

CLRP.hex2rgb = function(hr, hg, hb) {

}

CLRP.parseColor = function(color) {
    var result = {};
    CLRP.hexRegex.lastIndex = 0;
    CLRP.hslRegex.lastIndex = 0;
    CLRP.rgbRegex.lastIndex = 0;

    var cmatch;
    if ((cmatch = CLRP.hexRegex.exec(color)) != null) {
        result.format = "hex";
        result.r = cmatch[1].toLowerCase();
        result.g = cmatch[2].toLowerCase();
        result.b = cmatch[3].toLowerCase();
    } else if ((cmatch = CLRP.rgbRegex.exec(color)) != null) {
        result.format = "rgb";
        result.r = parseInt(cmatch[1]);
        result.b = parseInt(cmatch[2]);
        result.g = parseInt(cmatch[3]);
    } else if ((cmatch = CLRP.hslRegex.exec(color)) != null) {
        result.format = "hsl";
        result.h = parseInt(cmatch[1]);
        result.s = parseInt(cmatch[2]);
        result.l = parseInt(cmatch[3]);
    } else {
        result.format = "unknown";
    }

    console.log(result);
    return result;
};
