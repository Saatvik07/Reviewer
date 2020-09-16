import React, { useState, useContext } from "react";
import "./Login.css";
import { userContext } from "../App/App";
import { useHistory, withRouter, Link } from "react-router-dom";
import { loginUser, registerUserGoogle } from "../../utils/helpers";
import {
	ShoelaceAlert,
	ShoelaceIcon,
	ShoelaceAnimation,
	ShoelaceButton,
	ShoelaceInput,
	ShoelaceForm,
	ShoelaceIconButton,
} from "../../utils/ShoelaceComponents";
import GoogleLogo from "./googleLogo.png";
function Login() {
	const [type, setType] = useState(null);
	const { access, setAccess } = useContext(userContext);
	const history = useHistory();
	function onClickLogin(formData) {
		const email = formData.get("email");
		const password = formData.get("password");
		loginUser(email, password).then((response) => {
			if (response.message === "not found") {
				setType(
					<ShoelaceAlert
						type='warning'
						open
						className='loggedIn animate__animated animate__fadeInUp'
					>
						<ShoelaceIcon slot='icon' name='exclamation-octagon'></ShoelaceIcon>
						<strong>Sorry :|</strong>
						<br />
						The email entered is not registered
					</ShoelaceAlert>,
				);
			} else if (response.message === "wrong password") {
				setType(
					<ShoelaceAlert
						type='warning'
						open
						className='loggedIn animate__animated animate__fadeInUp'
					>
						<ShoelaceIcon slot='icon' name='exclamation-octagon'></ShoelaceIcon>
						<strong>Uh Oh!!!</strong>
						<br />
						The password is incorrect
					</ShoelaceAlert>,
				);
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
	return (
		<div className='login-container'>
			<div className='login-container-left animate__animated animate__fadeInUp'>
				<h1>Sign in</h1>
				<ShoelaceForm
					className='login-form'
					onSlSubmit={(event) => {
						onClickLogin(event.detail.formData);
					}}
				>
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
					<Link to='/forgot_password'>
						<h6 style={{ color: "#777" }}>Forgot password ?</h6>
					</Link>
					<ShoelaceButton className='signup-btn' size='large' pill submit>
						<ShoelaceIcon slot='prefix' name='check-circle'></ShoelaceIcon>
						Submit
					</ShoelaceButton>
				</ShoelaceForm>
				{type}
			</div>
			<div className='login-container-right animate__animated animate__fadeInUp'>
				<h3>OR</h3>
				<br />
				<br />
				<h4>Sign In using:</h4>
				<div id='customBtn' onClick={clickGoogle}>
					<img src={GoogleLogo} style={{ width: "50px", height: "auto" }} />
					<span class='buttonText'>Google</span>
				</div>
			</div>
		</div>
	);
}

export default withRouter(Login);
