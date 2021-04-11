const socket = io();

socket.on("message", (welcome) => {
	console.log(welcome);
});
document.querySelector("#form").addEventListener("submit", (e) => {
	e.preventDefault();

	const input = e.target.elements.input.value;
	socket.emit("sendMessage", input);
});

document.querySelector("#increment").addEventListener("click", () => {
	console.log("Clicked");
	socket.emit("increment");
});
