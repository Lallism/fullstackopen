import {useState, useEffect, useRef} from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (user === null) {
      return
    }
    blogService.getAll().then(blogs =>
      setBlogs( sortedBlogs(blogs) )
    ).catch(error => {
      handleLogout()
    })
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const sortedBlogs = (blogs) => {
    blogs.sort((a, b) => b.likes - a.likes)
    return blogs
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})

      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      errorNotification('wrong username or password')
    }
  }

  const handleLogout = async (event) => {
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
  }

  const createBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(newBlog)
      returnedBlog.user = user
      setBlogs(blogs.concat(returnedBlog))
      notification(`Created blog ${returnedBlog.title} by ${returnedBlog.author}`)
    } catch (error) {
      errorNotification(error.response.data.error)
    }
  }

  const likeBlog = async (id, newBlog) => {
    await blogService.update(id, newBlog)
    const blogs = await blogService.getAll()
    setBlogs(sortedBlogs(blogs))
  }

  const deleteBlog = async (id) => {
    await blogService.remove(id)
    setBlogs(blogs.filter((blog) => blog.id !== id))
  }

  const notification = (message) => {
    setMessage(message)
    setTimeout(() => setMessage(null), 5000)
  }

  const errorNotification = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 5000)
  }

  const blogFormRef = useRef()

  if (user === null) {
    return (
      <div>
        <h2>Login</h2>
        <Notification message={message} className={'notification'} />
        <Notification message={errorMessage} className={'error'} />
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor='username'>Username</label>
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({target}) => setUsername(target.value)}
              id='username'
            />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input
              type="text"
              value={password}
              name="Password"
              onChange={({target}) => setPassword(target.value)}
              id='password'
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} className={'notification'} />
      <Notification message={errorMessage} className={'error'} />
      logged in as {user.name}
      <button onClick={handleLogout}>logout</button>

      <Togglable buttonLabel={'New blog'} ref={blogFormRef}>
        <BlogForm createBlog={createBlog}/>
      </Togglable>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} user={user} />
        )}
      </div>
    </div>
  )
}

export default App