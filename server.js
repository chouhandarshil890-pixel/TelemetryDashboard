const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const mqtt = require("mqtt");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const mqttClient = mqtt.connect("mqtt://broker.hivemq.com");

mqttClient.on("connect", () => {
    console.log("Connected to MQTT");
    mqttClient.subscribe("telemetry/team");
});

mqttClient.on("message", (topic, message) => {
    console.log("MQTT Message:", message.toString());

    const data = JSON.parse(message.toString());

    io.emit("telemetry", data);
});

app.get("/test", (req, res) => {
    res.send("TEST WORKING");
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server running at http://localhost:3000");
});