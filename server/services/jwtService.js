const passportJwt = require('jsonwebtoken');

export const tokenSign = (id, username) => {
	return jwt.sign({ id: id, username: username, active: true, auth: true }, 'secret', {
		expiresIn: (60 * 60 * 10), // Random value, gotta look into it
	})
}

export const tokenVerify = (req, res, next) => {
	const token = req.headers['x-session-token']
	const response = {
		state: {
			errors: new Array(),
			error: false
		},
	}

	if (token) {
		if (token == 'null' || token == undefined) {
			const error = {
				payload: 'Undefined token',
				type: 'token'
			}

			reponse.error = true
			response.state.errors.push(error)
			return (res.status(200).send(response))
		}

		try {
			req.decoded = jwt.verify(token, secret)

		}
	}
}
