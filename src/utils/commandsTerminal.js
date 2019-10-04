import API from "controllers"

const help =
`
	Voici la liste de commande
	-clear: Effacer l'historique de la console
	-user: Donne les informations lié a l'utilisateur -Prend un argument (le nom)
	-users: Liste la liste des utilisateurs enregistré dans la base de donnéé
	-movies: Liste la liste des films enregistré sur le serveur
	-movie: 
	-ban: Bannir l'utilisateur, prend deux arguments (le nom et le tempsdu bannissement)
	-torrents: prend deux arguments (action (les infos ou la suppression) et le nom)
`

const getUsers = async() => {
	let users = ""
	const response = await API.users.get()
	if (response.data.success) {
		response.data.users.map((user, i) => {
			users += `${user.username}${(i < response.data.users.length - 1) ? ", " : ""}`
		})
		return [users]
	} else {
		return []
	}
}

const getDataUser = async(user) => {
	const response = await API.user.byUsername.get(user)
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
		response.data.movies.map((movie, i) => {
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
			movie = response.data.movie[0].name
			return [movie]
		} else {
			if (response.data.movie[0][specificField] === undefined) {
				return ["The specific field doesn't exist"]
			} else {
				return [response.data.movie[0][specificField]]
			}
		}
	} else {
		return ["The movie doesn't exist"]
	}
}

const banUser = (user, time) => {
	return
}

const getTorrents = (action, id) => {
	return
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
			return banUser() // Ban user - 2 args: user (argv[1]), bantime (argv[2])
		case "torrents":
			return getTorrents() // 2 args - action [infos, delete] (argv[1]), id/name (argv[2])

		default:
			return [...history, `command not found: ${argv[0]}`]

	}
}
