import React, { useState, useEffect, useContext } from "react";
import "./DashBoard.css";
import { Modal, Button } from "react-bootstrap";
import { withRouter, useLocation } from "react-router-dom";
import { addProject, addIdea, getIdea, updateIdea, deleteIdea } from "../../utils/helpers";
import { userContext } from "../App/App";
let showIdeaModal = 0,
	showProjectModal = 0;
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
	const [showModal, setShowModal] = useState(false);
	const [screenshot, setScreenshot] = useState("");
	const [logo, setLogo] = useState("");
	const { access, setAccess } = useContext(userContext);
	const query = useQuery();
	useEffect(() => {
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
				showIdeaModal = 1;
				setIdeas(arr);
				setShowModal(
					<Modal show={true} onHide={handleCloseModal}>
						<Modal.Header closeButton>
							<Modal.Title>Saved</Modal.Title>
						</Modal.Header>
						<Modal.Body>The idea ({`${ideaTitle}`}) has been saved successfully</Modal.Body>
						<Modal.Footer>
							<Button variant='secondary' onClick={handleCloseModal}>
								Close
							</Button>
						</Modal.Footer>
					</Modal>,
				);
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
				setIdeaTitle("");
				setIdeaBody("");
			});
		}
	}
	async function onSaveProjectClick() {
		const screenshotUrl = await setFormDataForScreenshot();
		const logoUrl = await setFormDataForLogo();
		console.log([screenshotUrl, logoUrl]);
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
				showProjectModal = 1;
				setShowModal(
					<Modal show={true} onHide={handleCloseModal}>
						<Modal.Header closeButton>
							<Modal.Title>Saved</Modal.Title>
						</Modal.Header>
						<Modal.Body>The project ({`${name}`}) has been saved successfully</Modal.Body>
						<Modal.Footer>
							<Button variant='secondary' onClick={handleCloseModal}>
								Close
							</Button>
							<Button variant='primary'>Understood</Button>
						</Modal.Footer>
					</Modal>,
				);
			}
		});
	}

	// function onChangeUpdatedIdea(event) {
	// 	console.log(event.target);
	// 	if (event.target.id === "updateBody") {
	// 		setUpdateBody(event.target.value);
	// 	} else if (event.target.id === "updateTitle") {
	// 		setUpdateTitle(event.target.value);
	// 	}
	// }
	// function onClickUpdate(event) {
	// 	const ideaDiv = document.getElementById(`d${event.target.id}`);
	// 	const title = document.getElementById(`h${event.target.id}`).innerText;
	// 	const body = document.getElementById(`p${event.target.id}`).innerText;
	// 	const updateButtonId = event.target.id;
	// 	setUpdateBody(body);
	// 	setUpdateId(updateButtonId);
	// 	setUpdateTitle(title);
	// 	ideaDiv.innerHTML = "";
	// 	const updateTitleElement = document.createElement("input");
	// 	updateTitleElement.value = updateTitle;
	// 	updateTitleElement.id = "updateTitle";
	// 	updateTitleElement.className = "addIdea-input";
	// 	updateTitleElement.onchange = (event) => {
	// 		setUpdateTitle(event.target.value);
	// 	};
	// 	const updateBodyElement = document.createElement("textarea");
	// 	updateBodyElement.id = "updateBody";
	// 	updateBodyElement.value = updateBody;
	// 	updateBodyElement.className = "addIdea-input";
	// 	updateBodyElement.onchange = onChangeUpdatedIdea;
	// 	const updateButtonElement = document.createElement("button");
	// 	updateButtonElement.id = updateButtonId;
	// 	updateButtonElement.onclick = () => {
	// 		console.log(updateTitle);
	// 	};
	// 	updateButtonElement.innerHTML = "Save";
	// 	ideaDiv.appendChild(updateTitleElement);
	// 	ideaDiv.appendChild(updateBodyElement);
	// 	ideaDiv.appendChild(updateButtonElement);
	// }
	// function onUpdate() {
	// 	console.log(updateTitle, "title");
	// 	const updatedIdea = {
	// 		title: updateTitle,
	// 		body: updateBody,
	// 		_id: updateId,
	// 	};

	// 	updateIdea(updatedIdea, access).then((response) => {
	// 		const ideaDiv = document.getElementById(`d${response._id}`);
	// 		ideaDiv.innerHTML = "";
	// 		const titleElement = document.createElement("h5");
	// 		titleElement.id = `h${response._id}`;
	// 		titleElement.innerText = `${response.title}`;
	// 		const bodyElement = document.createElement("p");
	// 		bodyElement.id = `p${response._id}`;
	// 		bodyElement.innerText = `${response.body}`;
	// 		bodyElement.className = "idea-body";
	// 		const button = document.createElement("button");
	// 		button.id = `${response._id}`;
	// 		button.innerText = "Update";
	// 		button.onclick = onClickUpdate;
	// 		button.className = "update-btn";
	// 		const delButton = document.createElement("button");
	// 		delButton.id = `b2${response._id}`;
	// 		delButton.innerText = "Delete";
	// 		delButton.onclick = onClickDelete;
	// 		delButton.className = "delete-btn";
	// 		const btnDiv = document.createElement("div");
	// 		btnDiv.className = "btn-div";
	// 		btnDiv.appendChild(delButton);
	// 		btnDiv.appendChild(button);
	// 		ideaDiv.appendChild(titleElement);
	// 		ideaDiv.appendChild(bodyElement);
	// 		ideaDiv.appendChild(btnDiv);
	// 	});
	// }
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
	function handleCloseModal() {
		setShowModal(null);
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
			<div className='idea-div' id={`d${idea._id}`} key={`${idea._id}`}>
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
	// if (showIdeaModal === 1) {
	// 	showIdeaModal = 0;
	// 	modal = (
	// 		<Modal show={showModal} onHide={handleCloseModal}>
	// 			<Modal.Header closeButton>
	// 				<Modal.Title>Saved</Modal.Title>
	// 			</Modal.Header>
	// 			<Modal.Body>The idea ({`${ideaTitle}`}) has been saved successfully</Modal.Body>
	// 			<Modal.Footer>
	// 				<Button variant='secondary' onClick={handleCloseModal}>
	// 					Close
	// 				</Button>
	// 			</Modal.Footer>
	// 		</Modal>
	// 	);
	// } else if (showProjectModal === 1) {
	// 	showProjectModal = 0;
	// 	modal = (
	// 		<Modal show={showModal} onHide={handleCloseModal}>
	// 			<Modal.Header closeButton>
	// 				<Modal.Title>Saved</Modal.Title>
	// 			</Modal.Header>
	// 			<Modal.Body>The project ({`${name}`}) has been saved successfully</Modal.Body>
	// 			<Modal.Footer>
	// 				<Button variant='secondary' onClick={handleCloseModal}>
	// 					Close
	// 				</Button>
	// 				<Button variant='primary'>Understood</Button>
	// 			</Modal.Footer>
	// 		</Modal>
	// 	);
	// }
	return (
		<div className='dashboard-container'>
			<div className='addProject-container'>
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
											document.querySelector(".screenshot").setAttribute("style", "animation:none");
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
			<div className='addIdea-container'>
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
			</div>
			<div className='showIdea-container'>
				<h2 style={{ color: "#ffba08", textAlign: "center", marginTop: "50px" }}>
					Potential Projects
				</h2>
				<div className='ideasDisplay'>{ideasArray}</div>
			</div>
			{showModal}
		</div>
	);
};
export default withRouter(DashBoard);
/* 
<div className='special-inputs'>
            <div className='optimize-container'>
              <div className='add-entry'>
                <h1>Optimizations</h1>
                <input className='addProject-input' placeholder='Component Affected' />
                <input className='addProject-input' placeholder='A way to optimize it' />
              </div>
            </div>
            <div className='extend-container'>
              <div className='add-entry'>
                <h1>Extended Idea</h1>
                <input className='addProject-input' placeholder='What ?' />
                <input className='addProject-input' placeholder='How ?' />
              </div>
            </div>
          </div>*/
