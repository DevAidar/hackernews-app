import React from 'react'
import { NavLink } from 'react-router-dom'

const activeStyle = {
  color: 'rgb(187, 46, 31)'
}

export default function Nav() {
  return (
    <nav className='row space-between'>
      <ul className='row row-nav'>
        <li>
          <NavLink
            to='/hackernews-app/'
            exact
            activeStyle={activeStyle}
            className='row-nav-link'
          >
            Top
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/hackernews-app/new/'
            activeStyle={activeStyle}
            className='row-nav-link'
          >
            New
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}