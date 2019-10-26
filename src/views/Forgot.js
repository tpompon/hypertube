import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchKey = async () => {
      const response = await API.auth.forgotByKey.get(key);
      if (response.data.success) {
        updateStatus("ok");
        updateUser(response.data.user[0]);
        updateIsLoaded(true);
      } else {
        updateStatus("not found");
        updateIsLoaded(true);
      }
    };

    fetchKey();
  }, [key]);

  const validate = async () => {
    // Verify password security and match (make a function for all needed cases, in utility file)
    // Update password in database and delete forgot key

    if (verifyPasswd(password, confirmPassword)) {
      const body = { passwd: password };
      const response = await API.auth.forgotByKey.post(key, body);
      if (response.data.success) {
        console.log("updated");
      } else {
        console.log("error not updated");
      }
    } else {
      console.log("Passwords don't match or not secure, must contains 1 uppercase letter, 1 number and 1 special character");
    }
  };

  return _isLoaded ? (
    <div style={{ textAlign: "center" }}>
      {status === "ok" ? (
        <div className="dark-card center text-center">
          <div>
            <span style={{ fontWeight: "bold" }}>{user.username}</span>, reset
            your password
          </div>
          <input
            value={password}
            onChange={event => updatePassword(event.target.value)}
            className="dark-input"
            type="password"
            placeholder="New password"
            style={{ width: "100%", marginTop: 50, marginBottom: 5 }}
          />
          <input
            value={confirmPassword}
            onChange={event => updateConfirmPassword(event.target.value)}
            className="dark-input"
            type="password"
            placeholder="Confirm password"
            style={{ width: "100%", marginTop: 5, marginBottom: 20 }}
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
