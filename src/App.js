import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import config from './config'
import './App.css';
import Header from './components/Header'
import Footer from './components/Footer'
import Terminal from './components/Terminal'

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
import Forgot from './views/Forgot'
import NotFound from './views/NotFound'
import Loading from './components/Loading'

import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { UserConsumer } from './store';

const App = () => {
  
  const [_isAuth, updateIsAuth] = useState(false)
  const [_isLoaded, updateIsLoaded] = useState(false)
  const context = useContext(UserConsumer)

  useEffect(() => {
    axios.get(`http://${config.hostname}:${config.port}/auth`)
      .then((res) => {
        if (res.data.auth) {
          updateIsAuth(true)
          updateIsLoaded(true)
        }
        else {
          updateIsLoaded(true)
        }
      })
  }, [])

  const { language } = context
  return (
    <Router>
      <div className="App">
        <div className="App-wrapper">
          <Header language={language} extended={true} />
          {
            _isLoaded ? (
              <Switch>
                <Route exact path='/' component={(props) => (
                  _isAuth ? <MoviesList {...props} language={language} /> : <Redirect to="/login" />
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
                  _isAuth ? <Search {...props} language={language} /> : <Redirect to="/login" />
                )}/>

                <Route exact path='/confirm/:key' component={(match) => <Confirm {...match} language={language} />} />
                <Route exact path='/forgot/:key' component={(match) => <Forgot {...match} language={language} />} />

                <Route component={() => <NotFound language={language} />} />
              </Switch>
            ) : (
              <Loading />
            )
          }
        </div>

        <Terminal />

        <Footer language={language} />
      </div>
    </Router>
  );
}

export default App;
