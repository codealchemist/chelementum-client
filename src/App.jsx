import React, { Component } from 'react'
import { Router } from 'react-router-dom'

import {
  currentUserSvc,
  routesSvc,
  historySvc
} from './services'

import { NavBar, AppRoutes, SiteTitle } from './components'

const ROUTES = routesSvc.get()

const App = () => {
  const me = new Component()

  me.state = {
    currentUser: currentUserSvc.get(),
    currentRoute: historySvc.getCurrentRoute()
  }

  historySvc.listen(() => {
    me.setState({
      currentRoute: historySvc.getCurrentRoute()
    })
  })

  const setCurrentUser = () => {
    me.setState({
      currentUser: currentUserSvc.get()
    })
  }

  me.render = () => (
    <Router history={ historySvc }>
      <div className="app">
        <SiteTitle siteName="CH[elementum]">{me.state.currentRoute.text}</SiteTitle>
        <NavBar
          routes={ ROUTES }
          currentPath={me.state.currentRoute.path}
          permissions={me.state.currentUser.permissions}
        />
        <section className={`app-section app-section-${me.state.currentRoute.name}`}>
          <AppRoutes
            routes={ROUTES}
            permissions={me.state.currentUser.permissions}
            onLogin={setCurrentUser}
            onLogout={setCurrentUser}
          />
        </section>
      </div>
    </Router>
  )

  return me
}

export default App
