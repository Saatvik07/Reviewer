import React, { useState, useEffect, useContext } from "react";
import "./Projects.css";
import { withRouter, Link } from "react-router-dom";
import { getProjects } from "../../utils/helpers";
import { userContext } from "../App/App";
import {
	ShoelaceSpinner,
	ShoelaceCard,
	ShoelaceButtonGroup,
	ShoelaceButton,
	ShoelaceBadge,
} from "../../utils/ShoelaceComponents";
const Projects = () => {
	const [projects, setProjects] = useState(null);
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
	let projectsArray = null;
	if (projects) {
		projectsArray = projects.map((project) => {
			return (
				<ShoelaceCard className='project-div'>
					<img src={`${project.screenshotUrl}`} width='100%' height='auto' />
					<div className='essential-div'>
						<img
							src={`${project.logoUrl}`}
							width='30%'
							height='auto'
							style={{ backgroundColor: "#232324", margin: "10px", padding: "10px" }}
						/>
						<div className='info-div'>
							<h5>
								<span className='project-heading'>Title:</span> {project.name}
							</h5>
							<h5>
								<span className='project-heading'>Github:</span> {project.githubRepo}
							</h5>
						</div>
					</div>
					<div className='changeable-div'>
						<h5>
							<span className='project-heading'>Duration:</span> {project.startDate} -{" "}
							{project.endDate}
						</h5>
						<h5>
							<span className='project-heading'>Optimization:</span>
							<ShoelaceBadge
								type='danger'
								pill
								pulse
								className='open-badge'
							>{` ${project.openOptimizations} open`}</ShoelaceBadge>
							<ShoelaceBadge
								type='success'
								pill
								pulse
								className='closed-badge'
							>{`${project.closedOptimizations} closed`}</ShoelaceBadge>
						</h5>
						<h5>
							<span className='project-heading'>Extended Ideas:</span>
							<ShoelaceBadge
								type='danger'
								pill
								pulse
								className='open-badge'
							>{` ${project.openIdeas} open`}</ShoelaceBadge>
							<ShoelaceBadge
								type='success'
								pill
								pulse
								className='closed-badge'
							>{`${project.closedIdeas} closed`}</ShoelaceBadge>
						</h5>
					</div>

					<div className='project-btn-div' slot='footer'>
						<ShoelaceButtonGroup>
							<Link to={`/single_project/${project._id}`}>
								<ShoelaceButton size='large' className='button-group-btn updateProject-btn'>
									Open
								</ShoelaceButton>
							</Link>

							<ShoelaceButton size='large' className='button-group-btn deleteProject-btn'>
								Delete
							</ShoelaceButton>
							<ShoelaceButton size='large' className='button-group-btn'>
								Visit
							</ShoelaceButton>
						</ShoelaceButtonGroup>
					</div>
				</ShoelaceCard>
			);
		});
	}

	return (
		<div className='projects-container animate__animated animate__slideInUp'>
			{projectsArray}
			{projectsArray ? (
				projectsArray.length ? null : (
					<h2 style={{ margin: "50px" }}>Wow soo empty</h2>
				)
			) : (
				<ShoelaceSpinner className='refresh-spinner'></ShoelaceSpinner>
			)}
		</div>
	);
};
export default withRouter(Projects);
