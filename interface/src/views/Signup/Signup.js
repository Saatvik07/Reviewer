import React, { useEffect, useState } from "react";
import "./Signup.css";
import { withRouter } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { registerUser, registerUserGoogle } from "../../utils/helpers";
import GoogleLogo from "./googleLogo.png";
import {
	ShoelaceInput,
	ShoelaceForm,
	ShoelaceButton,
	ShoelaceIcon,
	ShoelaceAlert,
	ShoelaceSpinner,
} from "../../utils/ShoelaceComponents";
const Signup = () => {
	const [type, setType] = useState();
	useEffect(() => {
		AOS.init();
	}, []);
	function onClickSignUp(formData) {
		const username = formData.get("username");
		const password = formData.get("password");
		const email = formData.get("email");
		setType(<ShoelaceSpinner className='email-sending'></ShoelaceSpinner>);

		registerUser(username, email, password).then((result) => {
			if (result.message === "sent") {
				setType(
					<ShoelaceAlert
						type='success'
						className='email-successful animate__animated animate__fadeInUp'
						open
					>
						<ShoelaceIcon slot='icon' name='check2-circle'></ShoelaceIcon>
						<strong>Email sent to {`${email}`}</strong>
						<br />
						You can close this window
					</ShoelaceAlert>,
				);
			} else if (result.message === "already in use") {
				setType(
					<ShoelaceAlert
						type='warning'
						className='email-unsuccessful animate__animated animate__fadeInUp'
						open
					>
						<ShoelaceIcon slot='icon' name='exclamation-octagon'></ShoelaceIcon>
						<strong>Such Coincidence</strong>
						<br />
						This email is already in use
					</ShoelaceAlert>,
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
			<div className='signup-left-div animate__animated animate__fadeInUp'>
				<h2>SignUp</h2>
				<ShoelaceForm
					className='signup-form'
					onSlSubmit={(event) => {
						onClickSignUp(event.detail.formData);
					}}
				>
					<ShoelaceInput label='Username' name='username' className='inputs' required={true} />
					<ShoelaceInput
						label='Email'
						name='email'
						className='inputs'
						type='email'
						required={true}
					/>
					<ShoelaceInput
						label='Password'
						name='password'
						className='inputs'
						type='password'
						togglePassword={true}
						required={true}
					/>

					<ShoelaceButton className='signup-btn' size='large' pill submit>
						<ShoelaceIcon slot='prefix' name='check-circle'></ShoelaceIcon>
						Submit
					</ShoelaceButton>
				</ShoelaceForm>
			</div>
			<div
				className='animate__animated animate__fadeInUp or-div'
				data-aos='fade-up'
				data-aos-anchor-placement='top-top'
			>
				<h3>OR</h3>
			</div>
			<div
				className='signup-right-div animate__animated animate__fadeInUp'
				data-aos='fade-up'
				data-aos-anchor-placement='top-top'
			>
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
