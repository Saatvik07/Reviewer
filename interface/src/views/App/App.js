import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Signup from "../Signup/Signup";
import NavBar from "../NavBar/NavBar";
import DashBoard from "../DashBoard/DashBoard";
import Projects from "../Projects/Projects";
import SingleProject from "../SingleProject/SingleProject";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "../Login/Login";
import Verify from "../Verify/Verify";
export const userContext = React.createContext(null);
function App() {
	useEffect(() => {
		fetch("http://localhost:8080/api/auth/refresh_token", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ sessionID: sessionStorage.getItem("sessionID") }),
		}).then(async (response) => {
			if (response.ok) {
				const new_access_token = await response.json();
				setAccess(new_access_token);
			} else {
				console.log("Cannot refresh the token");
			}
		});
	}, []);
	const [access, setAccess] = useState(undefined);
	return (
		<Router>
			<Switch>
				<div className='App'>
					<userContext.Provider value={{ access, setAccess }}>
						<div className='navbar-div'>
							<NavBar />
						</div>
						<div className='content'>
							<Route exact path='/' component={Signup} />
							<Route path='/dashboard' component={DashBoard} />
							<Route path='/projects' component={Projects} />
							<Route path='/single_project/:id' component={SingleProject} />
							<Route path='/login' component={Login} />
							<Route path='/verify/:accessToken' component={Verify} />
						</div>
					</userContext.Provider>
				</div>
			</Switch>
		</Router>
	);
}

export default App;
