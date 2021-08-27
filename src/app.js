const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const userRouter = require("./routers/user");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(userRouter);

module.exports = app;
