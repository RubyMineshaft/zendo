class BoardNode {
  constructor() {
      this.color = 0
      this.connections = new Set()
  }
}

class Board {
  constructor(width, height) {
      this.size = width;
      this.width = width
      this.height = height
      this.turn = 1
      this.nodes = new Set()
      this.color = 'gray';
      

      for (let x = 0; x < this.width; x ++) {
          this[x] = {}
          for (let y = 0; y < this.height; y ++) {
              let node = new BoardNode()
              this[x][y] = node
          }
      }

      for (let x = 0; x + 1 < this.width; x ++) {
          for (let y = 0; y < this.height; y ++) {
              this[x][y].connections.add(this[x+1][y])
              this[x+1][y].connections.add(this[x][y])
          }
      }

      for (let x = 0; x < this.width; x ++) {
          for (let y = 0; y + 1 < this.height; y ++) {
              this[x][y].connections.add(this[x][y+1])
              this[x][y+1].connections.add(this[x][y])
          }
      }
  }
}


let response;
let size = 7;
let board = new Board(size, size);
const R = 20;
const D = 2 * R;
  let width = board.width * D + D;
  let height = board.height * D + D;

function setup() {
  placeColor = 1
  bg = board.color

    let canv = createCanvas(width, height).mouseClicked(place);
    canv.addClass('copyable')
    canv.parent("board")
    ellipseMode(RADIUS)
    strokeCap(PROJECT)
    textSize(18)
    textAlign(CENTER, CENTER)

    copyButton = createButton('Save & Copy');
    copyButton.position(19, 19);
    copyButton.mousePressed(saveToServer);

    saveButton = createButton('Download to Device');
    saveButton.position(117, 19);
    saveButton.mousePressed(saveImage);

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

    checkButton = createButton('Check')
    checkButton.mousePressed(check)

    let pos = canv.position()
    checkButton.position(pos.x  + width/2 , pos.y - 25)

}

function setSize(newSize) {
  size = newSize;
  resizeCanvas((size * D + D), (size * D + D))
  board = new Board(size, size);
  width = board.width * D + D;
  height = board.height * D + D;
}



function draw() {
    background(board.color)

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

    textSize(25);
    textAlign(LEFT);
    if (board.id) {
      drawWords();
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
    setGray();
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
  board.color = 'lime';
}

function setRed() {
  board.color = "red";
}

function setGray() {
  board.color = "gray";
}

function copyImage() {
  copyCanvasContentsToClipboard(document.querySelector(".copyable"), copiedText, onError);
}

function copiedText(data) {
  console.log("Copied!");

  let copiedText = createSpan('Copied to clipboard!');
    setTimeout(() => {  copiedText.remove(); }, 2000);
}

function onError(error) {
  console.log(error);
}

const scaleCanvas = (canvas, scale) => {
  const scaledCanvas = document.createElement('canvas');
  scaledCanvas.width = canvas.width * scale;
  scaledCanvas.height = canvas.height * scale;

  scaledCanvas
    .getContext('2d')
    .drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

  return scaledCanvas;
};

function copyCanvasContentsToClipboard(canvas, onDone, onError) {
  scaleCanvas(canvas, .5).toBlob(function (blob) {
    let data = [new ClipboardItem({ 'image/png': blob })];

    navigator.clipboard.write(data).then(function () {
      onDone(data);
    }, function (err) {
      onError(err);
    })
  });
}

function saveImage() {
  postToAPI(saveToFile);
}

function saveToFile() {
  const canvas = scaleCanvas(document.querySelector(".copyable"), .5);

  saveCanvas(canvas, `Koan_${board.id}`, 'png');
}

function drawWords() {
  if (board.color == "lime") {
    fill(0);
  } else {
    fill("white");
  }

  text(board.id, -30, height - 55);
}

function postToAPI(after) {
  const data = {
    "board": {
      "size": board.size,
      "state": JSON.stringify(board)
    }
  };

  fetch("https://agile-sands-06400.herokuapp.com/api/v1/boards", {
    method: "post",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json())
    .then(res => {
      if (res.errors) {
        console.log(res.errors)
      } else {
        updateBoard(res);
      }})
    .then( () => {
      setTimeout(() => {  after() }, 100);
    }).catch(err => console.log(err))

}

function saveToServer() {
  postToAPI(copyImage);
}

$(document).ready(function() {

  $('#menuSave').on('click', function(e){
    saveToServer();
  })

  $('#menuDownload').on('click', function(e){
    saveImage();
  })

  $('form').on('submit', function(e){
    e.preventDefault();
    let id = document.getElementById('loadId').value;
    let url = "https://agile-sands-06400.herokuapp.com/api/v1/boards/" + id;

    document.getElementById('loadId').value = '';

    fetch(url, {
      method: "get"
    }).then(res => res.json())
      .then(res => {
        if (res.errors) {
          console.log(res.errors)
        } else {
          updateBoard(res);
        }}).catch(err => console.error(err));

  });
});

function updateBoard(res) {

  console.log(res);

  if (size !== res.data.size) {
    size = res.data.size;
    setSize(size);
  }

  board = JSON.parse(res.data.state);
  board.id = res.data.id;
}

function check() {
  checkMatch() ? setGreen() : setRed();
}

function checkMatch() {
  for (bx = 0; bx < board.size; bx++) { //for each col
    for (by = 0; by < board.size; by++) { // for each position in col
      if (board[bx][by].color === 1) {
        let col = 0;
        let row = 0;
        for (let i = 0; i < board.size; i++) {
          if (board[bx][i].color !== 0) col++;
          if (board[i][by].color !== 0) row++;
        }
        if (col === 1 && row === 1) {
          return true;
        }
      }
    }
  }
  return false;
}

let menuVisible = false;


$(document).ready(function() {

  window.addEventListener("contextmenu", e => {
    e.preventDefault();
  });

  const menu = document.getElementById("menu");
  let menuVisible = false;

  const toggleMenu = command => {
    menu.style.display = command === "show" ? "block" : "none";
    menuVisible = !menuVisible;
  };

  window.addEventListener("contextmenu", e => {
    e.preventDefault();
    const origin = {
      left: e.pageX,
      top: e.pageY
    };
    setPosition(origin);
    return false;
  });


  const setPosition = ({ top, left }) => {
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    toggleMenu('show');
  };

  window.addEventListener("click", e => {
    if(menuVisible)toggleMenu("hide");
  });

});
