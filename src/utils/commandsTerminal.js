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

const getUsers = () => {
	return
}

const getDataUser = (user) => {
	return
}

const getMovies = () => {
	return
}

const getDataMovie = (movieId) => {
	return
}

const banUser = (user, time) => {
	return
}

const getTorrents = (action, id) => {
	return
}

export const commands = (command, history) => {
	const argv = command.trim().split(" ");
	switch (argv[0]) {

		case "help":
			return [...history, "help", help] // Display list of commands that could be used by the user
		case "clear":
			return [] // Clear the history of terminal
		case "users":
			return getUsers() // Display User Collection
		case "user":
			return getDataUser() // Display user object depends on id (argv[1])
		case "movies":
			return getMovies() // Display Movie Collection
		case "movie":
			return getDataMovie() // Display movie object depends on id (argv[1]), specific field [name, ] (argv[2])
		case "ban":
			return banUser() // Ban user - 2 args: user (argv[1]), bantime (argv[2])
		case "torrents":
			return getTorrents() // 2 args - action [infos, delete] (argv[1]), id/name (argv[2])

		default:
			return [...history, argv[0]]

	}
}
