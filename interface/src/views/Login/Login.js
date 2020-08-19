import React, { useState, useContext } from "react";
import "./Login.css";
import { userContext } from "../App/App";
import { useHistory, withRouter } from "react-router-dom";
import GoogleLogo from "./googleLogo.png";
import { loginUser, registerUserGoogle } from "../../utils/helpers";
function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [type, setType] = useState(0);
	const { access, setAccess } = useContext(userContext);
	const history = useHistory();
	let prompt;
	function onClickLogin() {
		loginUser(email, password).then((response) => {
			if (response.message) {
				setType(1);
			} else {
				localStorage.setItem("sessionID", response.sessionID);
				setAccess(response.access_token);
				history.push("/dashboard");
			}
		});
	}
	function clickGoogle() {
		registerUserGoogle().then((response) => {
			const url = response.authURL;
			window.location.href = url;
		});
	}
	if (type === 1) {
		prompt = <h3>This email ID is not registered</h3>;
	}
	return (
		<div className='signup-container'>
			<h1>Login</h1>
			<input
				id='email'
				type='email'
				className='signup-input'
				placeholder='Enter the email'
				value={email}
				onChange={(event) => {
					setEmail(event.target.value);
				}}
			/>
			<input
				id='password'
				type='password'
				className='signup-input'
				placeholder='Enter the password'
				value={password}
				onChange={(event) => {
					setPassword(event.target.value);
				}}
			/>
			<button className='signup-btn' onClick={onClickLogin}>
				Log In
			</button>
			<br />
			<br />
			<h3>OR</h3>
			<span class='label'>Sign in with:</span>
			<div id='customBtn' class='customGPlusSignIn' onClick={clickGoogle}>
				<img src={GoogleLogo} style={{ width: "50px", height: "auto" }} />
				<span class='buttonText'>Google</span>
			</div>
		</div>
	);
}

export default withRouter(Login);
