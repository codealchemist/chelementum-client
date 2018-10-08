import React from 'react'
import { Link } from 'react-router-dom'

import './styles.css'
import chelementum from './chelementum.jpg'

const NavBar = ({ routes, permissions, currentPath }) => {
  const allowedRoutes = routes.filter(route =>
    permissions.includes(route.name)
  )

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <Link to="/" className="navbar-brand">
        <img src={chelementum} />
      </Link>

      <div className="container flex-sm-row">
        <ul className="navbar-nav flex-wrap flex-sm-nowrap">
        {allowedRoutes.map((route, key) => (
          <li className="nav-item" key={ key }>
            <Link className={ `nav-link ${ route.path === currentPath ? 'active' : '' }`} to={ route.path }>{ route.text }</Link>
          </li>
        ))}
        </ul>
      </div>
    </nav>
  )
}

export default NavBar
