function setup() {
    placeColor = 1
    bg = "gray"
    R = 20
    D = 2 * R
    board = new Board(7, 7)
    width = board.width * D + D
    height = board.height * D + D
    createCanvas(width, height).mouseClicked(place)
    ellipseMode(RADIUS)
    strokeCap(PROJECT)
    textSize(25)
    textAlign(CENTER, CENTER)
    button = createButton('Save as image')
    button.position(19, 19)
    button.mousePressed(saveCanvas)
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

    let x = floor(map(mouseX, R, width - R, 0, board.width, true))
    let y = floor(map(mouseY, R, height - R, 0, board.height, true))
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
    if (key == 'q') bg = 'gray'
    if (key == 'w') bg = 'lime'
    if (key == 'e') bg = 'red'

    if (key == 's') saveCanvas()
}
