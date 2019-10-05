import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import translations from "../translations";
import Loading from "components/Loading";
import { ReactComponent as CheckMark } from "svg/checkmark.svg";

import API from "controllers";

const Confirm = props => {
  const { key } = props.match.params;
  const [status, updateStatus] = useState("");
  const [_isLoaded, updateIsLoaded] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await API.auth.confirm({ key });
    console.log(response.data);
    if (response.data.success) {
      updateStatus("ok");
      updateIsLoaded(true);
      setTimeout(() => {
        window.location.href = "http://localhost:3000/login";
      }, 1000);
    } else {
      updateStatus("not found");
      updateIsLoaded(true);
    }
  };

  return _isLoaded ? (
    <div style={{ textAlign: "center" }}>
      {status === "ok" ? (
        <div>
          <CheckMark width="50" height="50" fill="#5CB85C" />
          <div>Account confirmed</div>
        </div>
      ) : (
        (window.location.href = "http://localhost:3000/")
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default withRouter(Confirm);
