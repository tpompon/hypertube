import React from 'react'
import axios from 'axios'
import config from '../config'
import translations from '../translations'
import Loading from '../components/Loading'
import { ReactComponent as CheckMark } from '../svg/checkmark.svg'
import Button from '../components/Button'

class Forgot extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      key: this.props.match.params.key,
      user: {},
      status: ''
    }
    this.password = React.createRef();
    this.password2 = React.createRef();
  }

  componentDidMount() {
    // check if key exist
    // display form to reset or not
    // request to delete key and update password
    axios.get(`${config.serverURL}/auth/forgot/${this.state.key}`)
    .then((res) => {
      if (res.data.success) {
        this.setState({ status: 'ok', user: res.data.user[0], _isLoaded: true });
      } else {
        this.setState({ status: 'not_found', _isLoaded: true});
      }
    })
  }

  updatePassword = () => {
    const password = this.password.current.value;
    const password2 = this.password2.current.value;

    // Verify password security and match (make a function for all needed cases, in utility file)
    // Update password in database and delete forgot key

    if (password === password2 && password.length >= 8) {
      const body = { passwd: password };
      axios.post(`${config.serverURL}/auth/forgot/${this.state.key}`, body)
      .then((res) => {
        if (res.data.success) {
          console.log('updated');
        } else {
          console.log('error not updated')
        }
      })
    } else {
      console.log('Password not safe/doesn\'t match');
    }
  }

  render() {
    const { _isLoaded, status, user } = this.state;
    return (
      _isLoaded ? (
        <div style={{textAlign: 'center'}}>
          {
            status === 'ok' ? (
              <div className="dark-card center text-center">
                <div><span style={{fontWeight: 'bold'}}>{user.username}</span>, reset your password</div>
                <input ref={this.password} className="dark-input" type="password" placeholder="New password" style={{width: '100%', marginTop: 50, marginBottom: 5}} />
                <input ref={this.password2} className="dark-input" type="password" placeholder="Confirm password" style={{width: '100%', marginTop: 5, marginBottom: 20}} />
                <div className="row" style={{ justifyContent: 'space-around' }}>
                  <div style={{ display: 'table' }} onClick={() => this.updatePassword()}><Button content="Submit" /></div>
                </div>
              </div>
            ) : (
              <div>
                Key doesn't exist
              </div>
            )
          }
        </div>
      ) : (
        <Loading />
      )
    )
  }
}

export default Forgot
