import React, { useContext, useState, useEffect } from "react";
import { useParams, useHistory, withRouter } from "react-router-dom";
import { verifyUser } from "../../utils/helpers";
import { userContext } from "../App/App";
import Cross from "./cross.png";
import Tick from "./tick.png";
import "./Verify.css";
function Verify() {
	const { accessToken } = useParams();
	const { setAccess, setNewUser } = useContext(userContext);
	const history = useHistory();
	const [verifying, setVerifying] = useState(true);
	const [verified, setVerified] = useState(<h2 className='verification-ongoing'>Verifying....</h2>);
	useEffect(() => {
		verifyUser(accessToken).then((result) => {
			if (result.message === "Verified") {
				setVerifying(null);
				setNewUser(true);
				setVerified(
					<div className='verified'>
						<img style={{ width: "100px", height: "auto" }} src={Tick} />
						<h2 className='verification-complete'>
							Thank you for verifying your email. Redirecting....
						</h2>
					</div>,
				);
				setAccess(result.access_token);
				sessionStorage.setItem("sessionID", result.sessionID);
				setTimeout(() => {
					history.push("/dashboard");
				}, 2000);
			} else if (result.message === "Verified Already") {
				setVerifying(null);
				setVerified(
					<div className='verified'>
						<img style={{ width: "200px", height: "auto" }} src={Tick} />
						<h2 className='verification-incomplete'>Ths email is already verified</h2>
					</div>,
				);
			} else {
				setVerifying(null);
				setVerified(
					<div className='verified'>
						<img style={{ width: "200px", height: "auto" }} src={Cross} />
						<h2 className='verification-incomplete'>
							There was an error while verifying your email. Please register again
						</h2>
					</div>,
				);
			}
		});
	}, []);
	return (
		<div className='verification-container'>
			{verifying}
			{verified}
		</div>
	);
}

export default withRouter(Verify);
//Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
