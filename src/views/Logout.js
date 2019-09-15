import React from 'react';
import axios from 'axios'
import config from '../config'
import translations from '../translations'
import Loading from '../components/Loading'
import { ReactComponent as CheckMark } from '../svg/checkmark.svg'

class Logout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      disconnected: false
    }
  }

  componentDidMount() {
    axios.get(`http://${config.hostname}:${config.port}/auth/logout`)
      .then(() => {
        this.setState({disconnected: true});
        setTimeout(() => {
          window.location.href = "http://localhost:3000/login";
        }, 1000)
      })
  }

  render() {
    const { language } = this.props;

    return (
      <div className="text-center">
        {
          (this.state.disconnected) ? (
            <div>
              <CheckMark width="50" height="50" fill="#5CB85C" />
              <p>{translations[language].logout.title}</p>
            </div>
          ) : <Loading />
        }
      </div>
    );
  }
}

export default Logout;
