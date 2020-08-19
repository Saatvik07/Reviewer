const express = require("express");
const ideaRouter = express.Router();
const ideaModel = require("../models/ideaModel");
const verifyRefreshToken = require("../routes/commonMiddleware");
const jwt = require("jsonwebtoken");
ideaRouter.post("/", verifyRefreshToken, (req, res, next) => {
	const access_token = req.headers.authorization.split(" ")[1];
	jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
		if (err) {
			res.send(403);
		} else {
			const userID = payload.sub;
			const obj = { ...req.body.ideaData, userID: userID };
			const newIdea = ideaModel(obj);
			newIdea.save((error, doc) => {
				if (error) {
					console.log("Cannot Save !!!");
					res.sendStatus(400);
				} else {
					console.log("Saved the idea " + `${req.body.ideaData.title}`);
					res.status(201).send({ idea: doc });
				}
			});
		}
	});
});
ideaRouter.get("/", verifyRefreshToken, (req, res, next) => {
	const access_token = req.headers.authorization.split(" ")[1];
	jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
		if (err) {
			res.send(403);
		} else {
			const userID = payload.sub;
			ideaModel.find({ userID: userID }, (err, docs) => {
				if (err) {
					res.send(500);
				} else if (!docs[0]) {
					res.sendStatus(404);
				} else {
					res.status(200).send(docs);
				}
			});
		}
	});
});
ideaRouter.put("/", verifyRefreshToken, (req, res, next) => {
	const access_token = req.headers.authorization.split(" ")[1];
	jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
		if (err) {
			res.sendStatus(403);
		} else {
			const userID = payload.sub;
			console.log(req.body.ideaData);
			ideaModel.findById(req.body.ideaData._id, (err, doc) => {
				if (err) {
					res.sendStatus(404);
				} else {
					console.log(doc);
					if (doc.userID === userID) {
						ideaModel.findByIdAndUpdate(
							req.body.ideaData._id,
							{ title: req.body.ideaData.title, body: req.body.ideaData.body },
							{ new: true },
							(error, result) => {
								if (error) {
									console.log("Cannot update the idea", error);
									res.sendStatus(400);
								} else {
									console.log("Updated");
									res.status(200).send(result);
								}
							},
						);
					} else {
						res.sendStatus(401);
					}
				}
			});
		}
	});
});
ideaRouter.delete("/", verifyRefreshToken, (req, res, next) => {
	const access_token = req.headers.authorization.split(" ")[1];
	jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
		if (err) {
			res.send(403);
		} else {
			const userID = payload.sub;
			ideaModel.findById(req.body.ideaId, (err, doc) => {
				if (err) {
					res.send(404);
				} else {
					if (doc.userID === userID) {
						ideaModel.findByIdAndRemove(req.body.ideaId, (error, response) => {
							if (error) {
								console.log("Cannot Delete");
								res.sendStatus(400);
							} else {
								console.log("Delete the idea", response);
								res.status(204).send(response);
							}
						});
					} else {
						res.sendStatus(401);
					}
				}
			});
		}
	});
});
module.exports = ideaRouter;
