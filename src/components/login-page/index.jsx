import React, { Component } from 'react'
import { clone } from 'lodash'

import { currentUserSvc } from 'services'
import './index.css'

const Login = ({
  onSuccess = () => {}
}) => {
  const me = new Component()

  me.state = {
    data: {
      username: '',
      company: 'chelementum',
      password: ''
    },
    isLoading: false
  }

  const changeField = (event, target = event.target) => {
    me.setState({
      data: Object.assign(clone(me.state.data), {
        [target.name]: target.value
      })
    })
  }

  const submit = () => {
    me.setState({ isLoading: true })

    currentUserSvc.login(me.state.data)
    .then(onSuccess)
    .catch(msg => {
      alert(msg)
    }).then(() => {
      me.setState({ isLoading: false })
    })
  }


  me.render = () => (
    <div className="container">
      <form onSubmit={(e) => {
        e.preventDefault()
        submit()
      }} className="form-signin">

        <h2 className="form-signin-heading">Please Login</h2>

        <div className="form-group">
          <input placeholder="Username" className="form-control" name="username" type="text" required value={ me.state.data.username } onChange={ changeField } />
        </div>

        <div className="form-group">
          <input placeholder="Company" className="form-control" name="company" type="text" required value={ me.state.data.company } onChange={ changeField } />
        </div>

        <div className="form-group">
          <input placeholder="Password" name="password" className="form-control" type="password" required value={ me.state.data.password } onChange={ changeField } />
        </div>

        <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={ me.state.isLoading }>
          { me.state.isLoading ? 'Loading' : 'Login' }
        </button>

      </form>
    </div>
  )

  return me
}

export default Login
