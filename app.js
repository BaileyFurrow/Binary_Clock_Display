const CANVAS = document.querySelector("canvas");
const SHOW_BUTTON = document.querySelector("#showClock");
const STOP_BUTTON = document.querySelector("#stopClock");
const CLEAR_BUTTON = document.querySelector("#clear");
const WIDTH = document.querySelector("#width");
const MILLI = document.querySelector("#milli");
const HELP_LINK = document.getElementById("helpWindowLink");

let animate,
    time = [];

/**
 * BinaryDisplay class
 * Displays a number (0-255) in a binary cell format
 * @param {number} num      Number to display
 * @param {number} x        When multiple instances are used, x-coord of this
 *                          instance
 * @param {number} y        When multiple instances are used, y-coord of this
                            instance
 * @param {number} size     Size of each cell
 * @param {number} spacing  Padding space to put between each cell
 */
class BinaryDisplay {
    constructor(num = 0, x = 0, y = 0, size = 10, spacing = 2, canvas=CANVAS) {
        this.posX = x;
        this.posY = y;
        this.setNumber(num);
        this.size = size;
        this.spacing = spacing;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.offColor = "#bbf";
        this.onColor = "#00f";
        this.canvasHeight = 4 * this.size + 3 * this.spacing;
        this.canvasWidth = 2 * this.size + this.spacing;
        this.x = (2 * this.spacing + 2 * this.size) * this.posX;
        this.y = (2 * this.spacing + 2 * this.size) * this.posY;
    }
    setNumber(number) {
        try {
            if (number < 0 || number > 255)
                throw new RangeError("The number must be between 0-255.");
            this.num = Number(number);
            this.binNum = this.num.toString(2).padStart(8, "0");
            // console.log(this.num, this.binNum);
        } catch (e) {
            console.error("Invalid input!");
            console.error(e.toString());
        }
    }

    drawSquare(x, y, blank, i) {
        this.context.fillStyle = blank ? this.offColor : this.onColor;
        this.context.fillRect(
            (this.spacing + this.size) * y + this.x,
            (this.spacing + this.size) * x + this.y,
            this.size,
            this.size
        );
    }

    drawNumber() {
        this.binNum.split("").forEach((val, i) => {
            let fill = val != "1";
            this.drawSquare(i % 4, Math.floor(i / 4), fill, i);
        });
    }

    update(newNum) {
        this.setNumber(newNum);
        this.drawNumber();
    }
}

function tickTock(size = 10, spacingMult = 1) {
    let now = new Date();
    let timeValues = [now.getHours(), now.getMinutes(), now.getSeconds()];
    // Milliseconds are rounded to the nearest tens spot
    if (MILLI.checked) timeValues.push(Math.floor(now.getMilliseconds() / 10));
    time.forEach((item, index) => {
        item.update(timeValues[index]);
    });
}

function clearCanvas() {
    let ctx = CANVAS.getContext('2d');
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
}

SHOW_BUTTON.addEventListener("click", () => {
    if (animate) clearInterval(animate);
    time = [];
    let size = 30,
        spacingMult = 1.1;
    clearCanvas();
    let now = new Date();
    time.push(new BinaryDisplay(now.getHours(), 0, 0, size));
    time.push(new BinaryDisplay(now.getMinutes(), 1 * spacingMult, 0, size));
    time.push(new BinaryDisplay(now.getSeconds(), 2 * spacingMult, 0, size));
    if (MILLI.checked)
        time.push(new BinaryDisplay(Math.floor(now.getMilliseconds() / 10), 3 * spacingMult, 0, size));
    CANVAS.height = Math.max(...time.map((elem) => elem.canvasHeight));
    let lastElem = time.length - 1;
    CANVAS.width = time[lastElem].x + time[lastElem].canvasWidth;
    animate = setInterval(tickTock, 10, 30, 1.1);
});

STOP_BUTTON.addEventListener("click", () => {
    clearInterval(animate);
});

CLEAR_BUTTON.addEventListener("click", clearCanvas);

WIDTH.addEventListener("change", () => {
    document.querySelector(":root").style.setProperty("--canvas-width", `${WIDTH.value}px`);
});


// How to read help window

HELP_LINK.addEventListener('click', () => {
    let txtHelp = `
        <h2>Reading a Binary Clock</h2>
        <p>Each part of the clock (hours, minutes, seconds, and milliseconds) is represented as a byte (8 bits), with
        each 2x4 grid of squares representing one byte and each square representing one byte. It is meant to be read
        column-by-column. See below for a few examples:</p>
        <div style="display: inline-block; margin: 10px;">
        <h4>42</h4>
        <canvas id="example1"></canvas>
        </div>
        <div style="display: inline-block; margin: 0 10px;">
        <h4>59</h4>
        <canvas id="example2"></canvas>
        </div>
        <div style="display: inline-block; margin: 10px;">
        <h4>24</h4>
        <canvas id="example3"></canvas>
        </div>
        <div style="display: inline-block; margin: 10px;">
        <h4>19</h4>
        <canvas id="example4"></canvas>
        </div>
        <p>Interestingly, the first two squares in the first column will never be used, as no part of the clock will
        ever count higher than 59, and a byte can represent numbers as large as 255. These unused spaces were left in 
        intentionally for symmetry.</p>
        <button style="display: flex; align-items: center; margin: 5px auto" onClick="window.close()">Close</button>
    `;
    let helpWindow = window.open('','','height=600,width=600,menubar=no,status=no');
    helpWindow.document.body.innerHTML = txtHelp;
    helpWindow.document.body.style.lineHeight = "1.2";
    helpWindow.document.body.style.margin = "8px";
    helpWindow.document.title = "How to Read a Binary Clock";
    let helpStyle = helpWindow.document.createElement('link');
    helpStyle.rel = 'stylesheet';
    helpStyle.href = 'style.css';
    helpWindow.document.head.append(helpStyle);

    let example1 = helpWindow.document.getElementById("example1");
    let e1Obj = new BinaryDisplay(42, 0, 0, 50, 2, example1);
    example1.height = e1Obj.canvasHeight;
    example1.width = e1Obj.canvasWidth;
    e1Obj.drawNumber();

    let example2 = helpWindow.document.getElementById("example2");
    let e2Obj = new BinaryDisplay(59, 0, 0, 50, 2, example2);
    example2.height = e2Obj.canvasHeight;
    example2.width = e2Obj.canvasWidth;
    e2Obj.drawNumber();

    let example3 = helpWindow.document.getElementById("example3");
    let e3Obj = new BinaryDisplay(24, 0, 0, 50, 2, example3);
    example3.height = e3Obj.canvasHeight;
    example3.width = e3Obj.canvasWidth;
    e3Obj.drawNumber();

    let example4 = helpWindow.document.getElementById("example4");
    let e4Obj = new BinaryDisplay(19, 0, 0, 50, 2, example4);
    example4.height = e4Obj.canvasHeight;
    example4.width = e4Obj.canvasWidth;
    e4Obj.drawNumber();

    let canvases = helpWindow.document.querySelectorAll("canvas");
    canvases.forEach(c => {
        let ctx = c.getContext("2d");
        ctx.globalAlpha = 0.5;
        ctx.font = "50px sans-serif";
        ctx.fillStyle = "#000000";
        ctx.fillText("128", 0, 40, 50);
        ctx.fillText("64", 0, 95, 50);
        ctx.fillText("32", 0, 145, 50);
        ctx.fillText("16", 0, 195, 50);

        ctx.fillText("8", 65, 40, 50);
        ctx.fillText("4", 65, 95, 50);
        ctx.fillText("2", 65, 145, 50);
        ctx.fillText("1", 65, 195, 50);
    })
});