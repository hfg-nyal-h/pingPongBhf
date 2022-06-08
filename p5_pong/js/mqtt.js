//Dieser Client wird den Master Client übernehmen
let clientID = "p5ClientSlave";


// MQTT COMMUNICATION
// MQTT client details:
let broker = {
    hostname: "mqtt.ava.hfg.design",
    port: 443,
};
// MQTT client:
let client;
// client credentials:
let creds = {
    clientID: clientID,
    userName: "public",
    password: "public",
};
// topic to subscribe to when you connect:
let topic = "pingPongBahnhof/paddlePosition/GameOne/PlayerSlave";
let opponentTopic = "pingPongBahnhof/paddlePosition/GameOne/PlayerMaster";
//Das andere Thema wird: "pingPongBahnhof/paddlePosition/GameOne/PlayerSlave"

// called when the client connects
function onConnect() {
    console.log('clientSlave is connected');
    client.subscribe(opponentTopic);
}

// called when the client loses its connection
function onConnectionLost(response) {
    if (response.errorCode !== 0) {
        console.log('onConnectionLost:' + response.errorMessage);
    }
}

// called when a message arrives
function onMessageArrived(message) {
    // console.log('I got a message:' + message.payloadString);
    //Hier werden Slave koordinaten verarbeitet.
    let values = JSON.parse(message.payloadString);
    p1.move(values.average)
    console.log(values)
    ball.pos.x = width - values.ballPositionX;
    ball.pos.y = height - values.ballPositionY;
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
    }
}