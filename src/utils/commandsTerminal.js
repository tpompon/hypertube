import API from "controllers"

const help =
`
	--- Commands List ---
	- clear / Clear terminal history
	- user [name] / Give informations about an user
	- users / List of the users
	- movies / List movies stored in database
	- movie / Give informations about a movie
	- ban [name] [time - h for hours / d for days]
`

const getUsers = async() => {
	let users = ""
	const response = await API.users.get()
	if (response.data.success) {
		response.data.users.forEach((user, i) => {
			users += `${user.username}${(i < response.data.users.length - 1) ? ", " : ""}`
		})
		return [users]
	} else {
		return []
	}
}

const getDataUser = async(user) => {
	const response = await API.users.byUsername.get(user)
	if (response.data.user.length > 0) {
		let string = ""
		Object.entries(response.data.user[0]).forEach((entry) => {
			string += `${entry[0]}: ${entry[1]}, `
		})
		return [string]
	} else {
		return ["User not found"]
	}
}

const getMovies = async() => {
	let movies = ""
	const response = await API.movies.get()
	if (response.data.success) {
		response.data.movies.forEach((movie, i) => {
			movies += `${movie.name}${(i < response.data.movies.length - 1) ? ", " : ""} / id: ${movie._id}`
		})
		return [movies]
	} else {
		return []
	}
}

const getDataMovie = async(movieId, specificField = null) => {
	let movie = ""
	const response = await API.movies.byId.get(movieId)
	if (response.data.success) {
		if (specificField === null) {
			movie = response.data.movie[0].ytsData.title
			return [movie]
		} else if (response.data.movie) {
			if (response.data.movie[0].ytsData[specificField] === undefined || specificField === "cast" || specificField === "torrents") {
				return ["The specific field doesn't exist"]
			} else if (specificField === "genres") {
				response.data.movie[0].ytsData[specificField].forEach((genre) => {
					movie += `${genre}, `
				})
				return [movie]
			} else {
				return [response.data.movie[0].ytsData[specificField]]
			}
		}
	} else {
		return ["The movie doesn't exist"]
	}
}

const banUser = async(username, time) => {
	if (username === undefined || time === undefined)
		return ["Argument not renseigned"]

	if (isNaN(parseInt(time, 10)) === true)
		return ["Wrong argument"]

	if (time[time.length - 1] !== "h" && time[time.length - 1] !== "d")
		return ["Wrong argument"]

	if (username === "admin")
		return ["You can't ban admin account"]

	const value = (time[time.length - 1] === "h") ? 60 * 60 : 60 * 60 * 24
	let bantime = time.replace(time[time.length - 1], "")

	if (isNaN(Number(bantime)) === true)
		return ["Wrong argument"]

	bantime = Date.now() + parseInt(bantime, 10) * value * 1000
	try {
		const response = await API.users.ban(username, { bantime })
		if (response.data.success) {
			return [`${username} has been banned successfully`]
		} else {
			return [`${username} doesn't exist`]
		}
	} catch (error) {
		//console.log(error)
	}
	return ["Error"];
}

const unbanUser = async(username) => {
	try {
		const response = await API.users.unban(username)
		if (response.data.success)
			return [`${username} has been unbanned successfully`]
		else
			return [`${username} doesn't exist`]
	} catch (error) {
		//console.log(error)
	}
	return ["Error"];
}

export const commands = async(command, history) => {
	const argv = command.trim().split(" ");
	switch (argv[0]) {

		case "help":
			return [...history, "help", help] // Display list of commands that could be used by the user
		case "clear":
			return [] // Clear the history of terminal
		case "users":
			return [...history, ...await getUsers()] // Display User Collection
		case "user":
			return [...history, ...await getDataUser(argv[1])] // Display user object depends on id (argv[1])
		case "movies":
			return [...history, ...await getMovies()] // Display Movie Collection
		case "movie":
			return [...history, ...await getDataMovie(argv[1], argv[2])] // Display movie object depends on id (argv[1]), specific field [name, ] (argv[2])
		case "ban":
			return [...history, ...await banUser(argv[1], argv[2])] // Ban user - 2 args: user (argv[1]), bantime (argv[2])
		case "unban":
			return [...history, ...await unbanUser(argv[1], argv[2])] // Unan user - 2 args: user (argv[1]), bantime (argv[2])

		default:
			return [...history, `command not found: ${argv[0]}`]

	}
}
