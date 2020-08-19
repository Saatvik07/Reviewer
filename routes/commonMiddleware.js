const jwt = require("jsonwebtoken");
const verifyRefreshToken = (req, res, next) => {
	const access_token = req.headers.authorization.split(" ")[1];
	if (access_token) {
		jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, id) => {
			if (err && err.name === "TokenExpiredError") {
				const sessionID = req.headers.sessionID;
				const refresh_token = req.cookies[`refresh_token${sessionID}`];
				if (refresh_token) {
					jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, id) => {
						if (err) {
							res.status(401).send("refresh token not verified");
						} else {
							userModel.findById(id.sub, (err, doc) => {
								if (err) {
									res.status(404).send("Cannot find user");
								} else {
									if (doc && doc.refreshTokens.includes(refresh_token)) {
										const new_access_token = jwt.sign(
											{ sub: doc._id },
											process.env.ACCESS_TOKEN_SECRET,
											{
												expiresIn: "10m",
											},
										);
										req.headers.authorization = `Bearer ${new_access_token}`;
										console.log("Created new access token");
										next();
									} else {
										res.status(401).send("Refresh token doesn't match");
									}
								}
							});
						}
					});
				} else {
					res.sendStatus(401);
				}
			} else {
				next();
			}
		});
	} else {
		res.send(401);
	}
};
module.exports = verifyRefreshToken;
