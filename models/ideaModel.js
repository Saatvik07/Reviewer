const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ideaSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	userID: {
		type: String,
		required: true,
	},
});
const Idea = mongoose.model("Idea", ideaSchema);
module.exports = Idea;
