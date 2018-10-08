import React from 'react'
import { currentUserSvc } from 'services'

const Logout = ({
  onSuccess = () => {},
  onCancel = () => {}
}) => {
  const confirm = () => {
    currentUserSvc.logout().then((userData) => {
      onSuccess(userData)
    })
  }

  return (
    <div className="container">
      <form onSubmit={(e) => {
        e.preventDefault()
        confirm()
      }} className="form-signin">
        <h2 className="form-signin-heading">Logout</h2>
        <p>Are you sure you want to log out?</p>
        <button type="submit" className="btn btn-primary" onClick={ confirm }>Yes</button>
        <button type="button" className="btn btn-secondary" onClick={ onCancel }>No</button>
      </form>
    </div>
  )
}

export default Logout
