const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const userRouter = require("./routers/user");
const activityRouter = require("./routers/activity");
const footprintRouter = require("./routers/footprint");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(userRouter);
app.use(activityRouter);
app.use("/footprint", footprintRouter);

app.get("/", (req, res) => {
	res.send("Welcome to Karbonless API");
});

app.get("*", (req, res) => {
    res.send("Sorry! Could find any response. Please Check your input path.")
})

module.exports = app;
