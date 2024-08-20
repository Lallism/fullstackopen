import { createSlice } from '@reduxjs/toolkit'
import { setNotification, setNotificationError } from './notificationReducer'
import { logout } from './userReducer'
import resourceService from '../services/resource'

const blogService = resourceService.resource('/api/blogs')

const sortedBlogs = (blogs) => {
  const sorted = [...blogs].sort((a, b) => b.likes - a.likes)
  return sorted
}

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return sortedBlogs(action.payload)
    },
    addBlog(state, action) {
      return state.concat(action.payload)
    },
    incrementLike(state, action) {
      const id = action.payload
      return sortedBlogs(
        state.map((blog) =>
          blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog
        )
      )
    },
    deleteBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
    addComment(state, action) {
      const id = action.payload.id
      const comment = action.payload.comment

      return state.map((blog) =>
        blog.id === id
          ? { ...blog, comments: blog.comments.concat(comment) }
          : blog
      )
    }
  }
})

export const { setBlogs, addBlog, incrementLike, deleteBlog, addComment } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll()
      dispatch(setBlogs(blogs))
    } catch (error) {
      dispatch(logout())
    }
  }
}

export const createBlog = (newBlog, user) => {
  return async (dispatch) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      createdBlog.user = user
      dispatch(addBlog(createdBlog))
      dispatch(
        setNotification(
          `Created blog ${createdBlog.title} by ${createdBlog.author}`,
          5
        )
      )
    } catch (error) {
      dispatch(setNotificationError(error.response.data.error, 5))
    }
  }
}

export const likeBlog = (id, newBlog) => {
  return async (dispatch) => {
    const likedBlog = await blogService.update(id, newBlog)
    dispatch(incrementLike(id))
    dispatch(
      setNotification(`Liked blog ${likedBlog.title} by ${likedBlog.author}`, 5)
    )
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(deleteBlog(id))
    dispatch(setNotification('Blog deleted', 5))
  }
}

export const commentBlog = (id, comment) => {
  return async (dispatch) => {
    const commentService = resourceService.resource(`/api/blogs/${id}/comments`)
    await commentService.create({ comment })
    dispatch(addComment({ id, comment }))
  }
}

export default blogSlice.reducer
