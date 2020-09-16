import React, { useState, useEffect, useContext } from "react";
import "./Projects.css";
import { withRouter, Link } from "react-router-dom";
import { deleteProject, getProjects } from "../../utils/helpers";
import { userContext } from "../App/App";
import {
	ShoelaceSpinner,
	ShoelaceCard,
	ShoelaceButtonGroup,
	ShoelaceButton,
	ShoelaceBadge,
	ShoelaceAlert,
	ShoelaceIcon,
} from "../../utils/ShoelaceComponents";
const Projects = () => {
	const [projects, setProjects] = useState(null);
	const { access } = useContext(userContext);
	const [message, setMessage] = useState(null);
	useEffect(() => {
		if (access) {
			getProjects(access).then((arr) => {
				if (arr) {
					setProjects(arr);
				}
			});
		}
	}, [access]);
	const onProjectDelete = (event) => {
		const id = event.target.id;
		deleteProject(id, access).then((response) => {
			if (response.message) {
				setMessage(
					<ShoelaceAlert
						type='warning'
						open
						className='loggedIn animate__animated animate__fadeInUp'
					>
						<ShoelaceIcon slot='icon' name='exclamation-octagon'></ShoelaceIcon>
						<strong>Deleted</strong>
						<br />
						{`${response.name} has been deleted`}
					</ShoelaceAlert>,
				);
			} else {
			}
		});
	};
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
							>{` ${project.openOptimizations}`}</ShoelaceBadge>
							open
							<ShoelaceBadge
								type='success'
								pill
								pulse
								className='closed-badge'
							>{`${project.closedOptimizations}`}</ShoelaceBadge>
							close
						</h5>
						<h5>
							<span className='project-heading'>Extended Ideas:</span>
							<ShoelaceBadge
								type='danger'
								pill
								pulse
								className='open-badge'
							>{` ${project.openIdeas}`}</ShoelaceBadge>
							open
							<ShoelaceBadge
								type='success'
								pill
								pulse
								className='closed-badge'
							>{`${project.closedIdeas}`}</ShoelaceBadge>
							close
						</h5>
					</div>

					<div className='project-btn-div' slot='footer'>
						<ShoelaceButtonGroup>
							<Link to={`/single_project/${project._id}`}>
								<ShoelaceButton size='medium' className='button-group-btn updateProject-btn'>
									Open
								</ShoelaceButton>
							</Link>

							<ShoelaceButton
								id={`${project._id}`}
								size='medium'
								className='button-group-btn deleteProject-btn'
								onClick={onProjectDelete}
							>
								Delete
							</ShoelaceButton>
							<ShoelaceButton size='medium' className='button-group-btn'>
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
			{message}
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
