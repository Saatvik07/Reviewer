import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../App/App";
import "./NavBar.css";
import { logoutUser } from "../../utils/helpers";
function NavBar() {
	const [nav, setNav] = useState("log");
	const { access, setAccess } = useContext(userContext);
	function logOut() {
		setNav("log");
		setAccess(null);
		logoutUser(access);
	}
	return (
		<div className='navbar-container'>
			<div className='nav-options'>
				{access ? (
					<>
						<Link to='/dashboard'>
							<button
								className='nav-btn'
								onClick={(event) => {
									setNav(event.target.id);
								}}
								id='dashboard'
							>
								Dashboard
							</button>
						</Link>
						<Link to='/projects'>
							<button
								className='nav-btn'
								onClick={(event) => {
									setNav(event.target.id);
								}}
								id='projects'
							>
								Projects
							</button>
						</Link>
						<Link to='/'>
							<button className='nav-btn' onClick={logOut} id='log'>
								Sign Out
							</button>
						</Link>{" "}
					</>
				) : (
					<>
						<Link to='/'>
							<button
								className='nav-btn'
								onClick={(event) => {
									setNav(event.target.id);
								}}
								id='About'
							>
								About
							</button>
						</Link>
						<Link to='/signup'>
							<button
								className='nav-btn'
								onClick={(event) => {
									setNav(event.target.id);
								}}
								id='Signup'
							>
								Sign up
							</button>
						</Link>
						<Link to='/login'>
							{access ? (
								<button className='nav-btn' onClick={logOut} id='log'>
									Sign out
								</button>
							) : (
								<button
									className='nav-btn'
									onClick={(event) => {
										setNav(event.target.id);
									}}
									id='log'
								>
									Sign in
								</button>
							)}
						</Link>
					</>
				)}
			</div>
		</div>
	);
}
export default NavBar;
