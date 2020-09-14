import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../App/App";
import "./NavBar.css";
import { logoutUser } from "../../utils/helpers";
import { ShoelaceButton, ShoelaceIcon } from "../../utils/ShoelaceComponents";
function NavBar() {
	const [nav, setNav] = useState("log");
	const { access, setAccess } = useContext(userContext);
	function logOut() {
		setNav("log");
		setAccess(null);
		logoutUser(access);
	}
	return (
		<div className='navbar-container animate__animated animate__fadeInDown'>
			<div className='nav-options'>
				{access ? (
					<>
						<div className='nav-btn'>
							<Link to='/dashboard'>
								<button
									onClick={(event) => {
										setNav(event.target.id);
									}}
									id='dashboard'
								>
									Dashboard
								</button>
							</Link>
						</div>
						<div className='nav-btn'>
							<Link to='/projects'>
								<button
									onClick={(event) => {
										setNav(event.target.id);
									}}
									id='projects'
								>
									Projects
								</button>
							</Link>
						</div>
						<div className='nav-btn'>
							<Link to='/'>
								<button onClick={logOut} id='log'>
									Sign Out
								</button>
							</Link>{" "}
						</div>
					</>
				) : (
					<>
						<div className='nav-btn'>
							<Link to='/'>
								<ShoelaceIcon name='info-circle' className='nav-icon'></ShoelaceIcon>
								<button
									onClick={(event) => {
										setNav(event.target.id);
									}}
									id='About'
								>
									About
								</button>
							</Link>
						</div>
						<div className='nav-btn'>
							<Link to='/signup'>
								<ShoelaceIcon name='person-plus' className='nav-icon'></ShoelaceIcon>
								<button
									onClick={(event) => {
										setNav(event.target.id);
									}}
									id='Signup'
								>
									Sign up
								</button>
							</Link>
						</div>
						<div className='nav-btn'>
							<Link to='/login'>
								{access ? (
									<>
										<ShoelaceIcon name='arrow-left-circle' className='nav-icon'></ShoelaceIcon>
										<button onClick={logOut} id='log'>
											Sign out
										</button>
									</>
								) : (
									<>
										<ShoelaceIcon name='arrow-right-circle' className='nav-icon'></ShoelaceIcon>
										<button
											onClick={(event) => {
												setNav(event.target.id);
											}}
											id='log'
										>
											Sign in
										</button>
									</>
								)}
							</Link>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
export default NavBar;
