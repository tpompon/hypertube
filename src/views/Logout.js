import React, { useState, useEffect } from 'react';
import axios from 'axios'
import config from '../config'
import translations from '../translations'
import Loading from '../components/Loading'
import { ReactComponent as CheckMark } from '../svg/checkmark.svg'

const Logout = (props) => {

  const [disconnected, updateDisconnected] = useState(false)

  useEffect(() => {
    axios.get(`http://${config.hostname}:${config.port}/auth/logout`)
    updateDisconnected(true)
    setTimeout(() => {
      window.location.href = "http://localhost:3000/login";
    }, 1000)
  }, [])

  return (
    <div className="text-center">
      {
        (disconnected) ? (
          <div>
            <CheckMark width="50" height="50" fill="#5CB85C" />
            <p>{translations[props.language].logout.title}</p>
          </div>
        ) : <Loading />
      }
    </div>
  );

}

export default Logout;
