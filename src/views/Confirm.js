import React from 'react'
import axios from 'axios'
import config from '../config'
import translations from '../translations'
import Loading from '../components/Loading'
import { ReactComponent as CheckMark } from '../svg/checkmark.svg'

class Confirm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      key: this.props.match.params.key,
      status: ''
    }
  }

  componentDidMount() {
    axios.post(`${config.serverURL}/auth/confirm`, { key: this.state.key })
    .then((res) => {
      if (res.data.success) {
        this.setState({ status: 'ok', _isLoaded: true });
        setTimeout(() => {
          window.location.href = "http://localhost:3000/login";
        }, 1000);
      } else {
        this.setState({ status: 'not_found', _isLoaded: true })
      }
    });
  }

  render() {
    const { _isLoaded, status } = this.state;
    return (
      _isLoaded ? (
        <div style={{textAlign: 'center'}}>
          {
            status === 'ok' ? (
              <div>
                <CheckMark width="50" height="50" fill="#5CB85C" />
                <div>Account confirmed</div>
              </div>
            ) : (
              this.props.history.push('/')
            )
          }
        </div>
      ) : (
        <Loading />
      )
    )
  }
}

export default Confirm
