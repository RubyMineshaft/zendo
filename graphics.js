

let size = 7;
let board = new Board(size, size);
const R = 20;
const D = 2 * R;
  let width = board.width * D + D;
  let height = board.height * D + D;

function setup() {
  placeColor = 1
  bg = "gray"

    let canv = createCanvas(width, height).mouseClicked(place);
    canv.addClass('copyable');
    ellipseMode(RADIUS)
    strokeCap(PROJECT)
    textSize(25)
    textAlign(CENTER, CENTER)

    saveButton = createButton('Copy Image');
    saveButton.position(19, 19);
    saveButton.mousePressed(copyImage);

    fiveFive = createButton('5 x 5');
    fiveFive.position(19,50);
    fiveFive.mousePressed(resizeBoard5);

    sevenSeven = createButton('7 x 7');
    sevenSeven.position(19, 75);
    sevenSeven.mousePressed(resizeBoard7);

    nineNine = createButton('9 x 9');
    nineNine.position(19, 100);
    nineNine.mousePressed(resizeBoard9);

    buttonGreen = createButton("Green");
    buttonGreen.position(19, 150);
    buttonGreen.mousePressed(setGreen);

    buttonRed = createButton("Red");
    buttonRed.position(19, 175);
    buttonRed.mousePressed(setRed);

    buttonGray = createButton("Gray");
    buttonGray.position(19, 200);
    buttonGray.mousePressed(setGray);
}

function setSize(newSize) {
  size = newSize;
  board = new Board(size, size);
  width = board.width * D + D;
  height = board.height * D + D;
  resizeCanvas((size * D + D), (size * D + D));
}



function draw() {
    background(bg)

    stroke(0)
    strokeWeight(2)

    translate(D, D)

    for (let x = 0; x < board.width; x ++) {
        line(x * D, 0, x * D, (board.height - 1) * D)
    }

    for (let y = 0; y < board.height; y ++) {
        line(0, y * D, (board.width - 1) * D, y * D)
    }

    noStroke()

    for (let x = 0; x < board.width; x ++) {
        for (let y = 0; y < board.height; y ++) {
            let node = board[x][y]
            if (node.color) {
                fill((node.color === -1) * 255)
                circle(x * D, y * D, R)
            }
        }
    }

    let x = floor(map(mouseX, R, width - R, 0, width, true))
    let y = floor(map(mouseY, R, height - R, 0, height, true))
    if (board[x] && board[x][y]) {
        let node = board[x][y]
        if (keyIsDown(90)) node.color = 1
        if (keyIsDown(88)) node.color = -1
        if (keyIsDown(67)) node.color = 0
    }
}

function place() {
    let x = floor(map(mouseX, R, width - R, 0, board.width, true))
    let y = floor(map(mouseY, R, height - R, 0, board.height, true))
    if (board[x] && board[x][y]) {
        let node = board[x][y]
        if (keyIsDown(SHIFT)) node.color += 2
        else node.color += 1
        if (node.color > 1) node.color -= 3
    }
}

function keyPressed() {
    if (key == 'q') setGray();
    if (key == 'w') setGreen();
    if (key == 'e') setRed();

    if (key == 's') saveCanvas();
}

function resizeBoard5() {
  setSize(5);
}

function resizeBoard7() {
  setSize(7);
}

function resizeBoard9() {
  setSize(9);
}

function setGreen() {
  bg = 'lime';
}

function setRed() {
  bg = "red";
}

function setGray() {
  bg = "gray";
}

function copyImage() {
  copyCanvasContentsToClipboard(document.querySelector(".copyable"), copiedText, onError);
  // html2canvas(document.querySelector(".copyable"))
  //   .then(canvas => canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({'image/png': blob})])));
  // let copiedText = createSpan('Copied to clipboard!');
  // setTimeout(() => {  copiedText.remove(); }, 2000);
}

function copiedText() {
  console.log("Copied!");
  let copiedText = createSpan('Copied to clipboard!');
    setTimeout(() => {  copiedText.remove(); }, 2000);
}

function onError(error) {
  console.log(error);
}

function copyCanvasContentsToClipboard(canvas, onDone, onError) {
  canvas.toBlob(function (blob) {
    let data = [new ClipboardItem({ 'image/png': blob })];

    navigator.clipboard.write(data).then(function () {
      onDone();
    }, function (err) {
      onError(err);
    })
  });
}
