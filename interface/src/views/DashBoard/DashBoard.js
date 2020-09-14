import React, { useState, useEffect, useContext } from "react";
import "./DashBoard.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { withRouter, useLocation } from "react-router-dom";
import { addProject, addIdea, getIdea, updateIdea, deleteIdea } from "../../utils/helpers";
import { userContext } from "../App/App";
import {
	ShoelaceDialog,
	ShoelaceButton,
	ShoelaceAnimation,
	ShoelaceAlert,
	ShoelaceIcon,
	ShoelaceIconButton,
	ShoelaceSpinner,
	ShoelaceDrawer,
} from "../../utils/ShoelaceComponents";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}
const DashBoard = () => {
	const [name, setName] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [link, setLink] = useState("");
	const [github, setGithub] = useState("");
	const [ideas, setIdeas] = useState([]);
	const [ideaTitle, setIdeaTitle] = useState("");
	const [ideaBody, setIdeaBody] = useState("");
	const [update, setUpdate] = useState(0);
	const [updateId, setUpdateId] = useState("");
	const [showModal, setShowModal] = useState(null);
	const [screenshot, setScreenshot] = useState("");
	const [logo, setLogo] = useState("");
	const { access, setAccess } = useContext(userContext);
	const query = useQuery();
	useEffect(() => {
		AOS.init();
		if (query.get("code")) {
			const code = query.get("code");
			const fetchOptions = {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ code: code }),
			};
			fetch("http://localhost:8080/api/auth/new_google_login", fetchOptions).then(
				async (response) => {
					if (response.ok) {
						let access_token = await response.json();
						sessionStorage.setItem("sessionID", access_token.sessionID);
						access_token = access_token.access_token;
						setAccess(access_token);
					}
				},
			);
		}
		if (access) {
			getIdea(access).then((response) => {
				if (response) {
					setIdeas(JSON.parse(JSON.stringify(response)));
					setShowModal(<ShoelaceDrawer label='Hi there, Saatvik ' open={true}></ShoelaceDrawer>);
				}
			});
		}
	}, [access]);
	function onSaveIdeaClick() {
		if (!update) {
			const ideaObj = {
				title: ideaTitle,
				body: ideaBody,
			};
			addIdea(ideaObj, access).then((idea) => {
				const arr = ideas;
				arr.push(idea);
				setIdeas(arr);
				if (ideas.length > 0) {
					setShowModal(
						<ShoelaceAnimation name='wobble' duration='1000' iterations='1'>
							<ShoelaceAlert type='success' className='savedIdea-successful' open>
								<ShoelaceIcon slot='icon' name='check2-circle'></ShoelaceIcon>
								<strong>Saved !!!</strong>
								<ShoelaceIconButton
									name='x-circle-fill'
									className='modal-closeBtn'
									size='large'
									style={{ marginLeft: "60%" }}
									onClick={() => {
										setShowModal(null);
									}}
								></ShoelaceIconButton>
								<br />
								The idea {ideaTitle} has been saved
								<br />
							</ShoelaceAlert>
						</ShoelaceAnimation>,
					);
				} else {
					setShowModal(
						<ShoelaceDialog open label={`Saved!!!!`} className='saveProject-dialog'>
							The idea {ideaTitle} has been saved
						</ShoelaceDialog>,
					);
				}
				setIdeaTitle("");
				setIdeaBody("");
			});
		} else {
			const updatedIdea = {
				_id: updateId,
				title: ideaTitle,
				body: ideaBody,
			};
			updateIdea(updatedIdea, access).then((idea) => {
				const updatedArray = ideas;
				updatedArray.push(idea);
				setIdeas(updatedArray);
				setShowModal(
					<ShoelaceAnimation name='wobble' duration='1000' iterations='1'>
						<ShoelaceAlert type='success' className='savedIdea-successful' open>
							<ShoelaceIcon slot='icon' name='check2-circle'></ShoelaceIcon>
							<strong>Updated !!!</strong>
							<ShoelaceIconButton
								name='x-circle-fill'
								className='modal-closeBtn'
								size='large'
								style={{ marginLeft: "60%" }}
								onClick={() => {
									setShowModal(null);
								}}
							></ShoelaceIconButton>
							<br />
							The idea {ideaTitle} has been updated
							<br />
						</ShoelaceAlert>
					</ShoelaceAnimation>,
				);
				setIdeaTitle("");
				setIdeaBody("");
			});
		}
	}
	async function onSaveProjectClick() {
		setShowModal(
			<ShoelaceDialog open label={"Saving"} className='saveProject-dialog'>
				<ShoelaceSpinner className='save-spinner'></ShoelaceSpinner>
			</ShoelaceDialog>,
		);
		const screenshotUrl = await setFormDataForScreenshot();
		const logoUrl = await setFormDataForLogo();
		const project = {
			name: name,
			openOptimizations: 0,
			closedOptimizations: 0,
			openIdeas: 0,
			closedIdeas: 0,
			link: link,
			githubRepo: github,
			startDate: startDate,
			endDate: endDate,
			optimization: [],
			extendedIdeas: [],
			screenshotUrl: screenshotUrl,
			logoUrl: logoUrl,
		};
		addProject(project, access).then((response) => {
			if (response.name) {
				setShowModal(
					<ShoelaceAnimation name='wobble' duration='1000' iterations='1'>
						<ShoelaceAlert type='success' className='savedIdea-successful' open>
							<ShoelaceIcon slot='icon' name='check2-circle'></ShoelaceIcon>
							<strong>Saved !!!</strong>
							<ShoelaceIconButton
								name='x-circle-fill'
								className='modal-closeBtn'
								size='large'
								style={{ marginLeft: "60%" }}
								onClick={() => {
									setShowModal(null);
								}}
							></ShoelaceIconButton>
							<br />
							The project {name} has been saved
							<br />
						</ShoelaceAlert>
					</ShoelaceAnimation>,
				);
			}
		});
	}

	function onClickUpdateButton(event) {
		setUpdateId(event.target.id);
		setIdeaTitle(document.getElementById(`h${event.target.id}`).innerText);
		setIdeaBody(document.getElementById(`p${event.target.id}`).innerText);
		setIdeas(
			ideas.filter((idea) => {
				return idea._id !== event.target.id;
			}),
		);
		setUpdate(1);
	}
	function onClickDelete(event) {
		const idDelete = event.target.id.slice(2);
		deleteIdea(idDelete, access).then((response) => {
			getIdea(access).then((response) => {
				if (response) {
					setIdeas(JSON.parse(JSON.stringify(response)));
				}
			});
		});
	}
	function setFormDataForScreenshot() {
		const data = new FormData();
		data.append("file", screenshot);
		data.append("upload_preset", "reviewer");
		data.append("cloud_name", "maximuscloud");
		return fetch("https://api.cloudinary.com/v1_1/maximuscloud/image/upload", {
			method: "POST",
			body: data,
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					console.log("Error uploading image to cloudinary");
				}
			})
			.then((result) => {
				return result.url;
			});
	}
	function setFormDataForLogo() {
		const data = new FormData();
		data.append("file", logo);
		data.append("upload_preset", "reviewer");
		data.append("cloud_name", "maximuscloud");
		return fetch("https://api.cloudinary.com/v1_1/maximuscloud/image/upload", {
			method: "POST",
			body: data,
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					console.log("Error uploading image to cloudinary");
				}
			})
			.then((result) => {
				return result.url;
			});
	}
	const ideasArray = ideas.map((idea) => {
		return (
			<div
				className='idea-div'
				data-aos='slide-left'
				data-aos-anchor={`#p${idea._id}`}
				id={`d${idea._id}`}
				key={`${idea._id}`}
			>
				<h5 id={`h${idea._id}`} className='idea-title'>
					{idea.title}
				</h5>
				<p className='idea-body' id={`p${idea._id}`}>
					{idea.body}
				</p>
				<div className='btn-div'>
					<button onClick={onClickUpdateButton} id={`${idea._id}`} className='update-btn'>
						Update
					</button>
					<button onClick={onClickDelete} id={`b2${idea._id}`} className='delete-btn'>
						Delete
					</button>
				</div>
			</div>
		);
	});
	return (
		<div className='dashboard-container'>
			{access ? (
				<>
					<div className='addProject-container animate__animated animate__fadeIn'>
						<h3 className='addIdea-heading'>Add Project</h3>
						<div className='text-inputs'>
							<div className='addProject-input-headings'>
								<h4 className='addProject-headings'>Name</h4>
								<input
									className='addProject-input'
									placeholder='Name of the project'
									id='name'
									value={name}
									onChange={(event) => {
										setName(event.target.value);
									}}
								/>
							</div>
							<div className='addProject-input-headings'>
								<h4 className='addProject-headings'>Start Date</h4>
								<input
									className='addProject-input'
									id='startDate'
									value={startDate}
									onChange={(event) => {
										setStartDate(event.target.value);
									}}
									type='date'
									style={{ color: "#ff5714" }}
								/>
							</div>
							<div className='addProject-input-headings'>
								<h4 className='addProject-headings'>End Date</h4>
								<input
									className='addProject-input'
									id='endDate'
									value={endDate}
									onChange={(event) => {
										setEndDate(event.target.value);
									}}
									type='date'
									style={{ color: "#ff5714" }}
								/>
							</div>
							<div className='addProject-input-headings'>
								<h4 className='addProject-headings'>Deployed on Link</h4>
								<input
									className='addProject-input'
									placeholder='Link to the project'
									id='link'
									value={link}
									onChange={(event) => {
										setLink(event.target.value);
									}}
									type='url'
								/>
							</div>
							<div className='addProject-input-headings'>
								<h4 className='addProject-headings'>Github Repository</h4>
								<input
									className='addProject-input'
									placeholder='Github Repository Name'
									id='github'
									value={github}
									onChange={(event) => {
										setGithub(event.target.value);
									}}
								/>
							</div>
							<div className='uploader-div'>
								<div className='addProject-input-headings' id='screenshot-div'>
									<h4 className='addProject-headings'>Screenshot</h4>
									<input
										className='addProject-input'
										type='file'
										onChange={(event) => {
											var reader = new FileReader();
											reader.onload = function (event) {
												let screenshot;
												if (document.querySelector(".screenshot")) {
													document.querySelector(".screenshot").src = event.target.result;
													setTimeout(() => {
														document.querySelector(".screenshot").setAttribute("style", "");
													}, 10);
													document
														.querySelector(".screenshot")
														.setAttribute("style", "animation:none");
												} else {
													screenshot = document.createElement("img");
													screenshot.src = event.target.result;
													screenshot.className = "screenshot";
													document.getElementById("screenshot-div").appendChild(screenshot);
												}
											};
											reader.readAsDataURL(event.target.files[0]);
											setScreenshot(event.target.files[0]);
										}}
									/>
								</div>
								<div className='addProject-input-headings' id='logo-div'>
									<h4 className='addProject-headings'>Logo</h4>
									<input
										className='addProject-input'
										type='file'
										onChange={(event) => {
											const reader = new FileReader();
											reader.onload = function (event) {
												let logo;
												if (document.querySelector(".logo")) {
													document.querySelector(".logo").src = event.target.result;
													setTimeout(() => {
														document.querySelector(".logo").setAttribute("style", "");
													}, 10);
													document.querySelector(".logo").setAttribute("style", "animation:none");
												} else {
													logo = document.createElement("img");
													logo.src = event.target.result;
													logo.className = "logo";
													document.getElementById("logo-div").appendChild(logo);
												}
											};
											reader.readAsDataURL(event.target.files[0]);
											setLogo(event.target.files[0]);
										}}
									/>
								</div>
							</div>
						</div>
						<button className='addIdea-btn' onClick={onSaveProjectClick}>
							Save Project
						</button>
					</div>
					<div className='addIdea-container animate__animated animate__fadeIn'>
						<h3 className='addIdea-heading'>Add Idea</h3>
						<h4 className='addProject-headings'>Title</h4>
						<input
							className='addIdea-input'
							placeholder='What ?'
							id='ideaTitle'
							value={ideaTitle}
							onChange={(event) => {
								console.log("run");
								setIdeaTitle(event.target.value);
							}}
						/>
						<h4 className='addProject-headings'>Body</h4>
						<textarea
							className='addIdea-input'
							placeholder='How ?'
							id='ideaBody'
							value={ideaBody}
							onChange={(event) => {
								setIdeaBody(event.target.value);
							}}
							maxLength={300}
						/>
						<button className='addIdea-btn' onClick={onSaveIdeaClick}>
							Save Idea
						</button>
						{showModal}
					</div>
					<div className='showIdea-container animate__animated animate__fadeIn' data-aos='fade-up'>
						<h2 style={{ color: "#ffba08", textAlign: "center", marginTop: "50px" }}>
							Potential Projects
						</h2>
						<div className='ideasDisplay' id='a'>
							{ideasArray.length ? ideasArray : <h1>Wow soo empty</h1>}
						</div>
					</div>
				</>
			) : (
				<ShoelaceAnimation name='fade-in' iterations={1}>
					<div style={{ color: "#444" }}>
						<svg
							id='color'
							enable-background='new 0 0 24 24'
							height='200'
							viewBox='0 0 24 24'
							width='200'
							xmlns='http://www.w3.org/2000/svg'
							style={{ margin: "50px" }}
						>
							<path
								d='m12 8.75c-.553 0-1-.447-1-1v-2.75c0-1.654-1.346-3-3-3s-3 1.346-3 3v2.75c0 .553-.447 1-1 1s-1-.447-1-1v-2.75c0-2.757 2.243-5 5-5s5 2.243 5 5v2.75c0 .553-.447 1-1 1z'
								fill='#444'
							/>
							<path
								d='m13.75 20h-11.5c-1.24 0-2.25-1.01-2.25-2.25v-8.5c0-1.24 1.01-2.25 2.25-2.25h11.5c1.24 0 2.25 1.01 2.25 2.25v8.5c0 1.24-1.01 2.25-2.25 2.25z'
								fill='#444'
							/>
							<path d='m8 0c-2.757 0-5 2.243-5 5v2h2v-2c0-1.654 1.346-3 3-3z' fill='#444' />
							<path
								d='m8 7h-3-2-.75c-1.24 0-2.25 1.01-2.25 2.25v8.5c0 1.24 1.01 2.25 2.25 2.25h5.75z'
								fill='#444'
							/>
							<path d='m20 19c-1.103 0-2-.896-2-2s.897-2 2-2 2 .896 2 2-.897 2-2 2z' fill='#444' />
							<path
								d='m23.25 24h-6.5c-.414 0-.75-.336-.75-.75v-.5c0-1.517 1.233-2.75 2.75-2.75h2.5c1.517 0 2.75 1.233 2.75 2.75v.5c0 .414-.336.75-.75.75z'
								fill='#444'
							/>
							<g fill='#444'>
								<path d='m20 15c-1.103 0-2 .896-2 2s.897 2 2 2z' />
								<path d='m20 20h-1.25c-1.517 0-2.75 1.233-2.75 2.75v.5c0 .414.336.75.75.75h3.25z' />
							</g>
						</svg>
						<h5>Sign in/Sign up to continue</h5>
					</div>
				</ShoelaceAnimation>
			)}
		</div>
	);
};
export default withRouter(DashBoard);

//Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
