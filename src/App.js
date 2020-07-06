import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Nav from './components/Nav';
import Posts from './components/Posts';
import Post from './components/Post';
import User from './components/User';

import './App.css';

const App = () => {

  return (
    <div className='light'>
      <div className='container'>
        <Nav />

        <Switch>
          <Route exact path='/'>
            <Redirect to='/hacker-news-app/' />
          </Route>
          <Route
            exact
            path='/hacker-news-app/'
            render={() => <Posts type='top' />}
          />
          <Route
            path='/hacker-news-app/new'
            render={() => <Posts type='new' />}
          />
          <Route path='/hacker-news-app/post/:id' component={Post} />
          <Route path='/hacker-news-app/user/:username' component={User} />
          <Route render={() => <h1>404 Page Not Found</h1>} />
        </Switch>
      </div>
    </div>
  )
}

export default App;
