import React, { useState, useEffect, useContext } from "react";
import "./SingleProject.css";
import { withRouter, useParams } from "react-router-dom";
import { getProject, addOptiAndIdea } from "../../utils/helpers";
import { Modal, Button, Tab, Tabs } from "react-bootstrap";
import logo from "../Projects/logo.png";
import extenIcon from "./optimizeIcon.png";
import optimizeIcon from "./extenIcon.png";
import { userContext } from "../App/App";
import { ShoelaceDialog, ShoelaceButton, ShoelaceAnimation } from "../../utils/ShoelaceComponents";
function SingleProject() {
	const { access, setAccess } = useContext(userContext);
	const { id } = useParams();
	const [project, setProject] = useState({
		_id: 1,
		name: "Name1",
		link: "#",
		githubRepo: "SomethingABC",
		optimization: [{ closed: 1, body: "Heyy", title: "Something1" }],
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
	const [showModal, setShowModal] = useState(null);
	useEffect(() => {
		if (access) {
			console.log(access);
			getProject(id, access).then((response) => {
				if (response) {
					setProject(response);
				}
			});
		}
	}, [access]);
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
			let updated = project.extendedIdeas
				? project.extendedIdeas.map((idea) => {
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
				  })
				: [];
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
			document.getElementById(divId).className = "singleOptimize-div available";
			newButton.className = "closeOptimize-btn";
			let updated = project.optimization
				? project.optimization.map((opti) => {
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
				  })
				: [];
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
	useEffect(() => {
		if (access) {
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
		}

		let optimizeArr =
			project.optimization && project.optimization.length > 0 ? (
				project.optimization.map((obj) => {
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
								<button
									className='deleteOptimize-btn'
									id={`Obtn2${obj.title}`}
									onClick={handleDelete}
								>
									Delete
								</button>
								{obj.closed ? (
									<button className='openOptimize-btn' id={`Obtn${obj.title}`} onClick={handleOpen}>
										Open
									</button>
								) : (
									<button
										className='closeOptimize-btn'
										id={`Obtn${obj.title}`}
										onClick={handleClose}
									>
										Close
									</button>
								)}
							</div>

							<p>{obj.body}</p>
						</div>
					);
				})
			) : (
				<>
					<h4 style={{ color: "#444", marginTop: "50px" }}>Wow so empty</h4>
				</>
			);
		setDisp(optimizeArr);
	}, [project.optimization, project.closedOptimizations, project.openOptimizations, access]);
	useEffect(() => {
		if (access) {
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
		}

		let extenIdeaArr =
			project.extendedIdeas && project.extendedIdeas.length > 0 ? (
				project.extendedIdeas.map((obj) => {
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
								<button
									className='deleteExtenIdea-btn'
									id={`Ebtn2${obj.title}`}
									onClick={handleDelete}
								>
									Delete
								</button>
								{secondButton}
							</div>

							<p>{obj.body}</p>
						</div>
					);
				})
			) : (
				<>
					<h4 style={{ color: "#444", marginTop: "50px" }}>Wow so empty</h4>
				</>
			);
		setIdeaDisp(extenIdeaArr);
	}, [project.openIdeas, project.closedIdeas, project.extendedIdeas, access]);
	const onOptimizeAdd = () => {
		let unique = 1;
		for (let i = 0; i < project.optimization.length; i++) {
			if (project.optimization[i].title === optimizationTitle) {
				unique = 0;
				setShowModal(
					<ShoelaceDialog open label={"OOPS !!!"} className='saveProject-dialog'>
						An optimization with this title already exists
					</ShoelaceDialog>,
				);
				break;
			}
		}
		if (unique) {
			const arr = project.optimization;

			arr.unshift({ title: optimizationTitle, body: optimizationBody, closed: 0 });
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
				setShowModal(
					<ShoelaceDialog open label={"OOPS !!!"} className='saveProject-dialog'>
						An idea with this title already exists
					</ShoelaceDialog>,
				);
				break;
			}
		}
		if (unique) {
			const arr = project.extendedIdeas;
			arr.unshift({ title: extenIdeaTitle, body: extenIdeaBody, closed: 0 });
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
				<Tabs defaultActiveKey='Optimizations' className='singleTabGroup'>
					<Tab title='Optimizations' eventKey='Optimizations' className='singleTab'>
						<div className='addOptimize-div'>
							<div className='addOptimize-input-div'>
								<h2 style={{ color: "#ff5714" }}>Optimizations</h2>
								<img src={optimizeIcon} className='singleProject-icon'></img>

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
					</Tab>
					<Tab title='Extended ideas' eventKey='Extended ideas' className='singleTab'>
						<div className='addExten-div'>
							<div className='addExten-input-div'>
								<h2 style={{ color: "#ff5714" }}>Extended Ideas</h2>
								<img src={extenIcon} className='singleProject-icon'></img>
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
							<div className='showExtenIdea-div'>{ideaDisp}</div>
						</div>
					</Tab>
				</Tabs>
			</div>
			{showModal}
		</div>
	);
}
export default withRouter(SingleProject);
//Icons made by <a href="https://www.flaticon.com/authors/ultimatearm" title="ultimatearm">ultimatearm</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
//Icons made by <a href="https://www.flaticon.com/authors/xnimrodx" title="xnimrodx">xnimrodx</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
