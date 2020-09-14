const express = require("express");
const projectRouter = express.Router();
const jwt = require("jsonwebtoken");
const projectModel = require("../models/projectModel");
const verifyRefreshToken = require("./commonMiddleware");
projectRouter.post("/", verifyRefreshToken, async (req, res, next) => {
	const access_token = req.headers.authorization.split(" ")[1];
	jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
		if (err) {
			res.send(403);
		} else {
			const userID = payload.sub;
			const exists = await projectModel.exists({ name: req.body.projectData.name });
			if (!exists) {
				const obj = { ...req.body.projectData, userID: userID };
				const newProject = new projectModel(obj);
				newProject.save((error) => {
					if (error) {
						console.log("Cannot Save !!!");
						res.sendStatus(400);
					} else {
						console.log("Saved the project " + `${req.body.projectData.name}`);
						res.status(201);
					}
				});
			}
		}
	});
});
projectRouter.get("/", verifyRefreshToken, (req, res, next) => {
	const access_token = req.headers.authorization.split(" ")[1];
	jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
		if (err) {
			res.send(403);
		} else {
			const userID = payload.sub;
			projectModel.find({ userID: userID }, (err, docs) => {
				if (err) {
					console.log("Cannot Fetch Data");
					res.sendStatus(500);
				} else if (!docs[0]) {
					res.sendStatus(404);
				} else {
					console.log(`Records Found: ${docs.length}`);
					res.status(200).send(docs);
				}
			});
		}
	});
});
projectRouter.get("/:id", verifyRefreshToken, (req, res, next) => {
	const access_token = req.headers.authorization.split(" ")[1];
	jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
		if (err) {
			console.log(err);
			res.send(403);
		} else {
			const userID = payload.sub;
			projectModel.findById(req.params.id, (err, doc) => {
				if (err) {
					console.log("Cannot fetch the project");
					res.sendStatus(404);
				} else {
					if (userID === doc.userID) {
						console.log("Successfully fetched data");
						res.status(200).send(doc);
					} else {
						res.sendStatus(401);
					}
				}
			});
		}
		vv;
	});
});
projectRouter.put("/:id", verifyRefreshToken, (req, res, next) => {
	const access_token = req.headers.authorization.split(" ")[1];
	jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
		if (err) {
			res.send(403);
		} else {
			const userID = payload.sub;
			if (req.body.optimizations) {
				projectModel.findById(req.params.id, (err, doc) => {
					if (err) {
						res.sendStatus(404);
					} else {
						if (doc.userID === userID) {
							projectModel.findByIdAndUpdate(
								req.params.id,
								{
									optimization: req.body.optimizations.arr,
									closedOptimizations: req.body.optimizations.closed,
									openOptimizations: req.body.optimizations.open,
								},
								{ new: true },
								(error, result) => {
									if (error) {
										res.sendStatus(400);
									} else {
										console.log("Succesfully updated optimizations");
										res.status(200).send(result);
									}
								},
							);
						}
					}
				});
			} else if (req.body.ideas) {
				projectModel.findById(req.params.id, (err, doc) => {
					if (err) {
						res.sendStatus(404);
					} else {
						if (doc.userID === userID) {
							projectModel.findByIdAndUpdate(
								req.params.id,
								{
									extendedIdeas: req.body.ideas.arr,
									openIdeas: req.body.ideas.open,
									closedIdeas: req.body.ideas.closed,
								},
								{ new: true },
								(error, result) => {
									if (error) {
										res.sendStatus(400);
									} else {
										console.log("Successfully updated extended Ideas");
										res.status(200).send(result);
									}
								},
							);
						}
					}
				});
			}
		}
	});
});
module.exports = projectRouter;
