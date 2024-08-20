import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { likeBlog, deleteBlog, commentBlog } from '../reducers/blogReducer'
import { useState } from 'react'
import {
  Typography,
  Link as MuiLink,
  Button,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText
} from '@mui/material'

const Comment = ({ comment }) => {
  return (
    <ListItem>
      <ListItemText>{comment}</ListItemText>
    </ListItem>
  )
}

const BlogView = () => {
  const [comment, setComment] = useState('')

  const id = useParams().id
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  )
  const user = useSelector((state) => state.user)

  const dispatch = useDispatch()

  const handleLike = () => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    dispatch(likeBlog(blog.id, newBlog))
  }

  const handleComment = (event) => {
    event.preventDefault()

    dispatch(commentBlog(blog.id, comment))
    setComment('')
  }

  const handleDelete = () => {
    if (window.confirm(`Delete blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog.id))
    }
  }

  const deleteButton = () => (
    <Button variant="outlined" sx={{ m: 1 }} onClick={handleDelete}>
      delete
    </Button>
  )

  if (!blog) {
    return null
  }

  return (
    <div>
      <Typography variant="h5" component="h2">
        {blog.title}
      </Typography>
      <MuiLink href={blog.url} variant="body1">
        {blog.url}
      </MuiLink>
      <Box display="flex" alignItems="center">
        <Typography>likes {blog.likes}</Typography>
        <Button variant="contained" sx={{ m: 1 }} onClick={handleLike}>
          Like
        </Button>
      </Box>
      <Typography>added by {blog.user.name}</Typography>
      {user.username === blog.user.username && deleteButton()}
      <Typography variant="h5" component="h3" sx={{ mt: 1 }}>
        Comments
      </Typography>
      <Box component="form" sx={{ mt: 1 }}>
        <TextField
          label="New comment"
          variant="standard"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <Button variant="contained" onClick={handleComment} sx={{ m: 1 }}>
          add comment
        </Button>
      </Box>
      <List>
        {blog.comments.map((comment) => (
          <Comment key={Math.random()} comment={comment} />
        ))}
      </List>
    </div>
  )
}

export default BlogView
