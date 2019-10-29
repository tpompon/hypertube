import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import Loading from "components/Loading";
import Button from "components/Button";
import API from "controllers";
import { verifyPasswd } from "utils/functions"

const Forgot = props => {
  const { key } = props.match.params;
  const [user, updateUser] = useState({});
  const [password, updatePassword] = useState("");
  const [confirmPassword, updateConfirmPassword] = useState("");
  const [status, updateStatus] = useState("");
  const [_isLoaded, updateIsLoaded] = useState(false);
  const isCanceled = useRef(false)
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      isCanceled.current = true
    }
  }, [])

  useEffect(() => {
    const fetchKey = async () => {
      const response = await API.auth.forgotByKey.get(key);
      if (!isCanceled.current && response.data.success) {
        updateStatus("ok");
        updateUser(response.data.user[0]);
        updateIsLoaded(true);
      } else if (!isCanceled.current) {
        updateStatus("not found");
        updateIsLoaded(true);
      }
    };

    fetchKey();
  }, [key]);

  const validate = async () => {

    if (!isCanceled.current) {
      setSuccess(false);
      setError(null);
    }

    if (verifyPasswd(password, confirmPassword)) {
      const body = { passwd: password };
      const response = await API.auth.forgotByKey.post(key, body);
      if (!isCanceled.current && response.data.success) {
        setSuccess(true);
      } else if (!isCanceled.current) {
        setError("Sorry, an error occured");
      }
    } else {
      setError("Passwords don't match or not secure, must contains 1 uppercase letter, 1 number and 1 special character");
    }
  };

  const onEnter = e => {
    if (e.keyCode === 13) validate();
  };

  return _isLoaded ? (
    <div style={{ textAlign: "center" }}>
      {status === "ok" ? (
        <div className="dark-card center text-center">
          <div>
            <span style={{ fontWeight: "bold" }}>{user.username}</span>, reset your password
          </div>

          <div style={{marginTop: 20}}>
          {
            success ? (
              <div
                className="success"
                style={{ display: "block" }}
                onClick={() => setSuccess(false)}
              >
                Password has been reset successfully
              </div>
            ) : null
          }

          {
            error ? (
              <div
                id="error"
                className="error" style={{display: 'block', width: '100%'}}
                onClick={() => { document.getElementById("error").style.display = "none"; setError(null); }}
              >
                {error}
              </div>
            ) : null
          }
          </div>

          <input
            value={password}
            onChange={event => updatePassword(event.target.value)}
            className="dark-input"
            type="password"
            placeholder="New password"
            style={{ width: "100%", marginTop: 20, marginBottom: 5 }}
            onKeyDown={(e) => onEnter(e)}
          />
          <input
            value={confirmPassword}
            onChange={event => updateConfirmPassword(event.target.value)}
            className="dark-input"
            type="password"
            placeholder="Confirm password"
            style={{ width: "100%", marginTop: 5, marginBottom: 20 }}
            onKeyDown={(e) => onEnter(e)}
          />
          <div className="row" style={{ justifyContent: "space-around" }}>
            <div style={{ display: "table" }} onClick={() => validate()}>
              <Button content="Submit" />
            </div>
          </div>
        </div>
      ) : (
        <div>Key doesn't exist</div>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default withRouter(Forgot);
