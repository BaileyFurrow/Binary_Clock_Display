const CANVAS = document.querySelector('canvas');
const CTX = CANVAS.getContext('2d');
const SHOW_BUTTON = document.querySelector('#showClock');
const STOP_BUTTON = document.querySelector('#stopClock');
const CLEAR_BUTTON = document.querySelector('#clear');
const WIDTH = document.querySelector('#width');
const MILLI = document.querySelector('#milli');

let animate, time = [];

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
  constructor(num=0, x=0, y=0, size=10, spacing=2) {
    this.posX = x;
    this.posY = y;
    this.setNumber(num);
    this.size = size;
    this.spacing = spacing;
    this.offColor = '#bbf';
    this.onColor = '#00f';
    this.canvasHeight = 4 * this.size + 3 * this.spacing;
  }
  setNumber(number) {
    try {
      if (number < 0 || number > 255)
        throw new RangeError('The number must be between 0-255.');
      this.num = Number(number);
      this.binNum = this.num.toString(2).padStart(8, '0');
      console.log(this.num, this.binNum);
    } catch(e) {
      console.error('Invalid input!');
      console.error(e.toString());
    }
  }
  
  drawSquare(x, y, blank, i) {
    CTX.fillStyle = (blank) ? this.offColor : this.onColor;
    CTX.fillRect(
      (this.spacing+this.size)*y + (2*this.spacing+2*this.size)*this.posX, 
      (this.spacing+this.size)*x + (2*this.spacing+2*this.size)*this.posY,
      this.size, 
      this.size
    );
  }

  drawNumber() {
    this.binNum.split('').forEach((val, i) => {
      let fill = val != '1';
      this.drawSquare(i % 4, Math.floor(i / 4), fill, i);
    });
  }
  
  update(newNum) {
    this.setNumber(newNum);
    this.drawNumber();
  }
  
  static clear() {
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
  }
}

function tickTock(size=10, spacingMult=1) {
  let now = new Date();
  let timeValues = [now.getHours(), now.getMinutes(), now.getSeconds()];
  // Milliseconds are rounded to the nearest tens spot
  if (MILLI.checked)
    timeValues.push(Math.floor(now.getMilliseconds()/10));
  time.forEach((item, index) => {
    item.update(timeValues[index]);
  });
}

SHOW_BUTTON.addEventListener('click', () => {
  if (animate) clearInterval(animate);
  time = [];
  let size = 30, spacingMult = 1.1;
  BinaryDisplay.clear();
  let now = new Date();
  time.push(new BinaryDisplay(now.getHours(), 0, 0, size));
  time.push(new BinaryDisplay(now.getMinutes(), 1 * spacingMult, 0, size));
  time.push(new BinaryDisplay(now.getSeconds(), 2 * spacingMult, 0, size));
  if (MILLI.checked)
    time.push(new BinaryDisplay(
      Math.floor(now.getMilliseconds()/10),
      3 * spacingMult,
      0,
      size
    ));
  CANVAS.height = Math.max(...time.map(elem => elem.canvasHeight));
  animate = setInterval(tickTock, 10, 30, 1.1);
});

STOP_BUTTON.addEventListener('click', () => {
  clearInterval(animate);
});

CLEAR_BUTTON.addEventListener('click', () => {
  BinaryDisplay.clear();
});

WIDTH.addEventListener('change', () => {
  document.querySelector(':root')
          .style.setProperty('--canvas-width', `${WIDTH.value}px`);
});
