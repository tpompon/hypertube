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

const App = () => {
  
  const [_isAuth, updateIsAuth] = useState(false)
  const [_isLoaded, updateIsLoaded] = useState(false)

  useEffect(() => {
    axios.get(`http://${config.hostname}:${config.port}/auth`)
      .then((res) => {
        if (res.data.auth) {
          updateIsAuth(true)
          //updateIsLoaded(true)
        }
        updateIsLoaded(true)
        //else {
        //  updateIsLoaded(true)
        //}
      })
  }, [])

  return (
    <Router>
      <div className="App">
        <div className="App-wrapper">
          <Header extended={true} />
          {
            _isLoaded ? (
              <Switch>
                <Route exact path='/' component={() => (
                  _isAuth ? <MoviesList /> : <Redirect to="/login" />
                )}/>
                <Route exact path='/watch/:id' component={() => (
                  _isAuth ? <Movie /> : <Redirect to="/login" />
                )}/>
                <Route exact path='/user/:username' component={() => (
                  _isAuth ? <User /> : <Redirect to="/login" />
                )}/>
                <Route exact path='/profile' component={() => (
                  _isAuth ? <Profile /> : <Redirect to="/login" />
                )}/>
                <Route exact path='/settings' component={() => (
                  _isAuth ? <Settings /> : <Redirect to="/login" />
                )}/>
                <Route exact path='/logout' component={() => (
                  _isAuth ? <Logout /> : <Redirect to="/login" />
                )}/>
                <Route exact path='/register' component={() => (
                  _isAuth ? <Redirect to ="/" /> : <Register />
                )}/>
                <Route exact path='/login' component={() => (
                  _isAuth ? <Redirect to ="/" /> : <Login />
                )}/>

                <Route exact path='/search' component={() => (
                  _isAuth ? <Search /> : <Redirect to="/login" />
                )}/>
                <Route exact path='/confirm/:key' component={() => <Confirm />} />
                <Route exact path='/forgot/:key' component={() => <Forgot />} />
                <Route component={() => <NotFound />} />
              </Switch>
            ) : (
              <Loading />
            )
          }
        </div>

        <Terminal />

        <Footer />
      </div>
    </Router>
  );
}

export default App