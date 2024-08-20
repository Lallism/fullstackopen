import { useState } from 'react'
import PropTypes from 'prop-types'
import { Typography, TextField, Button, Box } from '@mui/material'

const BlogForm = ({ createBlog }) => {
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

  return (
    <div>
      <Typography variant="h5" component="h3">
        Create new
      </Typography>
      <Box component="form" onSubmit={addBlog}>
        <div>
          <TextField
            variant="standard"
            label="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            sx={{ mt: 1 }}
          />
        </div>
        <div>
          <TextField
            variant="standard"
            label="Author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            sx={{ mt: 1 }}
          />
        </div>
        <div>
          <TextField
            variant="standard"
            label="Url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            sx={{ mt: 1, mb: 1 }}
          />
        </div>
        <Button variant="contained" type="submit" sx={{ m: 1 }}>
          Create
        </Button>
      </Box>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
