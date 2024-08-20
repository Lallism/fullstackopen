import { createSlice } from '@reduxjs/toolkit'
import { setNotificationError } from './notificationReducer'
import loginService from '../services/login'
import resourceService from '../services/resource'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    }
  }
})

export const { setUser } = userSlice.actions

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      resourceService.setToken(user.token)
      dispatch(setUser(user))
    } catch (error) {
      dispatch(setNotificationError('wrong username or password', 5))
    }
  }
}

export const logout = () => {
  return async (dispatch) => {
    dispatch(setUser(null))
    window.localStorage.removeItem('loggedInUser')
  }
}

export default userSlice.reducer
