// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

//

let video;
let poseNet;
let poses = [];
let pose = [];
let maximumPeople = 1; // max number of people to track

// MQTT client details:
let broker = {
  hostname: 'mqtt.ava.hfg.design',
  port: 443,
};
// MQTT client:
let client;
// client credentials:
let creds = {
  clientID: 'p5Client',
  userName: 'public',
  password: 'public'
}
// topic to subscribe to when you connect:
let topic = 'notes';

// a pushbutton to send messages
let sendButton;
let localDiv;
let remoteDiv;

// intensity of the circle in the middle
let intensity = 255;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();

  ///////

  createCanvas(400, 400);
  // Create an MQTT client:
  client = new Paho.MQTT.Client(broker.hostname, Number(broker.port), creds.clientID);
  // set callback handlers for the client:
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  // connect to the MQTT broker:
  client.connect(
      {
          onSuccess: onConnect,       // callback function for when you connect
          useSSL: true                // use SSL
      }
  );
  // create the send button:
  sendButton = createButton('send a message');
  sendButton.position(20, 20);
  sendButton.mousePressed(sendMqttMessage);
  // create a div for local messages:
  localDiv = createDiv('local messages will go here');
  localDiv.position(20, 50);
  localDiv.style('color', '#fff');
  // create a div for the response:
  remoteDiv = createDiv('waiting for messages');
  remoteDiv.position(20, 80);
  remoteDiv.style('color', '#fff');
}

function modelReady() {
  select("#status").html("Model Loaded");
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  gotPoses();

  background(50);
  // draw a circle whose brightness changes when a message is received:
  fill(intensity);
  circle(width/2, height/2, width/2);
// subtract one from the brightness of the circle:
  if (intensity > 0) {
      intensity--;
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    const pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j += 1) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      const keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i += 1) {
    const skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j += 1) {
      const partA = skeleton[j][0];
      const partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
     // console.log(poses);
    }
  }
}

function gotPoses(maximumPeople) {

 // console.log(poses)
//if (poses.length == maximumPeople ) {
if(poses.length > 0 ) {
  pose = poses[0].pose;
  shoulderPose = {};
  shoulderPose.shoulderLeft = pose.keypoints[5].position.x;
  shoulderPose.confidenceLeft = pose.keypoints[5].score;
  shoulderPose.shoulderRight = pose.keypoints[6].position.x;
  shoulderPose.confidenceRight = pose.keypoints[6].score;

  //console.log(shoulderPose);

 sendMqttMessage(shoulderPose);
  
} else if (poses.length > maximumPeople) {
  console.log("to many People")
}
} 


//////


// called when the client connects
function onConnect() {
  localDiv.html('client is connected');
  client.subscribe(topic);
}

// called when the client loses its connection
function onConnectionLost(response) {
  if (response.errorCode !== 0) {
      localDiv.html('onConnectionLost:' + response.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  remoteDiv.html('I got a message:' + message.payloadString);
  let  incomingNumber = parseInt(message.payloadString);
  if (incomingNumber > 0) {
      intensity = 255;
  }
}

// called when you want to send a message:
function sendMqttMessage(shoulderpose) {
 //console.log("hallo")
  // if the client is connected to the MQTT broker:
  if (client.isConnected()) {
      // make a string with a random number form 0 to 15:
     // let msg = String(round(random(15)));
      let msg = JSON.stringify(shoulderpose);
      // start an MQTT message:
      message = new Paho.MQTT.Message(msg);
     // console.log(message)
      // choose the destination topic:
      message.destinationName = topic;
      // send it:
      client.send(message);
      // print what you sent:
      localDiv.html('I sent: ' + message.payloadString);
  }
}