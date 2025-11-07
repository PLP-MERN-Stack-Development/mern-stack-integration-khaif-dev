import React from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/api'

const Navbar = () => {
  const user = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    window.location.href = '/'
  }

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          MERN Blog
        </Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/posts" className="hover:underline">
            Posts
          </Link>
          {user && (
            <Link to="/posts/create" className="hover:underline">
              Create Post
            </Link>
          )}
          <Link to="/categories" className="hover:underline">
            Categories
          </Link>
          {user ? (
            <>
              <span className="text-sm">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="hover:underline bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="hover:underline">
                Sign Up
              </Link>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
