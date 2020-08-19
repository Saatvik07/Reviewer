require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const errorHandler = require("errorhandler");
const mongoose = require("mongoose");
const cors = require("cors");
const projectRouter = require("./routes/projectRouter");
const ideaRouter = require("./routes/ideaRouter");
const authRouter = require("./routes/authRouter");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 8080;
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser());
app.use(morgan("dev"));
const MONGODB_URI2 = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.ldxgo.gcp.mongodb.net/Optimizer101?retryWrites=true&w=majority`;
mongoose.connect(MONGODB_URI2, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
	if (error) {
		console.log("Trouble connecting to DB", error);
	} else {
		console.log("Connected to DB ");
	}
});
app.use("/api/projects", projectRouter);
app.use("/api/idea", ideaRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler());
app.listen(PORT, () => {
	console.log(`Listening at port ${PORT}`);
});
module.exports = app;
