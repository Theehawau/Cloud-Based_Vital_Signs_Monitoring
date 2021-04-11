const path = require("path");
const http = require("http");
const express = require("express");
require("./db/mongoose");

const bodyParser = require("body-parser");

const {sendRegisterDone} = require('./telegram.js')
const app = express();
const server = http.createServer(app);
const deviceRouter = require("./routers/device");
const dataRouter = require("./routers/data");


const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, "../public");

app.use(express.static(publicDirPath));

//bodyParser MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Using routers
app.use(deviceRouter);
app.use(dataRouter);
// Using websocket
// io.on("connection", (socket) => {
// 	console.log("New socket io connection");
// 	socket.emit("message", "Welcome!");
// 	socket.on("sendMessage", (input) => {
// 		io.emit("message", input);
// 	});
// 	socket.on("data", (data) => {
// 		io.emit("message", data);
// 	});
// });
server.listen(process.env.PORT, () => {
	console.log("Server is up on", process.env.PORT);
});
