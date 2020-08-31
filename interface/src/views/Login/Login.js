import React, { useState, useContext } from "react";
import "./Login.css";
import { userContext } from "../App/App";
import { useHistory, withRouter } from "react-router-dom";
import { loginUser } from "../../utils/helpers";
import {
	ShoelaceAlert,
	ShoelaceIcon,
	ShoelaceAnimation,
	ShoelaceButton,
	ShoelaceInput,
	ShoelaceForm,
} from "../../utils/ShoelaceComponents";
function Login() {
	const [type, setType] = useState(null);
	const { access, setAccess } = useContext(userContext);
	const history = useHistory();
	let prompt;
	function onClickLogin(formData) {
		const email = formData.get("email");
		const password = formData.get("password");
		loginUser(email, password).then((response) => {
			if (response.message === "not found") {
				setType(
					<ShoelaceAnimation name='shake' duration='2000' iterations='1'>
						<ShoelaceAlert type='warning' open className='loggedIn'>
							<ShoelaceIcon slot='icon' name='exclamation-octagon'></ShoelaceIcon>
							<strong>Sorry :|</strong>
							<br />
							The email entered is not registered
						</ShoelaceAlert>
					</ShoelaceAnimation>,
				);
			} else if (response.message === "wrong password") {
				setType(
					<ShoelaceAnimation name='shake' duration='2000' iterations='1'>
						<ShoelaceAlert type='warning' open className='loggedIn'>
							<ShoelaceIcon slot='icon' name='exclamation-octagon'></ShoelaceIcon>
							<strong>Uh Oh!!!</strong>
							<br />
							The password is incorrect
						</ShoelaceAlert>
					</ShoelaceAnimation>,
				);
			} else {
				localStorage.setItem("sessionID", response.sessionID);
				setAccess(response.access_token);
				history.push("/dashboard");
			}
		});
	}
	return (
		<div className='login-container'>
			<h1>Sign-in</h1>
			<ShoelaceForm
				className='login-form'
				onSlSubmit={(event) => {
					onClickLogin(event.detail.formData);
				}}
			>
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
			{type}
		</div>
	);
}

export default withRouter(Login);
