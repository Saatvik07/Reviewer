import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import "./ForgotPassword.css";
import {
	ShoelaceForm,
	ShoelaceInput,
	ShoelaceAnimation,
	ShoelaceAlert,
	ShoelaceIcon,
	ShoelaceButton,
} from "../../utils/ShoelaceComponents";
import { forgotPassword } from "../../utils/helpers";
function ForgotPassword() {
	const [prompt, setPrompt] = useState(null);
	function onClickSend(formData) {
		const email = formData.get("email");
		forgotPassword(email).then((response) => {
			if (response.message === "not found") {
				setPrompt(
					<ShoelaceAnimation name='shake' duration='1000' iterations='1'>
						<ShoelaceAlert type='warning' open className='loggedIn'>
							<ShoelaceIcon slot='icon' name='exclamation-octagon'></ShoelaceIcon>
							<strong>Sorry :|</strong>
							<br />
							The email entered is not registered
						</ShoelaceAlert>
					</ShoelaceAnimation>,
				);
			} else {
				setPrompt(
					<ShoelaceAnimation name='shake' duration='1000' iterations='1'>
						<ShoelaceAlert type='success' className='email-successful' open>
							<ShoelaceIcon slot='icon' name='check2-circle'></ShoelaceIcon>
							<strong>Link to change the password sent to {`${email}`}</strong>
							<br />
							You can close this window
						</ShoelaceAlert>
					</ShoelaceAnimation>,
				);
			}
		});
	}
	return (
		<div className='forgot-container'>
			<h2>Forgot Password ? </h2>
			<ShoelaceForm
				onSlSubmit={(event) => {
					onClickSend(event.detail.formData);
				}}
				className='forgot-form'
			>
				<br />
				<ShoelaceInput
					label='Registered email'
					name='email'
					type='email'
					className='forgot-input'
				></ShoelaceInput>
				<ShoelaceButton className='signup-btn' size='large' pill submit>
					<ShoelaceIcon slot='prefix' name='envelope-open'></ShoelaceIcon>
					Submit
				</ShoelaceButton>
			</ShoelaceForm>
			{prompt}
		</div>
	);
}

export default withRouter(ForgotPassword);
