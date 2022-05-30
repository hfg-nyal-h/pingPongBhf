
require('dotenv').config()
//mqtt
const mqtt = require('mqtt')
const topic = process.env.MQTT_TOPIC
const mqttClient = mqtt.connect(process.env.MQTT_HOST);


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






