import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom'
import Notification from './components/Notification'
import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import resourceService from './services/resource'
import { login, logout, setUser } from './reducers/userReducer'
import BlogView from './components/BlogView'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  AppBar,
  Toolbar
} from '@mui/material'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const user = useSelector((state) => state.user)

  const dispatch = useDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      resourceService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    setUsername('')
    setPassword('')
    dispatch(login(username, password))
  }

  const handleLogout = async () => {
    dispatch(logout())
  }

  if (user === null) {
    return (
      <Container>
        <Typography variant="h4" component="h2" sx={{ mt: 2 }}>
          Login
        </Typography>
        <Notification />
        <Box component="form" onSubmit={handleLogin}>
          <div>
            <TextField
              margin="normal"
              label="Username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <TextField
              margin="normal"
              label="Password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button color="inherit" component={Link} to="/">
              blogs
            </Button>
            <Button color="inherit" component={Link} to="/users">
              users
            </Button>
          </Box>
          <Typography sx={{ ml: 2 }}>logged in as {user.name}</Typography>
          <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Typography variant="h4" component="h2" sx={{ mt: 2 }}>
          Blog app
        </Typography>
        <Notification />
        <Routes>
          <Route path="/" element={<Blogs />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogView />} />
        </Routes>
      </Container>
    </Router>
  )
}

export default App
