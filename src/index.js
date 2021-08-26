const app = require("./app");

const port = process.env.PORT;

//Listen for incoming requests
app.listen(port, () => {
	console.log("Server is running on", port);
});
