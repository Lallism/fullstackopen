import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    likeBlog(blog.id, newBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Delete blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  const deleteButton = () => <button onClick={handleDelete}>delete</button>

  return (
    <div className="blog">
      {blog.title} {blog.author}
      <button onClick={toggleVisibility} style={hideWhenVisible}>
        view
      </button>
      <button onClick={toggleVisibility} style={showWhenVisible}>
        hide
      </button>
      <div style={showWhenVisible} className="togglableContent">
        {blog.url} <br />
        {blog.likes}
        <button onClick={handleLike}>like</button> <br />
        {blog.user.name} <br />
        {user.username === blog.user.username && deleteButton()}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog
