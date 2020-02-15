import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Join from './components/Join'
import Chat from './components/Chat'
import post from './components/post'


const App = () => {
  return (
    <BrowserRouter>
      <Switch>
      <Route path="/chat" component={Chat}/>
        <Route path="/post" component={post}/>
        <Route path="/" exect={true} component={Join}/>

      </Switch>
    </BrowserRouter>
  )
}

export default App