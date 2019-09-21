import React from 'react';
import axios from 'axios'
import config from './config'
import './App.css';
import Header from './components/Header'
import Footer from './components/Footer'

import Search from './views/Search'

import Movie from './views/Movie'
import MoviesList from './views/MoviesList'
import Profile from './views/Profile'
import User from './views/User'
import Settings from './views/Settings'
import Register from './views/Register'
import Login from './views/Login'
import Logout from './views/Logout'
import Confirm from './views/Confirm'
import NotFound from './views/NotFound'
import Loading from './components/Loading'

import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: "",
      language: "fr",
      _isAuth: false,
      _isLoaded: false
    }
  }

  componentDidMount() {
    axios.get(`http://${config.hostname}:${config.port}/auth`)
      .then((res) => {
        if (res.data.auth)
          this.setState({_isAuth: true, _isLoaded: true})
        else
          this.setState({_isAuth: false, _isLoaded: true})
      })
  }

  updateSearch = (input) => {
    this.setState({search: input});
  }

  render() {
    const { search, language, _isAuth, _isLoaded } = this.state;

    return (
      <Router>
        <div className="App">
          <div className="App-wrapper">
            <Header updateSearch={this.updateSearch} language={language} extended={true} />
            {
              _isLoaded ? (
                <Switch>
                  <Route exact path='/' component={(props) => (
                    _isAuth ? <MoviesList {...props} search={search} language={language} /> : <Redirect to="/login" />
                  )}/>
                  <Route exact path='/watch/:id' component={(match) => (
                    _isAuth ? <Movie {...match} language={language} /> : <Redirect to="/login" />
                  )}/>
                  <Route exact path='/user/:username' component={(match) => (
                    _isAuth ? <User {...match} language={language} /> : <Redirect to="/login" />
                  )}/>
                  <Route exact path='/profile' component={(props) => (
                    _isAuth ? <Profile {...props} language={language} /> : <Redirect to="/login" />
                  )}/>
                  <Route exact path='/settings' component={(props) => (
                    _isAuth ? <Settings {...props} language={language} /> : <Redirect to="/login" />
                  )}/>
                  <Route exact path='/logout' component={(props) => (
                    _isAuth ? <Logout {...props} language={language} /> : <Redirect to="/login" />
                  )}/>
                  <Route exact path='/register' component={(props) => (
                    _isAuth ? <Redirect to ="/" /> : <Register {...props} language={language} />
                  )}/>
                  <Route exact path='/login' component={(props) => (
                    _isAuth ? <Redirect to ="/" /> : <Login {...props} language={language} />
                  )}/>

                  <Route exact path='/search' component={(props) => (
                    _isAuth ? <Search {...props} search={search} language={language} /> : <Redirect to="/login" />
                  )}/>

                  <Route exact path='/confirm/:key' component={(match) => <Confirm {...match} language={language} />} />

                  <Route component={() => <NotFound language={language} />} />
                </Switch>
              ) : (
                <Loading />
              )
            }
          </div>
          <Footer language={language} />
        </div>
      </Router>
    );
  }
}

export default App;
