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
	ShoelaceSpinner,
	ShoelaceAnimation,
} from "../../utils/ShoelaceComponents";
const Signup = () => {
	const [type, setType] = useState();

	function onClickSignUp(formData) {
		const username = formData.get("username");
		const password = formData.get("password");
		const email = formData.get("email");
		setType(<ShoelaceSpinner className='sending'></ShoelaceSpinner>);
		registerUser(username, email, password).then((result) => {
			if (result.message === "sent") {
				setType(
					<ShoelaceAnimation name='shake' duration='2000' iterations='1'>
						<ShoelaceAlert type='success' className='successful' open>
							<ShoelaceIcon slot='icon' name='check2-circle'></ShoelaceIcon>
							<strong>Email sent to {`${email}`}</strong>
							<br />
							You can close this window
						</ShoelaceAlert>
					</ShoelaceAnimation>,
				);
			} else if (result.message === "already in use") {
				setType(
					<ShoelaceAnimation name='shake' duration='2000' iterations='1'>
						<ShoelaceAlert type='warning' className='unsuccessful' open>
							<ShoelaceIcon slot='icon' name='exclamation-octagon'></ShoelaceIcon>
							<strong>Delete this file?</strong>
							<br />
							This is permanent, which means forever
						</ShoelaceAlert>
					</ShoelaceAnimation>,
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
			<div className='signup-left-div'>
				<h2>SignUp</h2>
				<ShoelaceForm
					className='signup-form'
					onSlSubmit={(event) => {
						onClickSignUp(event.detail.formData);
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
			<div style={{ marginLeft: "50px" }}>
				<h3>OR</h3>
			</div>
			<div className='signup-right-div'>
				<h4>Sign In using:</h4>
				<div id='customBtn' onClick={clickGoogle}>
					<img src={GoogleLogo} style={{ width: "50px", height: "auto" }} />
					<span class='buttonText'>Google</span>
				</div>
				<br />
				<br />
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
