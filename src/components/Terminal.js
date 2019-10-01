import React, { useState, useEffect, useContext } from 'react'
import { ReactComponent as TerminalIcon } from '../svg/terminal.svg'
import { ReactComponent as Close } from '../svg/close.svg'

const Terminal = () => {

	const [input, updateInput] = useState("")
	const [show, toggleShow] = useState(false);
	const [history, updateHistory] = useState([]);

	useEffect(() => {
		// DidMount
	}, []);
 
	const handleKeyDown = (e) => {
		const key = e.which || e.keyCode;
		if (key === 13 && input.trim() !== '') {
			updateHistory([...history, input]);
			updateInput("");
		}
	}

	return (
		<div>
			<div className="open-terminal" onClick={() => toggleShow(!show)}>
				<TerminalIcon fill="#fff" width="25" height="25" />
				<span style={{ marginLeft: 15 }}>Terminal</span>
			</div>

			{
				show ? (
					<div className="terminal">
						<span className="close-icon" onClick={() => toggleShow(false)}><Close width="15" height="15" fill="#fff" /></span>
						<div className="terminal-history">
						{
							history.map((command, index) => {
								return (
									<div key={`command-${index}`} onClick={e => updateInput(e.target.innerHTML)} className="terminal-output">{command}</div>
								)
							})
						}
						</div>
						<div className="row" style={{alignItems: 'center', marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,.1)'}}>
							<span style={{marginRight: 10, marginBottom: 5}}>$></span>
							<input value={input} onKeyDown={(e) => handleKeyDown(e)} onChange={e => updateInput(e.target.value)} className="terminal-input" type="text" placeholder="Enter command" />
						</div>
					</div>
				) : null
			}
		</div>
	);
}

export default Terminal;
