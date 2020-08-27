const baseUrl = "http://localhost:8080/api";
export const addProject = (project, accessToken) => {
	let url = `${baseUrl}/projects`;
	const fetchOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ projectData: project }),
	};
	return fetch(url, fetchOptions).then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			return new Promise((resolve) => {
				resolve("Cannot add project!!!!");
			});
		}
	});
};
export const getProjects = (accessToken) => {
	let url = `${baseUrl}/projects`;
	return fetch(url, { headers: { authorization: `Bearer ${accessToken}` } }).then((response) => {
		if (response.ok) {
			return response.json();
		} else if (response.status === 404) {
			return [];
		} else {
			return new Promise((resolve) => {
				resolve("Cannot get projects!!!!");
			});
		}
	});
};
export const getProject = (id, accessToken) => {
	let url = `${baseUrl}/projects/${id}`;
	return fetch(url, { headers: { authorization: `Bearer ${accessToken}` } }).then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			return new Promise((resolve) => {
				resolve(`Cannot get project with id: ${id}`);
			});
		}
	});
};
export const addIdea = (idea, accessToken) => {
	let url = `${baseUrl}/idea`;
	const fetchOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ ideaData: idea }),
	};
	return fetch(url, fetchOptions).then((response) => {
		if (response.ok) {
			return response.json().then((jsonResponse) => {
				return jsonResponse.idea;
			});
		} else {
			return new Promise((resolve) => {
				resolve("Cannot add idea!!!!");
			});
		}
	});
};

export const getIdea = (accessToken) => {
	let url = `${baseUrl}/idea`;
	return fetch(url, { headers: { authorization: `Bearer ${accessToken}` } }).then((response) => {
		if (response.ok) {
			return response.json();
		} else if (response.status === 404) {
			return [];
		} else {
			return new Promise((resolve) => {
				resolve("Cannot get ideas!!!!");
			});
		}
	});
};
export const updateIdea = (idea, accessToken) => {
	let url = `${baseUrl}/idea`;
	let fetchOptions = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ ideaData: idea }),
	};
	return fetch(url, fetchOptions).then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			return new Promise((resolve) => {
				resolve(`Cannot update the idea with title:${idea.title}`);
			});
		}
	});
};

export const deleteIdea = (idea, accessToken) => {
	let url = `${baseUrl}/idea`;
	let fetchOptions = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ ideaId: idea }),
	};
	return fetch(url, fetchOptions).then((response) => {
		if (response.ok) {
			return response;
		} else {
			return new Promise((resolve) => {
				resolve("Cannot delete the idea");
			});
		}
	});
};

export const addOptiAndIdea = (obj, id, type, accessToken) => {
	let fetchOptions;
	if (type === "idea") {
		fetchOptions = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ ideas: obj }),
		};
	} else if (type === "optimization") {
		fetchOptions = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ optimizations: obj }),
		};
	}
	let url = `${baseUrl}/projects/${id}`;
	return fetch(url, fetchOptions).then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			return new Promise((resolve) => {
				resolve(`Cannot add the optimization`);
			});
		}
	});
};
export const registerUser = (username, email, password) => {
	const fetchOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ email: email, username: username, password: password }),
	};
	return fetch(`${baseUrl}/auth/user/create`, fetchOptions).then(async (response) => {
		if (response.ok) {
			const jsonResponse = await response.json();
			return { message: "sent", email: jsonResponse.email };
		} else if (response.status === 403) {
			return { message: "already in use" };
		}
	});
};

export const registerUserGoogle = () => {
	return fetch(`${baseUrl}/auth/generate_url`).then(async (response) => {
		if (response.ok) {
			return await response.json();
		}
	});
};

export const loginUser = (email, password) => {
	const fetchOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ email: email, password: password }),
	};
	return fetch(`${baseUrl}/auth/login`, fetchOptions).then(async (response) => {
		if (response.ok) {
			const jsonResponse = await response.json();
			return jsonResponse;
		} else if (response.status === 404) {
			return { message: "not found" };
		} else if (response.status === 403) {
			return { message: "wrong password" };
		}
	});
};

export const logoutUser = (access) => {
	const fetchOptions = {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${access}`,
		},
		body: JSON.stringify({ sessionID: sessionStorage.getItem("sessionID") }),
	};
	fetch(`${baseUrl}/auth/logout`, fetchOptions).then((response) => {
		if (response.ok) {
			sessionStorage.clear();
		}
	});
};

export const verifyUser = (access) => {
	const fetchOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${access}`,
		},
		credentials: "include",
	};
	return fetch(`${baseUrl}/auth/verify`, fetchOptions).then(async (response) => {
		if (response.status === 403) {
			return { message: "No access token" };
		} else if (response.status === 401) {
			return { message: "Not verified" };
		} else if (response.ok) {
			const jsonResponse = await response.json();
			return { ...jsonResponse, message: "Verified" };
		} else if (response.status === 404) {
			return { message: "Verified Already" };
		}
	});
};
