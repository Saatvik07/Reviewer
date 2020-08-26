import React, { useState } from "react";
import "./Signup.css";
import { withRouter } from "react-router-dom";
import { registerUser, registerUserGoogle } from "../../utils/helpers";
import GoogleLogo from "./googleLogo.png";
import {
	ShoelaceInput,
	ShoelaceForm,
	ShoelaceButton,
	ShoelaceIcon,
	ShoelaceAlert,
} from "../../utils/ShoelaceComponents";
import Mail from "./mail.png";
const Signup = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [type, setType] = useState(
		<ShoelaceAlert type='success' className='successful' open>
			<ShoelaceIcon slot='icon' name='check2-circle'></ShoelaceIcon>
			<strong>Your changes have been saved</strong>
			<br />
			You can safely exit the app now.
		</ShoelaceAlert>,
	);

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
			<div
				style={{
					width: "40%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					backgroundColor: "#151515",
					margin: "50px",
				}}
			>
				<h2>SignUp</h2>
				<ShoelaceForm
					className='signup-form'
					onSlSubmit={(event) => {
						console.log(event.detail.formData.getAll("username"));
					}}
				>
					<ShoelaceInput label='Username' name='username' className='inputs' />
					<ShoelaceInput label='Email' name='email' className='inputs' type='email' />
					<ShoelaceInput
						label='Password'
						name='password'
						className='inputs'
						type='password'
						togglePassword={true}
					/>

					<ShoelaceButton className='signup-btn' size='large' pill submit>
						<ShoelaceIcon slot='prefix' name='check-circle'></ShoelaceIcon>
						Submit
					</ShoelaceButton>
				</ShoelaceForm>
			</div>

			{/* <input
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
			</button> */}
			<div style={{ margin: "50px" }}>
				<h3>OR</h3>
			</div>
			<div className='signup-left-div'>
				<div id='customBtn' onClick={clickGoogle}>
					<img src={GoogleLogo} style={{ width: "50px", height: "auto" }} />
					<span class='buttonText'>Google</span>
				</div>
				<h4>
					Already have an account ? <a href='http://localhost:3000/login'>Sign-in</a>
				</h4>
				{type}
			</div>
		</div>
	);
};

export default withRouter(Signup);
// Icons made by <a href="https://www.flaticon.com/free-icon/email_321817" title="Vectors Market">Vectors Market</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
