import React, { useState, useEffect, useContext, useRef } from "react";
import { ReactComponent as TerminalIcon } from "svg/terminal.svg";
import { ReactComponent as Close } from "svg/close.svg";
import translations from "translations";
import { commands } from "utils/commandsTerminal";
import { UserConsumer } from "store";

const Terminal = () => {
  const [input, updateInput] = useState("");
  const [show, toggleShow] = useState(false);
  const [history, updateHistory] = useState([]);
  const isCanceled = useRef(false)
  const context = useContext(UserConsumer);
  const { language } = context;

  useEffect(() => {
    return () => {
      isCanceled.current = true
    }
  }, []);

  const handleKeyDown = async e => {
    const key = e.which || e.keyCode;
    const terminal = document.getElementById("terminal");

    if (key === 13 && input.trim() !== "") {
      const response = await commands(input, history);
      if (!isCanceled.current) {
        updateHistory(response);
        updateInput("");
        terminal.scrollTop = terminal.scrollHeight;
      }
    }
  };

  return (
    <div>
      <div className="open-terminal" onClick={() => toggleShow(!show)}>
        <TerminalIcon fill="#fff" width="25" height="25" />
        <span style={{ marginLeft: 15 }}>Terminal</span>
      </div>

      {show ? (
        <div className="terminal" id="terminal">
          <span className="close-icon" onClick={() => toggleShow(false)}>
            <Close width="15" height="15" fill="#fff" />
          </span>
          <div className="terminal-history">
            {history.map((command, index) => {
              return (
                <div
                  key={`command-${index}`}
                  className="terminal-output"
                >
                  {
                    command.split('\n').map((item, i) => {
                      return <p key={i}>{item}</p>
                    })
                  }
                </div>
              );
            })}
          </div>
          <div
            className="row"
            style={{
              alignItems: "center",
              marginTop: 20,
              paddingTop: 20,
              borderTop: "1px solid rgba(255,255,255,.1)"
            }}
          >
            <span style={{ marginRight: 10, marginBottom: 5 }}>$></span>
            <input
              value={input}
              onKeyDown={e => handleKeyDown(e)}
              onChange={e => updateInput(e.target.value)}
              className="terminal-input"
              type="text"
              placeholder={translations[language].terminal.input}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Terminal;
