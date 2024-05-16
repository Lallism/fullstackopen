import {useState} from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({createBlog}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    setTitle('')
    setAuthor('')
    setUrl('')

    createBlog(newBlog)
  }

  return(
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            value={title}
            name='Title'
            onChange={({target}) => setTitle(target.value)}
            id='title'
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            value={author}
            name='Author'
            onChange={({target}) => setAuthor(target.value)}
            id='author'
          />
        </div>
        <div>
          <label htmlFor="url">Url:</label>
          <input
            type="text"
            value={url}
            name='Url'
            onChange={({target}) => setUrl(target.value)}
            id='url'
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm