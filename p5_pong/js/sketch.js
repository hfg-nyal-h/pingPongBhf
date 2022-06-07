let ball, p1, p2, retroFont;
let go = false;

let video;
let poseNet;
let poses = [];
let avarage;
//TODO lastavare without a funciton
let lastavarage;

function preload() {
    retroFont = loadFont('ARCADECLASSIC.TTF');
}

function setup() {
    createCanvas(640, 900)
    ball = new Ball(width / 2, height / 2, 10, 10);
    p1 = new Paddle(width / 2 - 50, 20, height / 6, 10); //height / 6
    p2 = new Paddle(width / 2 - 50, height - 20, height / 6, 10);
    posenet5()

}


function draw() {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    movePaddles();
    pop();
    backdrop();

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
    // asci II code 
    // 65 = 'a'
    if (keyIsDown(65)) {
        p1.move(-5);
    }
    // 68 = 'd'
    if (keyIsDown(68)) {
        p1.move(5);
    }
    p2.move(width - avarage - ((height / 6) / 2));

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

// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */






function posenet5() {
    video = createCapture(VIDEO);


    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, modelReady);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', function(results) {
        poses = results;
        if (poses[0]) {
            avarage = (poses[0].pose.keypoints[5].position.x + poses[0].pose.keypoints[6].position.x) / 2
            lastavarage = avarage
        }
    });
    // Hide the video element, and just show the canvas
    video.hide();
}

function modelReady() {
    select('#status').html('Model Loaded');
}