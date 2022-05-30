let ball, p1, p2, retroFont;
let go = false;

function preload() {
    retroFont = loadFont('ARCADECLASSIC.TTF');
}

function setup() {
    createCanvas(400, 700)
    ball = new Ball(width / 2, height / 2, 10, 10);
    //TODO akteull ist das Paddle p2 noch nicht richtig im bild reim Rendern 
    p1 = new Paddle(width / 2 - 50, 20, 100, 10);
    p2 = new Paddle(width / 2 - 50, height - 50, 100, 10);
}


function draw() {
    background(52);
    backdrop();

    movePaddles();
    p1.show();
    p2.show();

    let oob = ball.outOfBounds();
    if (oob) {
        // the ball stays at spawn till go = true
        go = false;
        if (oob == 'right') {
            p1.score++;
        } else {
            p2.score++
        }
    }

    if (go) ball.update();

    ball.hit(p1, p2);

    ball.show()
}


function movePaddles() {
    // 65 = 'a'
    if (keyIsDown(65)) {
        p1.move(-5);
    }

    // 90 = 'z'
    if (keyIsDown(90)) {
        p1.move(5);
    }

    // 75 = 'k'
    if (keyIsDown(75)) {
        p2.move(-5);
    }

    // 77 = 'm'
    if (keyIsDown(77)) {
        p2.move(5);
    }
}

function keyTyped() {
    if (key == ' ') {
        go = true;
    }

    if (key == 'r') {
        p1.score = 0;
        p2.score = 0;
        ball.resetball();
        go = false;
    }

    // for safety
    return false;
}