
//require('dotenv').config()
//mqtt
//const mqtt = require('mqtt')
const topic = "/pingPongBahnhof/"
const mqttClient = mqtt.connect("http://193.196.159.141");


mqttClient.on("connect", function () {
    mqttClient.subscribe(topic, function (err) {
        if (err) {
            throw (err);
        }
        else {
            mqttClient.publish(topic + "logs/",  + " connected " )
        }
    })
    console.log("connectet")
})
mqttClient.on("message", async (topic, message) => {
    console.log(message)
  
});






