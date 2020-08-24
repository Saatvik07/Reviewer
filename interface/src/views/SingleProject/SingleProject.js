import React, { useState, useEffect, useContext } from "react";
import "./SingleProject.css";
import { withRouter, useParams } from "react-router-dom";
import { getProject, addOptiAndIdea } from "../../utils/helpers";
import { Modal, Button } from "react-bootstrap";
import logo from "../Projects/logo.png";
import { userContext } from "../App/App";

function SingleProject() {
	const { access, setAccess } = useContext(userContext);
	const { id } = useParams();
	const [project, setProject] = useState({
		_id: 1,
		name: "Name1",
		link: "#",
		githubRepo: "SomethingABC",
		optimization: [],
		openOptimizations: 0,
		closedOptimizations: 0,
		openIdeas: 0,
		closedIdeas: 0,
		extendedIdeas: [],
		startDate: "03/07/2020",
		endDate: "06/07/2020",
	});
	const [optimizationTitle, setOptimizationTitle] = useState("");
	const [optimizationBody, setOptimizationBody] = useState("");
	const [extenIdeaTitle, setExtenIdeaTitle] = useState("");
	const [extenIdeaBody, setExtenIdeaBody] = useState("");
	const [disp, setDisp] = useState([]);
	const [ideaDisp, setIdeaDisp] = useState([]);
	const [showModal, setShowModal] = useState([false, false]);
	useEffect(() => {
		getProject(id, access).then((response) => {
			if (response) {
				setProject(response);
			}
		});
	}, []);
	const handleOpen = (event) => {
		const id = event.target.id.slice(4);
		let prefix;
		if (event.target.id[0] === "O") {
			prefix = "O";
		} else {
			prefix = "E";
		}
		const divId = `${prefix}d${id}`;
		const buttonId = `${prefix}btn${id}`;
		const buttonDivId = `${prefix}d2${id}`;
		document.getElementById(buttonDivId).removeChild(document.getElementById(buttonId));
		const newButton = document.createElement("button");
		newButton.id = `${prefix}btn${id}`;
		newButton.innerText = "Close";
		if (prefix === "E") {
			console.log("Idea " + id + " is opening");
			let updated = project.extendedIdeas.map((idea) => {
				if (idea.title === id) {
					return {
						title: idea.title,
						body: idea.body,
						closed: 0,
					};
				}
				return {
					...idea,
				};
			});
			document.getElementById(divId).className = "singleExtenIdea-div available";
			newButton.className = "closeExtenIdea-btn";
			setProject((current) => {
				return {
					...current,
					extendedIdeas: updated,
					openIdeas: current.openIdeas + 1,
					closedIdeas: current.closedIdeas - 1,
				};
			});
		} else {
			console.log("Optimize " + id + " is opening");
			document.getElementById(divId).className = "singleOptimize-div available";
			newButton.className = "closeOptimize-btn";
			let updated = project.optimization.map((opti) => {
				if (opti.title === id) {
					return {
						title: opti.title,
						body: opti.body,
						closed: 0,
					};
				}
				return {
					...opti,
				};
			});
			setProject((current) => {
				return {
					...current,
					optimization: updated,
					openOptimizations: current.openOptimizations + 1,
					closedOptimizations: current.closedOptimizations - 1,
				};
			});
		}

		newButton.onclick = handleClose;
		document.getElementById(buttonDivId).appendChild(newButton);
	};
	const handleClose = (event) => {
		const id = event.target.id.slice(4);
		let prefix;
		if (event.target.id[0] === "O") {
			prefix = "O";
		} else {
			prefix = "E";
		}
		const divId = `${prefix}d${id}`;
		const buttonId = `${prefix}btn${id}`;
		const buttonDivId = `${prefix}d2${id}`;
		document.getElementById(buttonDivId).removeChild(document.getElementById(buttonId));
		const newButton = document.createElement("button");
		newButton.id = `${prefix}btn${id}`;
		newButton.innerText = "Open";
		if (prefix === "E") {
			console.log("Idea " + id + " is being closed");
			document.getElementById(divId).className = "singleExtenIdea-div notavailable";
			newButton.className = "openExtenIdea-btn";
			let updated = project.extendedIdeas.map((idea) => {
				if (idea.title === id) {
					return {
						title: idea.title,
						body: idea.body,
						closed: 1,
					};
				}
				return {
					...idea,
				};
			});
			setProject((current) => {
				return {
					...current,
					extendedIdeas: updated,
					closedIdeas: current.closedIdeas + 1,
					openIdeas: current.openIdeas - 1,
				};
			});
		} else {
			console.log("Optimize " + id + " is being closed");
			document.getElementById(divId).className = "singleOptimize-div notavailable";
			newButton.className = "openOptimize-btn";
			let updated = project.optimization.map((opti) => {
				if (opti.title === id) {
					return {
						title: opti.title,
						body: opti.body,
						closed: 1,
					};
				}
				return {
					...opti,
				};
			});
			setProject((current) => {
				return {
					...current,
					optimization: updated,
					openOptimizations: current.openOptimizations - 1,
					closedOptimizations: current.closedOptimizations + 1,
				};
			});
		}

		newButton.onclick = handleOpen;
		document.getElementById(buttonDivId).appendChild(newButton);
	};
	const handleDelete = (event) => {
		const id = event.target.id.slice(5);
		if (event.target.id[0] === "E") {
			const arr = project.extendedIdeas.filter((idea) => {
				return idea.title !== id;
			});
			setProject((current) => {
				if (document.getElementById(`Ed${id}`).classList[1] == "available") {
					return {
						...current,
						extendedIdeas: arr,
						openIdeas: current.openIdeas - 1,
					};
				} else {
					return {
						...current,
						extendedIdeas: arr,
						closedIdeas: current.closedIdeas - 1,
					};
				}
			});
		} else {
			const arr = project.optimization.filter((idea) => {
				return idea.title !== id;
			});
			setProject((current) => {
				if (document.getElementById(`Od${id}`).classList[1] == "available") {
					return {
						...current,
						optimization: arr,
						openOptimizations: current.openOptimizations - 1,
					};
				} else {
					return {
						...current,
						optimization: arr,
						closedOptimizations: current.closedOptimizations - 1,
					};
				}
			});
		}
	};
	const handleModalClose = () => {
		setShowModal([false, false]);
	};
	useEffect(() => {
		addOptiAndIdea(
			{
				arr: project.optimization,
				open: project.openOptimizations,
				closed: project.closedOptimizations,
			},
			id,
			"optimization",
			access,
		);
		console.log(project);
		let optimizeArr = project.optimization.map((obj) => {
			return (
				<div
					className={
						obj.closed ? "singleOptimize-div notavailable" : "singleOptimize-div available"
					}
					key={obj.title}
					id={`Od${obj.title}`}
				>
					<div id={`Od2${obj.title}`}>
						<h5>{obj.title}</h5>
						<button className='deleteOptimize-btn' id={`Obtn2${obj.title}`} onClick={handleDelete}>
							Delete
						</button>
						{obj.closed ? (
							<button className='openOptimize-btn' id={`Obtn${obj.title}`} onClick={handleOpen}>
								Open
							</button>
						) : (
							<button className='closeOptimize-btn' id={`Obtn${obj.title}`} onClick={handleClose}>
								Close
							</button>
						)}
					</div>

					<p>{obj.body}</p>
				</div>
			);
		});
		setDisp(optimizeArr);
	}, [
		project.optimization,
		project.optimization.length,
		project.closedOptimizations,
		project.openOptimizations,
	]);
	useEffect(() => {
		addOptiAndIdea(
			{
				arr: project.extendedIdeas,
				open: project.openIdeas,
				closed: project.closedIdeas,
			},
			id,
			"idea",
			access,
		);
		console.log(project);
		let extenIdeaArr = project.extendedIdeas.map((obj) => {
			let secondButton;
			if (obj.closed) {
				secondButton = (
					<button className='closeExtenIdea-btn' id={`Ebtn${obj.title}`} onClick={handleOpen}>
						Open
					</button>
				);
			} else {
				secondButton = (
					<button className='closeExtenIdea-btn' id={`Ebtn${obj.title}`} onClick={handleClose}>
						Close
					</button>
				);
			}
			return (
				<div
					className={
						obj.closed ? "singleExtenIdea-div notavailable" : "singleExtenIdea-div available"
					}
					key={obj.title}
					id={`Ed${obj.title}`}
				>
					<div id={`Ed2${obj.title}`}>
						<h5>{obj.title}</h5>
						<button className='deleteExtenIdea-btn' id={`Ebtn2${obj.title}`} onClick={handleDelete}>
							Delete
						</button>
						{secondButton}
					</div>

					<p>{obj.body}</p>
				</div>
			);
		});
		setIdeaDisp(extenIdeaArr);
	}, [project.openIdeas, project.closedIdeas, project.extendedIdeas, project.extendedIdeas.length]);
	let modal = (
		<Modal show={showModal[0]} onHide={handleModalClose} className='modal-container'>
			<Modal.Header closeButton>
				<Modal.Title>Sorry cannot add this optimization</Modal.Title>
			</Modal.Header>
			<Modal.Body>An optimization with the same title exists</Modal.Body>
			<Modal.Footer>
				<Button onClick={handleModalClose}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
	let modal1 = (
		<Modal show={showModal[1]} onHide={handleModalClose} className='modal-container'>
			<Modal.Header closeButton>
				<Modal.Title>Sorry cannot add this idea</Modal.Title>
			</Modal.Header>
			<Modal.Body>An extended idea with the same title exists</Modal.Body>
			<Modal.Footer>
				<Button onClick={handleModalClose}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
	const onOptimizeAdd = () => {
		let unique = 1;
		for (let i = 0; i < project.optimization.length; i++) {
			if (project.optimization[i].title === optimizationTitle) {
				unique = 0;
				setShowModal([true, false]);
				break;
			}
		}
		if (unique) {
			const arr = project.optimization;

			arr.push({ title: optimizationTitle, body: optimizationBody, closed: 0 });
			setProject((current) => {
				return {
					...current,
					optimization: arr,
					openOptimizations: project.openOptimizations + 1,
				};
			});
		}
	};
	const onExtenIdeaAdd = () => {
		let unique = 1;
		for (let i = 0; i < project.extendedIdeas.length; i++) {
			if (project.extendedIdeas[i].title === extenIdeaTitle) {
				unique = 0;
				setShowModal([false, true]);
				break;
			}
		}
		if (unique) {
			const arr = project.extendedIdeas;
			arr.push({ title: extenIdeaTitle, body: extenIdeaBody, closed: 0 });
			setProject((current) => {
				return {
					...current,
					extendedIdeas: arr,
					openIdeas: project.openIdeas + 1,
				};
			});
		}
	};
	return (
		<div className='singleProject-container'>
			<div className='singleProject-left-div'>
				<img src={logo} className='singleProject-logo' />
				<div className='singleProject-info-div'>
					<h3>Name: {project.name}</h3>
					<h3>Github: {project.githubRepo}</h3>
					<h5>
						Optimization:{" "}
						{`${project.openOptimizations} open, ${project.closedOptimizations} closed`}
					</h5>
					<h5>Extended Ideas: {`${project.openIdeas} open, ${project.closedIdeas} closed`}</h5>
				</div>
			</div>
			<div className='singleProject-right-div'>
				<div className='addOptimize-div'>
					<div className='addOptimize-input-div'>
						<h2 style={{ color: "#ff5714" }}>Optimizations</h2>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								width: "100%",
							}}
						>
							<input
								id='optimizationTitle'
								className='addOptimize-input'
								placeholder='Enter the component you want to optimize'
								onChange={(event) => {
									setOptimizationTitle(event.target.value);
								}}
							></input>
							<button onClick={onOptimizeAdd} className='addOptimize-btn'>
								Add
							</button>
						</div>

						<textarea
							id='optimizationBody'
							className='addOptimize-input'
							placeholder='How to optimize?'
							maxLength='300'
							onChange={(event) => {
								setOptimizationBody(event.target.value);
							}}
						/>
					</div>
					<div className='showOptimize-div'>{disp}</div>
				</div>
				<div className='addExten-div'>
					<div className='showExtenIdea-div'>{ideaDisp}</div>
					<div className='addExten-input-div'>
						<h2 style={{ color: "#ff5714" }}>Extended Ideas</h2>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								width: "100%",
							}}
						>
							<input
								id='extenIdeaTitle'
								className='addExtenIdea-input'
								placeholder='Enter the component you want to optimize'
								onChange={(event) => {
									setExtenIdeaTitle(event.target.value);
								}}
							></input>
							<button onClick={onExtenIdeaAdd} className='addExtenIdea-btn'>
								Add
							</button>
						</div>
						<textarea
							id='extenIdeaBody'
							className='addExtenIdea-input'
							placeholder='How to optimize?'
							maxLength='300'
							onChange={(event) => {
								setExtenIdeaBody(event.target.value);
							}}
						/>
					</div>
				</div>
			</div>
			<div className='Modal'>
				{modal}
				{modal1}
			</div>
		</div>
	);
}
export default withRouter(SingleProject);
