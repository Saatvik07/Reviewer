const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const projectSchema = new Schema({
	userID: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},
	startDate: {
		type: String,
		required: true,
	},
	endDate: {
		type: String,
	},
	githubRepo: {
		type: String,
	},
	openOptimizations: {
		type: Number,
	},
	closedOptimizations: {
		type: Number,
	},
	closedIdeas: {
		type: Number,
	},
	openIdeas: {
		type: Number,
	},
	optimization: {
		type: Array,
	},
	extendedIdeas: {
		type: Array,
	},
	screenshotUrl: {
		type: String,
	},
	logoUrl: {
		type: String,
	},
});
const Project = mongoose.model("Projects", projectSchema);
module.exports = Project;
