import React, { useState, useEffect, useContext } from 'react'

const Terminal = () => {

	const [show, toggleShow] = useState(false);

	useEffect(() => {
		// DidMount
	}, []);

	return (
		<div>
			<div id="term" className="terminal">
				<input className="terminal-input" type="text" placeholder="$> Enter command" />
			</div>
		</div>
	);
}

export default Terminal;
