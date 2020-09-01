import React, { useState } from "react";
import "./ResetPassword.css";
import {
	ShoelaceForm,
	ShoelaceInput,
	ShoelaceButton,
	ShoelaceIcon,
	ShoelaceAlert,
	ShoelaceAnimation,
} from "../../utils/ShoelaceComponents";
import { resetPassword } from "../../utils/helpers";
import { useParams, useHistory } from "react-router-dom";
function ResetPassword() {
	const [prompt, setPrompt] = useState(null);
	const { accessToken } = useParams();
	const history = useHistory();
	return (
		<div className='reset-container'>
			<h2>Reset Password</h2>
			<ShoelaceForm
				className='reset-form'
				onSlSubmit={() => {
					if (
						document.getElementById("password2").value === document.getElementById("password").value
					) {
						resetPassword(document.getElementById("password2").value, accessToken).then(
							(response) => {
								if (response.message === "changed successfully") {
									setPrompt(
										<ShoelaceAnimation name='shake' duration='1000' iterations='1'>
											<ShoelaceAlert type='success' className='email-successful' open>
												<ShoelaceIcon slot='icon' name='check2-circle'></ShoelaceIcon>
												<strong>Password changed successfully</strong>
												<br />
												You will now be redirected
											</ShoelaceAlert>
										</ShoelaceAnimation>,
									);
									setTimeout(() => {
										history.push("/login");
									}, 2000);
								} else {
									setPrompt(
										<ShoelaceAnimation name='shake' duration='1000' iterations='1'>
											<ShoelaceAlert type='danger' className='email-unsuccessful' open>
												<ShoelaceIcon slot='icon' name='x-octagon'></ShoelaceIcon>
												<strong>Restricted !!!!</strong>
												<br />
												There has been some tampering with the URL for resetting the password
											</ShoelaceAlert>
										</ShoelaceAnimation>,
									);
								}
							},
						);
					} else {
						setPrompt(
							<ShoelaceAnimation name='shake' duration='1000' iterations='1'>
								<ShoelaceAlert type='warning' className='email-unsuccessful' open>
									<ShoelaceIcon slot='icon' name='exclamation-octagon'></ShoelaceIcon>
									<strong>Uh oh !!!!</strong>
									<br />
									The passwords do not match
								</ShoelaceAlert>
							</ShoelaceAnimation>,
						);
					}
				}}
			>
				<ShoelaceInput
					label='New Password'
					type='password'
					name='password'
					id='password'
					className='forgot-input'
					style={{ margin: "30px 0" }}
					togglePassword={true}
				></ShoelaceInput>
				<ShoelaceInput
					label='Confirm Password'
					type='password'
					name='password2'
					id='password2'
					className='forgot-input'
					style={{ margin: "30px 0" }}
					onSlChange={(event) => {}}
				></ShoelaceInput>
				<ShoelaceButton className='signup-btn' size='large' pill submit>
					<ShoelaceIcon slot='prefix' name='arrow-counterclockwise'></ShoelaceIcon>
					Reset
				</ShoelaceButton>
			</ShoelaceForm>
			{prompt}
		</div>
	);
}

export default ResetPassword;
