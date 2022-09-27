import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Menu from './components/Menu'
import Blog from './components/Blog'
import BlogOpen from './components/BlogOpen'
import Togglable from './components/Togglable'
import BlogSubmitForm from './components/BlogSubmitForm'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'
import { Form, Button } from 'react-bootstrap'
import loginService from './services/login'
import userService from './services/users'
import './index.css'
import { setNotification } from './reducers/notificationReducer'
import {
  initializeBlogs,
  createBlog,
  deleteBlog,
  addLike,
  addComment
} from './reducers/blogsReducer'
import { loginUser, logoutUser } from './reducers/userReducer'
import { Routes, Route, useNavigate, useMatch } from 'react-router-dom'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState(null)
  const [refreshUsers, setRefreshUsers] = useState(0)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    userService.getUsers().then((response) => {
      setUsers(response)
    })
  }, [refreshUsers])

  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('trying login')
    try {
      const user = await loginService.login({
        username,
        password
      })
      dispatch(loginUser(user))
      console.log('login successful')
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (exception) {
      console.log('login failed')
      dispatch(setNotification('wrong username or password', 'error', 5))
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const handleCreateBlog = (blog) => {
    console.log('Submitting blog with', blog.title, blog.author, blog.url)
    try {
      dispatch(createBlog(blog))
      setRefreshUsers(refreshUsers + 1)
      blogFormRef.current.toggleVisibility()
      dispatch(
        setNotification(
          `a new blog ${blog.title} by ${blog.author} added`,
          'confirmation',
          5
        )
      )
    } catch (exception) {
      console.log('blog submit error')
    }
  }

  const handleLike = (blog) => {
    console.log('Liked blog: ', blog.title)
    try {
      dispatch(addLike(blog))
      setRefreshUsers(refreshUsers + 1)
    } catch (exception) {
      console.log('like submit error')
    }
  }

  const handleAddComment = (blog, comment) => {
    console.log('Commented: ', comment)
    try {
      dispatch(addComment(blog, comment))
    } catch (exception) {
      console.log('comment submit error')
    }
  }

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      console.log('delete blog: ', blog.title)
      try {
        dispatch(deleteBlog(blog))
        setRefreshUsers(refreshUsers + 1)
        navigate('/')
      } catch (exception) {
        console.log('delete request error')
      }
    }
  }

  const matchUser = useMatch('/users/:id')
  const matchedUser = matchUser
    ? users.find((user) => user.id === matchUser.params.id)
    : null

  const matchBlog = useMatch('/blogs/:id')
  const matchedBlog = matchBlog
    ? blogs.find((blog) => blog.id === matchBlog.params.id)
    : null

  if (user === null) {
    return (
      <div className="container">
        <h2>Log in to application</h2>
        <Notification />
        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>username:</Form.Label>
            <Form.Control
              id="username"
              type="text"
              name="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
            <Form.Label>password:</Form.Label>
            <Form.Control
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            <Button variant="primary" type="submit" id="loginButton">
              login
            </Button>
          </Form.Group>
        </Form>
      </div>
    )
  }
  return (
    <div className="container">
      <Menu name={user.name} handleLogout={handleLogout} />
      <h2>blog app</h2>
      <Notification />
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <BlogOpen
              blog={matchedBlog}
              user={user}
              handleLike={handleLike}
              handleDelete={handleDelete}
              handleAddComment={handleAddComment}
            />
          }
        />
        <Route path="/users/:id" element={<User user={matchedUser} />} />
        <Route path="/users" element={<Users users={users} />} />
        <Route
          path="/"
          element={
            <div>
              <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <BlogSubmitForm createBlog={handleCreateBlog} />
              </Togglable>
              {blogs.map((blog) => (
                <Blog key={blog.id} blog={blog} />
              ))}
            </div>
          }
        />
      </Routes>
    </div>
  )
}

export default App
