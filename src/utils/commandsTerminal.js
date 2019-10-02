export const commands = (command) => {
	const argv = command.split(" ");

	switch (argv[0]) {

		case "help":
			return {} // Display list of commands that could be used by the user
		case "clear":
			return {} // Clear the history of terminal
		case "users":
			return {} // Display User Collection
		case "user":
				return {} // Display user object depends on id (argv[1])
		case "movies":
			return {} // Display Movie Collection
		case "movie":
			return {} // Display movie object depends on id (argv[1]), specific field [name, ] (argv[2])
		case "ban":
			return {} // Ban user - 2 args: user (argv[1]), bantime (argv[2])
		case "torrents":
			return {} // 2 args - action [infos, delete] (argv[1]), id/name (argv[2])


		default:
			return {}

	}
}
