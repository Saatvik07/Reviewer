import React, { useState, useEffect, useContext } from "react";
import "./Projects.css";
import { withRouter, Link } from "react-router-dom";
import { getProjects } from "../../utils/helpers";
import { userContext } from "../App/App";
const Projects = () => {
	const [projects, setProjects] = useState([]);
	const { access, setAccess } = useContext(userContext);
	useEffect(() => {
		if (access) {
			getProjects(access).then((arr) => {
				if (arr) {
					setProjects(arr);
				}
			});
		}
	}, [access]);
	const projectsArray = projects.map((project) => {
		return (
			<div className='project-div'>
				<img src={`${project.screenshotUrl}`} width='100%' height='auto' />
				<div className='essential-div'>
					<img
						src={`${project.logoUrl}`}
						width='30%'
						height='auto'
						style={{ backgroundColor: "#232324", margin: "10px", padding: "10px" }}
					/>
					<div className='info-div'>
						<h4>
							<span className='project-heading'>Title:</span> {project.name}
						</h4>
						<h4>
							<span className='project-heading'>Github:</span> {project.githubRepo}
						</h4>
					</div>
				</div>
				<div className='changeable-div'>
					<h4>
						<span className='project-heading'>Duration:</span> {project.startDate} -{" "}
						{project.endDate}
					</h4>
					<h4>
						<span className='project-heading'>Optimization:</span>
						{` ${project.openOptimizations} open, ${project.closedOptimizations} closed`}
					</h4>
					<h4>
						<span className='project-heading'>Extended Ideas:</span>
						{` ${project.openIdeas} open, ${project.closedIdeas} closed`}
					</h4>
				</div>

				<div className='project-btn-div'>
					<Link to={`/single_project/${project._id}`}>
						<button id={`${project._id}`} className='updateProject-btn'>
							Open
						</button>
					</Link>

					<button className='visitProject-btn'>Visit</button>
					<button id={`b2${project._id}`} className='deleteProject-btn'>
						Delete
					</button>
				</div>
			</div>
		);
	});
	return (
		<div className='projects-container'>
			{projectsArray}
			{projectsArray.length ? null : <h2 style={{ margin: "50px" }}>Wow soo empty</h2>}
		</div>
	);
};
export default withRouter(Projects);
