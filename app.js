const CANVAS = document.querySelector("canvas");
const SHOW_BUTTON = document.querySelector("#showClock");
const STOP_BUTTON = document.querySelector("#stopClock");
const CLEAR_BUTTON = document.querySelector("#clear");
const WIDTH = document.querySelector("#width");
const MILLI = document.querySelector("#milli");

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
