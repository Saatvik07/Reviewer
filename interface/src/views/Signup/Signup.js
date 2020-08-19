import React, { useState } from "react";
import "./Signup.css";
import { withRouter } from "react-router-dom";
import { registerUser, registerUserGoogle } from "../../utils/helpers";
import Mail from "./mail.png";
import GoogleLogo from "./googleLogo.png";
const Signup = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [type, setType] = useState(null);

	function onClickSignUp() {
		setType(
			<div className='message sending'>
				<h4>Sending the verification mail ...</h4>
			</div>,
		);
		registerUser(username, email, password).then((result) => {
			if (result.message === "sent") {
				setType(
					<div className='message sent'>
						<img src={Mail} className='mail-picture' />
						<h4>Check your email {email} for a verification message</h4>
					</div>,
				);
			} else if (result.message === "already in use") {
				setType(
					<div className='message already'>
						<h4>That email ID is already in use</h4>
					</div>,
				);
			}
		});
	}
	function clickGoogle() {
		registerUserGoogle().then((response) => {
			const url = response.authURL;
			window.location.href = url;
		});
	}

	return (
		<div className='signup-container'>
			<h2>SignUp</h2>
			<input
				id='username'
				type='text'
				className='signup-input'
				placeholder='Enter the username'
				value={username}
				onChange={(event) => {
					setUsername(event.target.value);
				}}
			/>
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
			<button className='signup-btn' onClick={onClickSignUp}>
				Sign Up
			</button>
			<br />
			<h3>OR</h3>
			<div id='customBtn' class='customGPlusSignIn' onClick={clickGoogle}>
				<img src={GoogleLogo} style={{ width: "50px", height: "auto" }} />
				<span class='buttonText'>Google</span>
			</div>
			<h4>
				Already have an account ? <a href='http://localhost:3000/login'>Sign-in</a>
			</h4>
			{type}
		</div>
	);
};

export default withRouter(Signup);
// Icons made by <a href="https://www.flaticon.com/free-icon/email_321817" title="Vectors Market">Vectors Market</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
