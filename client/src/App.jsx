import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PostsProvider } from './contexts/PostsContext'
import Layout from './components/Layout'
import Home from './Pages/Home'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import Posts from './Pages/Posts'
import PostDetail from './Pages/PostDetail'
import Categories from './Pages/Categories'
import PostForm from './components/PostForm'

const App = () => {
  return (
    <PostsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="posts" element={<Posts />} />
            <Route path="posts/:id" element={<PostDetail />} />
            <Route path="posts/create" element={<PostForm />} />
            <Route path="posts/:id/edit" element={<PostForm isEdit={true} />} />
            <Route path="categories" element={<Categories />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PostsProvider>
  )
}

export default App
