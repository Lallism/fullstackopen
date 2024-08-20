import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { initializeBlogs, createBlog } from '../reducers/blogReducer'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader
} from '@mui/material'

const Blog = ({ blog }) => {
  return (
    <ListItem>
      <ListItemButton component={Link} to={`/blogs/${blog.id}`}>
        <ListItemText>
          {blog.title} {blog.author}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  )
}

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  const dispatch = useDispatch()

  useEffect(() => {
    if (user === null) {
      return
    }
    dispatch(initializeBlogs())
  }, [user])

  const handleCreateBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(newBlog, user))
  }

  const blogFormRef = useRef()

  return (
    <div>
      <Togglable buttonLabel={'New blog'} ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>
      <List>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </List>
    </div>
  )
}

export default Blogs
